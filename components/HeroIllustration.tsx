export default function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 400 340"
      className="w-full max-w-md"
      role="img"
      aria-label="Colorful crayons and a coloring page"
    >
      {/* Soft background blob */}
      <circle cx="200" cy="170" r="160" fill="#FFF3E0" />
      <circle cx="90" cy="80" r="36" fill="#FFE0B2" opacity="0.7" />
      <circle cx="330" cy="260" r="44" fill="#FFCCBC" opacity="0.6" />

      {/* Open coloring book page */}
      <rect x="110" y="90" width="180" height="150" rx="14" fill="#FFFFFF" stroke="#F3D9B1" strokeWidth="3" />
      {/* a simple flower outline "to color" on the page */}
      <circle cx="200" cy="140" r="16" fill="none" stroke="#FFB74D" strokeWidth="3" />
      <circle cx="180" cy="160" r="16" fill="none" stroke="#FF8A65" strokeWidth="3" />
      <circle cx="220" cy="160" r="16" fill="none" stroke="#4FC3F7" strokeWidth="3" />
      <circle cx="200" cy="178" r="16" fill="none" stroke="#81C784" strokeWidth="3" />
      <circle cx="200" cy="160" r="12" fill="#FFF176" stroke="#FBC02D" strokeWidth="2" />
      <path d="M140 220 q60 20 120 0" stroke="#E0E0E0" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M140 205 q60 16 120 0" stroke="#E0E0E0" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* Crayons fanned out at the bottom */}
      <g transform="translate(75,235) rotate(-18)">
        <rect width="16" height="80" rx="6" fill="#EF5350" />
        <polygon points="0,0 16,0 8,-16" fill="#EF9A9A" />
      </g>
      <g transform="translate(105,248) rotate(-8)">
        <rect width="16" height="80" rx="6" fill="#FFB300" />
        <polygon points="0,0 16,0 8,-16" fill="#FFE082" />
      </g>
      <g transform="translate(140,255) rotate(2)">
        <rect width="16" height="80" rx="6" fill="#66BB6A" />
        <polygon points="0,0 16,0 8,-16" fill="#A5D6A7" />
      </g>
      <g transform="translate(250,255) rotate(-2)">
        <rect width="16" height="80" rx="6" fill="#42A5F5" />
        <polygon points="0,0 16,0 8,-16" fill="#90CAF9" />
      </g>
      <g transform="translate(285,248) rotate(10)">
        <rect width="16" height="80" rx="6" fill="#AB47BC" />
        <polygon points="0,0 16,0 8,-16" fill="#CE93D8" />
      </g>

      {/* Little smiling sun for a friendly touch */}
      <circle cx="330" cy="70" r="24" fill="#FFD54F" />
      <circle cx="322" cy="66" r="3" fill="#8D6E63" />
      <circle cx="338" cy="66" r="3" fill="#8D6E63" />
      <path d="M320 76 q10 10 20 0" stroke="#8D6E63" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* Stars sprinkled around */}
      <path d="M55 190 l4 9 9 1 -7 6 2 9 -8 -5 -8 5 2 -9 -7 -6 9 -1 z" fill="#FF7043" />
      <path d="M345 190 l3 7 7 1 -5 5 1 7 -6 -4 -6 4 1 -7 -5 -5 7 -1 z" fill="#4FC3F7" />
    </svg>
  );
}
