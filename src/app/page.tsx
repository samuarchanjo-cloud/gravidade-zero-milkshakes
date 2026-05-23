"use client";

import { useEffect, useMemo, useState } from "react";
import { FlavorCard } from "@/components/FlavorCard";
import { HeroBanner } from "@/components/HeroBanner";
import { StoreImage } from "@/components/StoreImage";
import { CustomizeSheet } from "@/components/CustomizeSheet";
import { CartBar } from "@/components/CartBar";
import { useStore } from "@/components/StoreProvider";
import { addCartLine, loadCart, saveCart } from "@/lib/cart";
import type { CartItem, Flavor } from "@/lib/types";
import { MENU_CATEGORIES } from "@data/categories";
import { getHeroImageUrl } from "@/lib/images";
import { InstagramButton } from "@/components/InstagramButton";
import { SiteFooter } from "@/components/SiteFooter";

const CATEGORY_ORDER: string[] = [...MENU_CATEGORIES];

export default function HomePage() {
  const { config, loading } = useStore();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [customizing, setCustomizing] = useState<Flavor | null>(null);

  useEffect(() => {
    setCart(loadCart());
  }, []);

  const categories = useMemo(() => {
    if (!config) return [];
    const fromData = new Set(config.flavors.map((f) => f.category));
    const ordered = CATEGORY_ORDER.filter((c) => fromData.has(c));
    const rest = Array.from(fromData).filter((c) => !CATEGORY_ORDER.includes(c));
    return [...ordered, ...rest];
  }, [config]);

  useEffect(() => {
    if (categories.length && !activeCategory) {
      setActiveCategory(categories[0]);
    }
  }, [categories, activeCategory]);

  function handleAdd(line: Omit<CartItem, "lineId">) {
    const lineId = `${line.flavorId}-${line.sizeId}-${line.modifiers
      .map((m) => m.optionId)
      .sort()
      .join(",")}-${line.observation ?? ""}`;
    const next = addCartLine(cart, { ...line, lineId });
    setCart(next);
    saveCart(next);
  }

  if (loading || !config) {
    return (
      <main className="gz-cosmic-page flex min-h-dvh items-center justify-center p-6">
        <p className="animate-pulse text-[var(--gz-muted)]">Carregando galáxia…</p>
      </main>
    );
  }

  if (!config.flavors?.length || !config.sizes?.length) {
    return (
      <main className="gz-cosmic-page flex min-h-dvh items-center justify-center p-6 text-center">
        <p className="text-[var(--gz-muted)]">
          Cardápio incompleto. Confira sabores e tamanhos no painel admin.
        </p>
      </main>
    );
  }

  const { branding, texts, business } = config;
  const filtered = config.flavors.filter(
    (f) => f.available && f.category === activeCategory
  );

  return (
    <main className="gz-cosmic-page pb-safe-cart mx-auto min-h-dvh max-w-xl md:max-w-2xl lg:max-w-3xl">
      <header className="px-4 pt-6 text-center">
        <div className="inline-flex items-center gap-2">
          {branding.logoUrl ? (
            <StoreImage
              src={branding.logoUrl}
              alt=""
              priority
              className="h-11 w-11 rounded-full object-cover object-center ring-2 ring-[var(--gz-primary)] shadow-[0_0_16px_rgba(168,85,247,0.45)]"
            />
          ) : (
            <span className="text-3xl" aria-hidden>
              👽
            </span>
          )}
          <h1 className="gz-neon-text text-xl font-black tracking-tight sm:text-2xl">
            {branding.name}
          </h1>
        </div>
        <p className="mt-1 text-xs text-[var(--gz-muted)]">{branding.tagline}</p>
        <p className="mt-2 text-[10px] uppercase tracking-wider text-white/40">
          {business.openingHours} · {business.address}
        </p>
        <div className="mt-4 flex justify-center">
          <InstagramButton />
        </div>
      </header>

      <HeroBanner
        title={branding.bannerTitle || "Escolha Seu Destino"}
        imageUrl={getHeroImageUrl(
          branding.heroImageUrl,
          branding.bannerImageUrl
        )}
        subtitle={texts.heroSubtitle}
      />

      <div className="px-4 pt-6">
        <h2 className="text-lg font-bold text-white/90">{texts.heroTitle}</h2>
      </div>

      <div className="sticky top-0 z-20 mt-4 px-4 py-2 backdrop-blur-xl">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide rounded-2xl p-1.5"
          style={{
            background: "rgba(12, 8, 24, 0.75)",
            boxShadow: "0 0 24px rgba(168, 85, 247, 0.15), inset 0 0 0 1px rgba(255,255,255,0.06)",
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className="shrink-0 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wide transition min-h-[44px]"
              style={{
                background:
                  activeCategory === cat
                    ? "linear-gradient(135deg, var(--gz-primary), color-mix(in srgb, var(--gz-secondary) 35%, var(--gz-primary)))"
                    : "transparent",
                color: activeCategory === cat ? "#fff" : "var(--gz-muted)",
                boxShadow:
                  activeCategory === cat
                    ? "0 0 20px rgba(168, 85, 247, 0.45)"
                    : "none",
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <section className="space-y-5 px-4 py-5">
        {filtered.length === 0 ? (
          <p className="py-12 text-center text-sm text-[var(--gz-muted)]">
            Nenhum sabor nesta galáxia ainda.
          </p>
        ) : (
          filtered.map((flavor) => (
            <FlavorCard
              key={flavor.id}
              flavor={flavor}
              sizes={config.sizes}
              texts={texts}
              onOpen={setCustomizing}
            />
          ))
        )}
      </section>

      <SiteFooter
        address={business.address}
        openingHours={business.openingHours}
        whatsappNumber={business.whatsappNumber}
      />

      <CustomizeSheet
        flavor={customizing}
        sizes={config.sizes}
        modifierGroups={config.modifierGroups}
        texts={texts}
        onClose={() => setCustomizing(null)}
        onAdd={handleAdd}
      />

      <CartBar items={cart} texts={texts} />
    </main>
  );
}
