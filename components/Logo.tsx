import Image from "next/image";

// Reads /public/logo.png.
//
// `fill` + object-contain means the logo is never stretched or squashed,
// whatever its real pixel dimensions happen to be. The className only sets
// the BOX the logo fits inside; the logo scales to fit and keeps its own
// shape. To make the logo bigger or smaller everywhere, change the sizes
// passed in Header.tsx and the admin layout.
export default function Logo({
  className = "h-12 w-40",
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <span className={`relative block ${className}`}>
      <Image
        src="/logo.png"
        alt="LawenBook"
        fill
        sizes="260px"
        priority={priority}
        className="object-contain object-left"
      />
    </span>
  );
}
