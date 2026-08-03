// The upsell rule lives here, on its own, with no database import, so the
// cart in the browser and the order route on the server can run the exact
// same calculation. If these ever diverged, a customer would be shown one
// price and charged another.
//
// The rule: the customer has to be buying something already before a book
// can drop to the upsell price.
//   - Books only: the most expensive copy stays at full price and every
//     other copy drops to the upsell price.
//   - With a Special Offer in the cart: the offer itself counts as that
//     first purchase, so every eligible book drops straight away.
// The Special Offer keeps its own price either way, and books already
// discounted by a Promotion are left alone so the two offers never stack.

export type UpsellConfig = {
  enabled: boolean;
  price: number;
  title: string;
  subtitle: string;
};

export type UpsellInputItem = {
  key: string;
  isBook: boolean;
  promoApplied: boolean;
  unitPrice: number;
  quantity: number;
};

/** One price bucket inside a cart line, e.g. "1 at 129" + "2 at 69". */
export type UpsellGroup = {
  price: number;
  quantity: number;
};

export type UpsellLine = {
  key: string;
  groups: UpsellGroup[];
  lineTotal: number;
  originalTotal: number;
};

export type UpsellResult = {
  lines: UpsellLine[];
  total: number;
  originalTotal: number;
  discount: number;
  applied: boolean;
};

function buildResult(lines: UpsellLine[]): UpsellResult {
  const total = lines.reduce((sum, l) => sum + l.lineTotal, 0);
  const originalTotal = lines.reduce((sum, l) => sum + l.originalTotal, 0);

  return {
    lines,
    total,
    originalTotal,
    discount: originalTotal - total,
    applied: originalTotal > total,
  };
}

function undiscountedLines(items: UpsellInputItem[]): UpsellLine[] {
  return items.map((item) => {
    const quantity = Math.max(0, Math.floor(item.quantity));
    const lineTotal = item.unitPrice * quantity;

    return {
      key: item.key,
      groups: quantity > 0 ? [{ price: item.unitPrice, quantity }] : [],
      lineTotal,
      originalTotal: lineTotal,
    };
  });
}

export function applyUpsellPricing(
  items: UpsellInputItem[],
  config: UpsellConfig
): UpsellResult {
  if (!config.enabled || config.price <= 0) {
    return buildResult(undiscountedLines(items));
  }

  // Flatten every line into single units so "the second book" means the
  // second physical copy, not the second row in the cart.
  const units: Array<{
    itemIndex: number;
    price: number;
    isBook: boolean;
    eligible: boolean;
  }> = [];

  items.forEach((item, itemIndex) => {
    const quantity = Math.max(0, Math.floor(item.quantity));

    for (let i = 0; i < quantity; i++) {
      units.push({
        itemIndex,
        price: item.unitPrice,
        isBook: item.isBook,
        eligible:
          item.isBook &&
          !item.promoApplied &&
          item.unitPrice > config.price,
      });
    }
  });

  const bookUnits = units.filter((u) => u.isBook);

  // A Special Offer already is a purchase, so a book added next to one is
  // the second item and earns the offer price on its own.
  const hasOfferUnit = units.some((u) => !u.isBook);
  const minimumBooks = hasOfferUnit ? 1 : 2;

  // A lone book with nothing else is just a normal purchase.
  if (bookUnits.length < minimumBooks) {
    return buildResult(undiscountedLines(items));
  }

  // With books only, the dearest copy keeps its full price; that is the
  // "first" book. When a Special Offer is present nothing is held back.
  let reserved: (typeof bookUnits)[number] | null = null;

  if (!hasOfferUnit) {
    reserved = bookUnits[0];
    for (const unit of bookUnits) {
      if (unit.price > reserved.price) reserved = unit;
    }
  }

  const finalPrices: number[][] = items.map(() => []);

  for (const unit of units) {
    const discounted = unit !== reserved && unit.eligible;
    finalPrices[unit.itemIndex].push(discounted ? config.price : unit.price);
  }

  const lines: UpsellLine[] = items.map((item, itemIndex) => {
    const prices = finalPrices[itemIndex];

    // Collapse identical unit prices back into groups, dearest first.
    const counts = new Map<number, number>();
    for (const price of prices) {
      counts.set(price, (counts.get(price) ?? 0) + 1);
    }

    const groups = Array.from(counts.entries())
      .map(([price, quantity]) => ({ price, quantity }))
      .sort((a, b) => b.price - a.price);

    return {
      key: item.key,
      groups,
      lineTotal: prices.reduce((sum, p) => sum + p, 0),
      originalTotal: item.unitPrice * prices.length,
    };
  });

  return buildResult(lines);
}
