import nodemailer from "nodemailer";

// Standard SMTP — works with Gmail, Resend, SendGrid, Mailtrap, or any
// SMTP provider, so it isn't tied to Vercel or any one service.
// Required env vars: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS,
// ORDER_NOTIFY_EMAIL (where new-order emails are sent).

function getTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export type OrderEmailItem = {
  title: string;
  price: number;
  quantity: number;
  selection?: string | null;
};

export type OrderEmailData = {
  orderNumber: string;
  fullName: string;
  phone: string;
  city: string;
  address: string;
  notes?: string | null;
  items: OrderEmailItem[];
  totalAmount: number;
};

export async function sendNewOrderEmail(order: OrderEmailData) {
  const to = process.env.ORDER_NOTIFY_EMAIL;

  if (!to || !process.env.SMTP_HOST) {
    // Storefront still works without email configured; we just skip
    // sending and log it so orders are never blocked by missing SMTP.
    console.warn(
      "SMTP/ORDER_NOTIFY_EMAIL not configured — skipping order email."
    );
    return;
  }

  const itemsList = order.items
    .map(
      (i) =>
        `- ${i.title} x${i.quantity} — ${i.price * i.quantity} DH` +
        (i.selection ? `\n    Chosen books: ${i.selection}` : "")
    )
    .join("\n");

  const text = `New order received: ${order.orderNumber}

Customer: ${order.fullName}
Phone: ${order.phone}
City: ${order.city}
Address: ${order.address}
Notes: ${order.notes || "-"}

Items:
${itemsList}

Total: ${order.totalAmount} DH
`;

  const itemsHtml = order.items
    .map(
      (i) =>
        `<tr><td style="padding:4px 8px">${i.title}${i.selection ? `<br/><small style="color:#666">${i.selection}</small>` : ""}</td><td style="padding:4px 8px">x${i.quantity}</td><td style="padding:4px 8px">${i.price * i.quantity} DH</td></tr>`
    )
    .join("");

  const html = `
    <h2>New order: ${order.orderNumber}</h2>
    <p>
      <strong>Customer:</strong> ${order.fullName}<br/>
      <strong>Phone:</strong> ${order.phone}<br/>
      <strong>City:</strong> ${order.city}<br/>
      <strong>Address:</strong> ${order.address}<br/>
      <strong>Notes:</strong> ${order.notes || "-"}
    </p>
    <table style="border-collapse:collapse">${itemsHtml}</table>
    <p><strong>Total: ${order.totalAmount} DH</strong></p>
  `;

  const transport = getTransport();

  await transport.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject: `New order ${order.orderNumber} — ${order.totalAmount} DH (COD)`,
    text,
    html,
  });
}
