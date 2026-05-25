import { promises as fs } from "fs";
import path from "path";
import { buildStoreConfig } from "@data/catalog";
import { resolveImageUrl } from "./images";
import type { Flavor, Product, StoreConfig } from "./types";

const STORE_PATH = path.join(process.cwd(), "data", "store.json");

function slugFromName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const DEFAULT_SIZES = [
  { id: "330", label: "330ml", price: 14.9 },
  { id: "550", label: "550ml", price: 19.9 },
];

function normalizeFlavor(f: Flavor): Flavor {
  return {
    ...f,
    imageUrl: resolveImageUrl(f.imageUrl),
    customPrices: f.customPrices ?? {},
  };
}

function normalizeStore(raw: StoreConfig): StoreConfig {
  return {
    ...raw,
    branding: {
      ...raw.branding,
      bannerTitle: raw.branding?.bannerTitle ?? "Escolha Seu Destino",
      logoUrl: resolveImageUrl(raw.branding?.logoUrl ?? ""),
      heroImageUrl: resolveImageUrl(raw.branding?.heroImageUrl ?? ""),
      bannerImageUrl: resolveImageUrl(raw.branding?.bannerImageUrl ?? ""),
    },
    theme: {
      ...raw.theme,
      accent: raw.theme?.accent ?? "#4ADE80",
    },
    flavors: (raw.flavors ?? []).map(normalizeFlavor),
    sizes: raw.sizes?.length ? raw.sizes : DEFAULT_SIZES,
    modifierGroups: raw.modifierGroups ?? [],
  };
}

function migrateLegacyProducts(raw: StoreConfig): StoreConfig {
  if (raw.flavors?.length || !raw.products?.length) {
    return normalizeStore(raw);
  }

  const flavorMap = new Map<string, Flavor>();

  for (const p of raw.products) {
    const match = p.name.match(/^(.+?)\s+(\d+ml)$/i);
    const baseName = match ? match[1].trim() : p.name;
    const id = slugFromName(baseName);

    if (!flavorMap.has(id)) {
      flavorMap.set(id, {
        id,
        name: baseName,
        description: p.description,
        imageUrl: p.imageUrl,
        category: p.category,
        available: p.available,
      });
    }
  }

  return normalizeStore({
    ...raw,
    flavors: Array.from(flavorMap.values()),
    products: undefined,
  });
}

/** Config padrão montada dos arquivos em /data (products, extras, settings) */
export function getDefaultStore(): StoreConfig {
  return normalizeStore(buildStoreConfig());
}

export async function readStore(): Promise<StoreConfig> {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as StoreConfig;
    return migrateLegacyProducts(parsed);
  } catch {
    return getDefaultStore();
  }
}

export async function writeStore(config: StoreConfig): Promise<void> {
  const { products: _legacy, ...toSave } = config;
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
  await fs.writeFile(STORE_PATH, JSON.stringify(toSave, null, 2), "utf-8");
}
