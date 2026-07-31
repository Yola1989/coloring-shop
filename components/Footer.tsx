type FooterProps = {
  phoneNumber: string;
};

// Simple site footer with a "Need Help?" WhatsApp contact section for
// customers who have questions before purchasing.
export default function Footer({ phoneNumber }: FooterProps) {
  const message = encodeURIComponent(
    "السلام! عندي سؤال بخصوص كتب التلوين ديالكم."
  );
  const href = phoneNumber
    ? `https://wa.me/${phoneNumber.replace(/[^\d]/g, "")}?text=${message}`
    : null;

  return (
    <footer className="mt-20 border-t border-gray-200 bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 text-center sm:px-6">
        
        <p className="text-lg font-bold text-gray-900">🎨 شكراً لزيارتك LawenBook!</p> 

        <p className="mt-2 text-sm text-gray-600">
          نتمنى أن تجلب كتبنا الإبداع والفرح للصغار والكبار على حد سواء.
        </p>



        <h2 className="mt-8 text-lg font-bold text-gray-900">هل تحتاج مساعدة؟</h2>
        <p className="mt-2 text-sm text-gray-500">
          
          عندك سؤال قبل الطلب؟ يسعدنا مساعدتك.
        </p>

        {href && (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-green-500 px-5 py-3 font-semibold text-white transition hover:bg-green-600"
          >

          
            💬 تواصل معنا عبر واتساب
          </a>
        )}

        <p className="mt-8 text-xs text-gray-400">
          © {new Date().getFullYear()} LawenBook — Made with ❤️ by Younes Ahdidou
        </p>
      </div>
    </footer>
  );
}
