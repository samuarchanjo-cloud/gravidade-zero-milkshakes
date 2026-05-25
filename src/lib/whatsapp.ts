import type { Business, CartItem, CheckoutData } from "./types";
import { cartLineTotal, formatMoney } from "./pricing";

const STORE_NAME = "Gravidade Zero Milkshakes";

function modifiersByGroup(item: CartItem) {
  const calda = item.modifiers.find((m) => m.groupId === "calda");
  const extras = item.modifiers.filter((m) => m.groupId === "extras");
  return { calda, extras };
}

export function buildOrderMessage(
  items: CartItem[],
  checkout: CheckoutData,
  business: Business,
  _subtotal: number,
  total: number,
  deliveryFee: number
): string {
  const lines: string[] = [
    `🚀 *${STORE_NAME}*`,
    "",
    `👤 *Cliente:* ${checkout.customerName.trim()}`,
    `📞 *Telefone:* ${checkout.customerPhone.trim()}`,
    "",
    "📦 *Itens:*",
  ];

  for (const item of items) {
    const { calda, extras } = modifiersByGroup(item);
    const extrasText =
      extras.length > 0 ? extras.map((e) => e.name).join(", ") : "Nenhum";
    lines.push(
      `• ${item.quantity}x ${item.flavorName} (${item.sizeLabel})`,
      `  Calda: ${calda?.name ?? "—"}`,
      `  Adicionais: ${extrasText}`
    );
    if (item.observation?.trim()) {
      lines.push(`  Obs.: ${item.observation.trim()}`);
    }
  }

  lines.push("");

  const tipo =
    checkout.fulfillment === "delivery" ? "Delivery" : "Retirada no local";
  lines.push(`🚚 *Entrega:* ${tipo}`);

  if (checkout.fulfillment === "delivery") {
    lines.push(`📍 *Endereço:* ${checkout.address.trim()}`);
    if (checkout.reference.trim()) {
      lines.push(`📌 *Referência:* ${checkout.reference.trim()}`);
    }
  } else {
    lines.push(`📍 *Retirada:* ${business.address}`);
  }

  lines.push(`💳 *Pagamento:* ${paymentLabel(checkout.paymentMethod)}`);

  if (checkout.paymentMethod === "dinheiro") {
    if (checkout.needsChange && checkout.changeFor.trim()) {
      lines.push(`💰 *Troco:* para ${checkout.changeFor.trim()}`);
    } else {
      lines.push(
        `💰 *Troco:* ${checkout.needsChange ? "Sim (valor não informado)" : "Não precisa"}`
      );
    }
  }

  if (deliveryFee > 0) {
    lines.push(`🛵 *Taxa entrega:* ${formatMoney(deliveryFee, business.currency)}`);
  }

  if (checkout.notes.trim()) {
    lines.push(`📝 *Obs. pedido:* ${checkout.notes.trim()}`);
  }

  lines.push("", `💵 *Total:* ${formatMoney(total, business.currency)}`);

  return lines.join("\n");
}

function paymentLabel(method: CheckoutData["paymentMethod"]): string {
  switch (method) {
    case "pix":
      return "Pix";
    case "dinheiro":
      return "Dinheiro";
    case "cartao":
      return "Cartão";
    default:
      return "—";
  }
}

export function whatsappOrderUrl(number: string, message: string): string {
  const digits = number.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
