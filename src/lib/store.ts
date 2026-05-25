import { promises as fs } from "fs";
import path from "path";
import { buildStoreConfig } from "@data/catalog";
import { resolveImageUrl } from "./images";
import type { Flavor, Product, StoreConfig } from "./types";

const STORE_PATH = path.join(process.cwd(), "data", "store.json");
const STORE_KEY = process.env.STORE_CONFIG_KEY ?? "gravidade-zero:store-config";

type RedisRestResponse = {
  result?: unknown;
  error?: string;
};

function getRedisRestEnv():
  | { url: string; token: string; key: string }
  | null {
  const url =
    process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token =
    process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) return null;

  return {
    url: url.replace(/\/$/, ""),
    token,
    key: STORE_KEY,
  };
}

function serializeStore(config: StoreConfig): string {
  const { products: _legacy, ...toSave } = config;
  return JSON.stringify(toSave);
}

async function redisCommand<T>(
  command: unknown[]
): Promise<T | null> {
  const env = getRedisRestEnv();
  if (!env) return null;

  const res = await fetch(env.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });

  const payload = (await res.json().catch(() => ({}))) as RedisRestResponse;

  if (!res.ok || payload.error) {
    throw new Error(
      `Redis REST ${String(command[0])} failed (${res.status}): ${
        payload.error ?? res.statusText
      }`
    );
  }

  return (payload.result ?? null) as T | null;
}

async function readRemoteStore(): Promise<StoreConfig | null> {
  const env = getRedisRestEnv();
  if (!env) return null;

  const result = await redisCommand<string>(["GET", env.key]);
  if (!result) return null;

  return JSON.parse(result) as StoreConfig;
}

async function writeRemoteStore(config: StoreConfig): Promise<boolean> {
  const env = getRedisRestEnv();
  if (!env) return false;

  await redisCommand<string>(["SET", env.key, serializeStore(config)]);
  return true;
}

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
    const remote = await readRemoteStore();
    if (remote) return migrateLegacyProducts(remote);
  } catch (error) {
    console.error("[store] Erro ao ler config remota; usando fallback local:", error);
  }

  try {
    const raw = await fs.readFile(STORE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as StoreConfig;
    return migrateLegacyProducts(parsed);
  } catch {
    return getDefaultStore();
  }
}

export async function writeStore(config: StoreConfig): Promise<void> {
  if (await writeRemoteStore(config)) {
    return;
  }

  if (process.env.VERCEL || process.env.NODE_ENV === "production") {
    throw new Error(
      "Persistencia remota nao configurada. Defina KV_REST_API_URL/KV_REST_API_TOKEN ou UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN na Vercel."
    );
  }

  const toSave = JSON.parse(serializeStore(config));
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
  await fs.writeFile(STORE_PATH, JSON.stringify(toSave, null, 2), "utf-8");
}
