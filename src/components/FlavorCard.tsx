"use client";

import type { Flavor, Texts, SizeOption } from "@/lib/types";
import { formatMoney, minFlavorPrice } from "@/lib/pricing";
import { getFlavorVisual } from "@/lib/flavorTheme";
import { StoreImage } from "@/components/StoreImage";
import { CosmicImageFallback } from "@/components/CosmicImageFallback";
import { PRODUCT_IMAGE_CLASS } from "@/lib/imageClasses";

type Props = {
  flavor: Flavor;
  sizes: SizeOption[];
  texts: Texts;
  onOpen: (flavor: Flavor) => void;
};

export function FlavorCard({ flavor, sizes, texts, onOpen }: Props) {
  const from = minFlavorPrice(flavor, sizes);
  const visual = getFlavorVisual(flavor.id);

  return (
    <button
      type="button"
      disabled={!flavor.available}
      onClick={() => onOpen(flavor)}
      className="group relative w-full overflow-hidden rounded-[1.75rem] text-left transition duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(168,85,247,0.35)] active:scale-[0.98] disabled:opacity-45"
      style={
        {
          "--flavor-glow": visual.glow,
          "--flavor-border": visual.border,
          background: `linear-gradient(160deg, ${visual.gradientFrom} 0%, #0a0614 55%, ${visual.gradientTo} 100%)`,
          boxShadow: `0 12px 40px rgba(0,0,0,0.55), 0 0 0 1px ${visual.border}, 0 0 32px ${visual.glow}`,
        } as React.CSSProperties
      }
    >
      <div
        className="pointer-events-none absolute -inset-px rounded-[1.75rem] opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(ellipse 90% 70% at 50% 0%, ${visual.glow}, transparent 72%)`,
        }}
      />

      {/* Imagem ampla — cover padronizado */}
      <div className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/11]">
        <div
          className="absolute inset-0 z-0"
          style={{
            background: `radial-gradient(ellipse 90% 70% at 50% 85%, ${visual.imageGlow}, transparent 70%)`,
          }}
        />
        <StoreImage
          src={flavor.imageUrl}
          alt={flavor.name}
          className={`relative z-10 ${PRODUCT_IMAGE_CLASS}`}
          fallback={<CosmicImageFallback label={flavor.name} />}
        />
        <div
          className="absolute inset-0 z-20 bg-gradient-to-t from-[#080612] via-[#080612]/40 to-transparent"
          aria-hidden
        />
        <span
          className="absolute left-3 top-3 z-30 max-w-[85%] truncate rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md"
          style={{
            background: "rgba(8, 6, 18, 0.72)",
            color: "var(--gz-accent)",
            borderColor: visual.border,
            boxShadow: `0 0 12px ${visual.glow}`,
          }}
        >
          {flavor.category}
        </span>
      </div>

      <div className="relative z-10 px-5 pb-5 pt-4">
        <h3
          className="text-2xl font-black leading-tight tracking-tight text-white sm:text-[1.65rem]"
          style={{ textShadow: `0 0 28px ${visual.glow}` }}
        >
          {flavor.name}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/70">
          {flavor.description}
        </p>
        <div className="mt-5 flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
              {texts.fromPrice}
            </p>
            <p
              className="text-[1.75rem] font-black tabular-nums leading-none"
              style={{
                color: "var(--gz-secondary)",
                textShadow: "0 0 24px rgba(34, 211, 238, 0.5)",
              }}
            >
              {formatMoney(from)}
            </p>
          </div>
          <span
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl font-black text-white transition duration-300 group-hover:scale-110 group-active:scale-95"
            style={{
              background:
                "linear-gradient(135deg, var(--gz-primary), color-mix(in srgb, var(--gz-accent) 35%, var(--gz-primary)))",
              boxShadow: `0 0 24px ${visual.glow}, 0 0 12px rgba(74, 222, 128, 0.35)`,
            }}
            aria-hidden
          >
            +
          </span>
        </div>
      </div>
    </button>
  );
}
