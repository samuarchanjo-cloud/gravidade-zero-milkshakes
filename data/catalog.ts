import { modifierGroups } from "./extras";
import { products } from "./products";
import {
  branding,
  business,
  sizes,
  texts,
  theme,
} from "./settings";
import type { StoreConfig } from "@/lib/types";

/** Monta a configuração completa da loja a partir dos arquivos em /data */
export function buildStoreConfig(): StoreConfig {
  return {
    branding,
    theme,
    business,
    texts,
    sizes,
    modifierGroups,
    flavors: products,
  };
}
