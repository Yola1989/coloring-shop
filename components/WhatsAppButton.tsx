type WhatsAppButtonProps = {
  phoneNumber: string;
};

// Floating WhatsApp button, visible on every customer-facing page.
// Hidden entirely if no number is configured in Admin → Settings.
export default function WhatsAppButton({ phoneNumber }: WhatsAppButtonProps) {
  if (!phoneNumber) return null;

  const message = encodeURIComponent(
    "السلام! عندي سؤال بخصوص كتب التلوين ديالكم."
  );
  const href = `https://wa.me/${phoneNumber.replace(/[^\d]/g, "")}?text=${message}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="تواصل معنا عبر واتساب"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-2xl text-white shadow-lg transition hover:bg-green-600"
    >
      💬
    </a>
  );
}
