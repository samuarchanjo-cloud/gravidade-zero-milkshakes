type Props = {
  label?: string;
  compact?: boolean;
};

export function CosmicImageFallback({ label, compact }: Props) {
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-violet-950/80 via-[#080612] to-cyan-950/50"
      aria-hidden
    >
      <span className={compact ? "text-4xl" : "text-5xl sm:text-6xl"}>🛸</span>
      <span
        className="mt-2 max-w-[80%] text-center text-[10px] font-semibold uppercase tracking-widest text-white/35"
        style={{ textShadow: "0 0 12px rgba(168, 85, 247, 0.4)" }}
      >
        {label ?? "Imagem em órbita"}
      </span>
    </div>
  );
}
