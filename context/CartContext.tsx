"use client";

import { createContext, useContext, useState } from "react";

export type CartItemType = "book" | "offer";

// The books a customer chose for a "pick any N books" offer.
export type CartSelectionBook = {
  id: number;
  title: string;
};

export type CartItem = {
  id: number;
  type: CartItemType;
  title: string;
  price: number;
  cover: string;
  quantity: number;
  selection?: CartSelectionBook[];
};

/*
  Two cart lines can now hold the same offer with different books inside, so
  an id and a type no longer identify a line on their own. Every lookup goes
  through this key, which folds the chosen books into the identity.
*/
export function cartLineKey(item: {
  id: number;
  type: CartItemType;
  selection?: CartSelectionBook[];
}) {
  const picked = (item.selection ?? [])
    .map((b) => b.id)
    .slice()
    .sort((a, b) => a - b)
    .join(".");

  return item.type + "-" + item.id + "-" + picked;
}

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cart, setCart] = useState<CartItem[]>([]);

  function addToCart(item: Omit<CartItem, "quantity">) {
    const key = cartLineKey(item);

    setCart((prev) => {
      const existing = prev.find((i) => cartLineKey(i) === key);

      if (existing) {
        return prev.map((i) =>
          cartLineKey(i) === key ? { ...i, quantity: i.quantity + 1 } : i
        );
      }

      return [...prev, { ...item, quantity: 1 }];
    });
  }

  function removeFromCart(key: string) {
    setCart((prev) => prev.filter((i) => cartLineKey(i) !== key));
  }

  function updateQuantity(key: string, quantity: number) {
    if (quantity < 1) {
      removeFromCart(key);
      return;
    }

    setCart((prev) =>
      prev.map((i) => (cartLineKey(i) === key ? { ...i, quantity } : i))
    );
  }

  function clearCart() {
    setCart([]);
  }

  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
