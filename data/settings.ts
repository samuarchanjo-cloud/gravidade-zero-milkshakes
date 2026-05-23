import type {
  Branding,
  Business,
  SizeOption,
  Texts,
  Theme,
} from "@/lib/types";
import { storeImages } from "./images";

export const branding: Branding = {
  name: "Gravidade Zero Milkshakes",
  tagline: "Milkshakes intergalácticos — Guaratiba",
  logoUrl: storeImages.logo,
  /** Imagem principal do topo — prioridade sobre bannerImageUrl */
  heroImageUrl: storeImages.banner,
  bannerTitle: "Escolha Seu Destino",
  bannerImageUrl: storeImages.banner,
};

/** Cores neon — tema escuro espacial */
export const theme: Theme = {
  primary: "#7C3AED",
  secondary: "#22D3EE",
  accent: "#4ADE80",
  background: "#050510",
  surface: "#0c0818",
  text: "#F8FAFC",
  muted: "#94A3B8",
};

export const business: Business = {
  whatsappNumber: "5521980467622",
  address: "Estrada Cabuçu de Baixo, 388 - Guaratiba",
  openingHours: "Seg–Sáb 15h–00h",
  /** Taxa de entrega — edite aqui */
  deliveryFee: 0,
  minOrderDelivery: 0,
  currency: "BRL",
};

export const texts: Texts = {
  heroTitle: "Sabores da galáxia",
  heroSubtitle: "Toque no sabor para montar sua missão",
  deliveryLabel: "Delivery",
  pickupLabel: "Retirada no local",
  checkoutTitle: "Finalizar pedido",
  checkoutHint:
    "Ao confirmar, o WhatsApp abrirá com seu pedido pronto para enviar.",
  emptyCart: "Seu carrinho está vazio",
  addToCart: "Adicionar à missão",
  viewCart: "Ver carrinho",
  confirmOrder: "Enviar pedido no WhatsApp",
  customizeTitle: "Monte seu milkshake",
  sizeLabel: "Tamanho",
  fromPrice: "A partir de",
};

/**
 * Tamanhos e preços base — 330ml começa em R$ 14,90.
 * Use customPrices em data/products.ts para preço por sabor.
 */
export const sizes: SizeOption[] = [
  { id: "330", label: "330ml", price: 14.9 },
  { id: "550", label: "550ml", price: 19.9 },
];
