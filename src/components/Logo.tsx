import Link from "next/link";

// Compact beeldmerk: oplopende staven met pijl, in het logo-navy uit 2023.
export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <rect width="40" height="40" rx="10" fill="#0033A0" />
      <rect x="8" y="22" width="5" height="10" rx="1.5" fill="#7fb7ee" />
      <rect x="16" y="17" width="5" height="15" rx="1.5" fill="#b9d9f7" />
      <rect x="24" y="12" width="5" height="20" rx="1.5" fill="#ffffff" />
      <path
        d="M9 15 L20 9 L31 5"
        stroke="#ecb93f"
        strokeWidth="2.6"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M31 5 l-4.5 0.6 M31 5 l-0.8 4.4" stroke="#ecb93f" strokeWidth="2.6" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export default function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5 shrink-0">
      <LogoMark />
      <span
        className={`text-lg font-bold tracking-tight ${
          dark ? "text-white" : "text-ink"
        }`}
      >
        Beleggings
        <span className={dark ? "text-brand-300" : "text-brand-600"}>
          college
        </span>
      </span>
    </Link>
  );
}
