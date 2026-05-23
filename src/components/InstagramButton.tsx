const INSTAGRAM_URL = "https://www.instagram.com/gravidadezero__/";

type Props = {
  className?: string;
  fullWidth?: boolean;
};

export function InstagramButton({ className = "", fullWidth }: Props) {
  return (
    <a
      href={INSTAGRAM_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl border border-white/15 bg-gradient-to-r from-purple-900/50 to-[#080612] px-5 py-3 text-sm font-bold text-white transition active:scale-[0.98] hover:border-[var(--gz-secondary)]/50 hover:shadow-[0_0_24px_rgba(168,85,247,0.35)] ${
        fullWidth ? "w-full" : ""
      } ${className}`}
    >
      <InstagramIcon />
      Seguir no Instagram
    </a>
  );
}

function InstagramIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="shrink-0 text-[var(--gz-secondary)]"
    >
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="6"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1.25" fill="currentColor" />
    </svg>
  );
}

export { INSTAGRAM_URL };
