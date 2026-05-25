export type Theme = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  muted: string;
};

export type Branding = {
  name: string;
  tagline: string;
  logoUrl: string;
  heroImageUrl: string;
  /** Banner topo — título exibido sobre a capa */
  bannerTitle: string;
  /** Banner topo — URL da imagem (substitua pela capa real) */
  bannerImageUrl: string;
};

export type Business = {
  whatsappNumber: string;
  address: string;
  openingHours: string;
  deliveryFee: number;
  minOrderDelivery: number;
  currency: string;
};

export type Texts = {
  heroTitle: string;
  heroSubtitle: string;
  deliveryLabel: string;
  pickupLabel: string;
  checkoutTitle: string;
  checkoutHint: string;
  emptyCart: string;
  addToCart: string;
  viewCart: string;
  confirmOrder: string;
  customizeTitle: string;
  sizeLabel: string;
  fromPrice: string;
};

export type SizeOption = {
  id: string;
  label: string;
  price: number;
};

export type ModifierOption = {
  id: string;
  name: string;
  price: number;
};

export type ModifierGroup = {
  id: string;
  name: string;
  required: boolean;
  min: number;
  max: number;
  options: ModifierOption[];
};

export type Flavor = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  available: boolean;
  /** Preços por tamanho (id 330, 550). Vazio = usa preço padrão da aba Tamanhos */
  customPrices?: Partial<Record<string, number>>;
};

/** @deprecated legado — migrado para flavors */
export type Product = Flavor & { price?: number };

export type StoreConfig = {
  branding: Branding;
  theme: Theme;
  business: Business;
  texts: Texts;
  sizes: SizeOption[];
  modifierGroups: ModifierGroup[];
  flavors: Flavor[];
  products?: Product[];
};

export type SelectedModifier = {
  groupId: string;
  groupName: string;
  optionId: string;
  name: string;
  price: number;
};

export type CartItem = {
  lineId: string;
  flavorId: string;
  flavorName: string;
  sizeId: string;
  sizeLabel: string;
  modifiers: SelectedModifier[];
  unitPrice: number;
  quantity: number;
  displayName: string;
  /** Observação do cliente para este item */
  observation?: string;
};

export type FulfillmentType = "delivery" | "pickup";

export type PaymentMethod = "pix" | "dinheiro" | "cartao";

export type CheckoutData = {
  customerName: string;
  customerPhone: string;
  fulfillment: FulfillmentType;
  address: string;
  reference: string;
  paymentMethod: PaymentMethod | "";
  needsChange: boolean;
  changeFor: string;
  notes: string;
};

export type OrderStatus =
  | "Pedido recebido"
  | "Pedido aceito"
  | "Em preparo"
  | "Saiu para entrega"
  | "Finalizado";

export type OrderPaymentMethod =
  | "Pix"
  | "Dinheiro"
  | "Cartão"
  | "Débito"
  | "Crédito";

export type OrderItem = {
  flavorName: string;
  sizeLabel: string;
  quantity: number;
  unitPrice: number;
  total: number;
  modifiers: SelectedModifier[];
  observation?: string;
};

export type CustomerOrder = {
  id: string;
  customerName: string;
  customerPhone: string;
  fulfillment: FulfillmentType;
  address: string;
  reference: string;
  paymentMethod: OrderPaymentMethod;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  createdAt: string;
  status: OrderStatus;
  notes?: string;
};
