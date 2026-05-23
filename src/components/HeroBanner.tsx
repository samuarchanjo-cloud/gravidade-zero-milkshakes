"use client";

import { StoreImage } from "@/components/StoreImage";
import { CosmicImageFallback } from "@/components/CosmicImageFallback";

type Props = {
  title: string;
  imageUrl: string;
  subtitle?: string;
};

export function HeroBanner({ title, imageUrl, subtitle }: Props) {
  return (
    <section className="relative mt-4 w-full overflow-hidden sm:mx-4 sm:rounded-3xl">
      <div className="relative aspect-[16/9] min-h-[180px] w-full max-h-[420px] sm:aspect-[16/7] sm:min-h-[240px] md:min-h-[320px]">
        {imageUrl ? (
          <StoreImage
            src={imageUrl}
            alt={title}
            priority
            fallback={<CosmicImageFallback label={title} />}
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        ) : (
          <CosmicImageFallback label={title} />
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(5,5,16,0.25) 0%, rgba(5,5,16,0.55) 45%, rgba(5,5,16,0.92) 100%), linear-gradient(90deg, rgba(88,28,135,0.35) 0%, transparent 50%, rgba(34,211,238,0.2) 100%)",
          }}
        />
        <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-7">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--gz-secondary)]">
            Capa
          </p>
          <h2 className="gz-neon-text text-2xl font-black uppercase tracking-tight text-white sm:text-3xl md:text-4xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 max-w-md text-sm text-white/75">{subtitle}</p>
          )}
        </div>
        <div
          className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10"
          aria-hidden
        />
      </div>
    </section>
  );
}
