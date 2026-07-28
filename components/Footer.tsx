type FooterProps = {
  phoneNumber: string;
};

// Simple site footer with a "Need Help?" WhatsApp contact section for
// customers who have questions before purchasing.
export default function Footer({ phoneNumber }: FooterProps) {
  const message = encodeURIComponent(
    "Hello! I have a question about one of your coloring books."
  );
  const href = phoneNumber
    ? `https://wa.me/${phoneNumber.replace(/[^\d]/g, "")}?text=${message}`
    : null;

  return (
    <footer className="mt-20 border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-10 text-center">
        
       <h1>🎨 Thank you for visiting LawenBook!</h1> 

        We hope our LawenBooks bring creativity and joy to every child.

         <h1>Made with ❤️ by Younes Ahdidou</h1>

        <h3 className="text-lg font-bold text-gray-900">Need Help?</h3>
        <p className="mt-2 text-sm text-gray-500">
          
          Have a question before you order? We&apos;re happy to help.
        </p>

        {href && (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-green-500 px-5 py-3 font-semibold text-white transition hover:bg-green-600"
          >

          
            💬 Chat with us on WhatsApp
          </a>
        )}

        <p className="mt-8 text-xs text-gray-400">
          © {new Date().getFullYear()} LawenBook
        </p>
      </div>
    </footer>
  );
}
