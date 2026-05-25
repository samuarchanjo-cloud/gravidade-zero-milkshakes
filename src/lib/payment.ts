import type { PaymentMethod } from "./types";

export const PIX_KEY = "18372949760";
export const PIX_KEY_TYPE = "CPF";
export const PIX_RECEIVER = "Samuel Archanjo";

export const PAYMENT_FEES: Record<PaymentMethod, number> = {
  pix: 0,
  dinheiro: 0,
  debito: 0.0137,
  credito: 0.0315,
};

export function paymentLabel(method: PaymentMethod | ""): string {
  switch (method) {
    case "pix":
      return "Pix";
    case "dinheiro":
      return "Dinheiro";
    case "debito":
      return "Débito";
    case "credito":
      return "Crédito";
    default:
      return "-";
  }
}

export function paymentFeeLabel(method: PaymentMethod | ""): string {
  if (method === "debito" || method === "credito") return "Taxa cartão";
  return "Taxa de pagamento";
}

export function calculatePaymentFee(
  amount: number,
  method: PaymentMethod | ""
): number {
  if (!method) return 0;
  return roundMoney(amount * PAYMENT_FEES[method]);
}

export function pixPayload(): string {
  const merchantAccountInfo = emv("00", "br.gov.bcb.pix") + emv("01", PIX_KEY);
  const payloadWithoutCrc = [
    emv("00", "01"),
    emv("26", merchantAccountInfo),
    emv("52", "0000"),
    emv("53", "986"),
    emv("58", "BR"),
    emv("59", normalizePixText(PIX_RECEIVER, 25)),
    emv("60", "RIO DE JANEIRO"),
    emv("62", emv("05", "***")),
    "6304",
  ].join("");

  return `${payloadWithoutCrc}${crc16(payloadWithoutCrc)}`;
}

export function pixQrCodeUrl(size = 220): string {
  const payload = pixPayload();
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(payload)}`;
}

function emv(id: string, value: string): string {
  return `${id}${String(value.length).padStart(2, "0")}${value}`;
}

function normalizePixText(value: string, maxLength: number): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9 ]/g, "")
    .toUpperCase()
    .slice(0, maxLength);
}

function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function crc16(payload: string): string {
  let crc = 0xffff;

  for (let i = 0; i < payload.length; i += 1) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xffff;
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, "0");
}
