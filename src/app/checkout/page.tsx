"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useStore } from "@/components/StoreProvider";
import {
  cartSubtotal,
  loadCart,
  saveCart,
  updateLineQuantity,
} from "@/lib/cart";
import { buildClientOrder, saveClientOrder } from "@/lib/clientOrders";
import { cartLineTotal, formatMoney } from "@/lib/pricing";
import type {
  CartItem,
  CheckoutData,
  CustomerOrder,
  FulfillmentType,
  PaymentMethod,
} from "@/lib/types";
import { buildOrderMessage, whatsappOrderUrl } from "@/lib/whatsapp";
import { SiteFooter } from "@/components/SiteFooter";

const emptyCheckout: CheckoutData = {
  customerName: "",
  customerPhone: "",
  fulfillment: "pickup",
  address: "",
  reference: "",
  paymentMethod: "",
  needsChange: false,
  changeFor: "",
  notes: "",
};

function itemModifiersSummary(item: CartItem) {
  const calda = item.modifiers.find((m) => m.groupId === "calda");
  const extras = item.modifiers.filter((m) => m.groupId === "extras");
  return { calda, extras };
}

function paymentLabel(method: PaymentMethod): CustomerOrder["paymentMethod"] {
  switch (method) {
    case "pix":
      return "Pix";
    case "dinheiro":
      return "Dinheiro";
    case "cartao":
      return "Cartão";
  }
}

export default function CheckoutPage() {
  const { config, loading } = useStore();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [checkout, setCheckout] = useState<CheckoutData>(emptyCheckout);
  const [error, setError] = useState("");

  useEffect(() => {
    setCart(loadCart());
  }, []);

  const subtotal = useMemo(() => cartSubtotal(cart), [cart]);

  const deliveryFee = useMemo(() => {
    if (!config || checkout.fulfillment !== "delivery") return 0;
    return config.business.deliveryFee;
  }, [config, checkout.fulfillment]);

  const total = subtotal + deliveryFee;

  function setField<K extends keyof CheckoutData>(
    key: K,
    value: CheckoutData[K]
  ) {
    setCheckout((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!config) return;
    if (cart.length === 0) {
      setError(config.texts.emptyCart);
      return;
    }
    if (!checkout.customerName.trim()) {
      setError("Informe seu nome.");
      return;
    }
    if (!checkout.customerPhone.trim()) {
      setError("Informe seu telefone.");
      return;
    }
    if (!checkout.paymentMethod) {
      setError("Escolha a forma de pagamento.");
      return;
    }
    if (checkout.fulfillment === "delivery" && !checkout.address.trim()) {
      setError("Informe o endereço completo para delivery.");
      return;
    }
    if (
      checkout.paymentMethod === "dinheiro" &&
      checkout.needsChange &&
      !checkout.changeFor.trim()
    ) {
      setError("Informe o valor para troco.");
      return;
    }

    const orderPayload: Omit<CustomerOrder, "id" | "createdAt" | "status"> = {
      customerName: checkout.customerName,
      customerPhone: checkout.customerPhone,
      fulfillment: checkout.fulfillment,
      address: checkout.fulfillment === "delivery" ? checkout.address : "",
      reference: checkout.reference,
      paymentMethod: paymentLabel(checkout.paymentMethod),
      items: cart.map((item) => ({
        flavorName: item.flavorName,
        sizeLabel: item.sizeLabel,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: cartLineTotal(item),
        modifiers: item.modifiers,
        observation: item.observation,
      })),
      subtotal,
      deliveryFee,
      total,
      notes: checkout.notes,
    };

    try {
      const saveResponse = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (saveResponse.ok) {
        const savedOrder = (await saveResponse.json()) as CustomerOrder;
        saveClientOrder(savedOrder);
      } else {
        saveClientOrder(buildClientOrder(orderPayload));
        setError("Pedido enviado no WhatsApp. O histórico local foi salvo como backup.");
      }
    } catch {
      saveClientOrder(buildClientOrder(orderPayload));
      setError("Pedido enviado no WhatsApp. O histórico local foi salvo como backup.");
    }

    const message = buildOrderMessage(
      cart,
      checkout,
      config.business,
      subtotal,
      total,
      deliveryFee
    );

    const url = whatsappOrderUrl(config.business.whatsappNumber, message);
    saveCart([]);
    setCart([]);
    const opened = window.open(url, "_blank", "noopener,noreferrer");
    if (!opened) {
      window.location.href = url;
    }
  }

  if (loading || !config) {
    return (
      <main className="gz-cosmic-page flex min-h-dvh items-center justify-center p-6">
        <p className="text-[var(--gz-muted)]">Carregando…</p>
      </main>
    );
  }

  const { texts, business } = config;

  return (
    <main className="gz-cosmic-page mx-auto min-h-dvh max-w-xl px-4 py-6 pb-28">
      <Link
        href="/"
        className="text-sm text-[var(--gz-muted)] underline hover:text-[var(--gz-secondary)]"
      >
        ← Voltar ao cardápio
      </Link>

      <h1 className="mt-4 text-2xl font-bold text-[var(--gz-text)]">
        {texts.checkoutTitle}
      </h1>
      <p className="mt-1 text-sm text-[var(--gz-muted)]">{texts.checkoutHint}</p>

      {cart.length === 0 ? (
        <p className="mt-8 text-[var(--gz-muted)]">{texts.emptyCart}</p>
      ) : (
        <>
          <ul className="mt-6 space-y-3">
            {cart.map((item) => {
              const { calda, extras } = itemModifiersSummary(item);
              return (
                <li
                  key={item.lineId}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-[var(--gz-text)]">
                        {item.quantity}x {item.flavorName} · {item.sizeLabel}
                      </p>
                      <p className="mt-1 text-xs text-[var(--gz-muted)]">
                        Calda: {calda?.name ?? "—"}
                      </p>
                      {extras.length > 0 && (
                        <p className="text-xs text-[var(--gz-muted)]">
                          Adicionais: {extras.map((e) => e.name).join(", ")}
                        </p>
                      )}
                      {item.observation?.trim() && (
                        <p className="mt-1 text-xs text-[var(--gz-secondary)]">
                          Obs.: {item.observation}
                        </p>
                      )}
                      <p className="mt-2 text-sm font-semibold text-[var(--gz-secondary)]">
                        {formatMoney(cartLineTotal(item))}
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-label="Remover"
                      className="shrink-0 rounded-lg px-2 py-1 text-xs text-red-400 hover:bg-red-500/10"
                      onClick={() => {
                        const next = updateLineQuantity(cart, item.lineId, 0);
                        setCart(next);
                        saveCart(next);
                      }}
                    >
                      Remover
                    </button>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      className="h-8 w-8 rounded-full border border-white/20 text-white"
                      onClick={() => {
                        const next = updateLineQuantity(
                          cart,
                          item.lineId,
                          item.quantity - 1
                        );
                        setCart(next);
                        saveCart(next);
                      }}
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-white">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      className="h-8 w-8 rounded-full border border-white/20 text-white"
                      onClick={() => {
                        const next = updateLineQuantity(
                          cart,
                          item.lineId,
                          item.quantity + 1
                        );
                        setCart(next);
                        saveCart(next);
                      }}
                    >
                      +
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm backdrop-blur-md">
            <div className="flex justify-between text-[var(--gz-text)]">
              <span>Subtotal</span>
              <span>{formatMoney(subtotal)}</span>
            </div>
            {checkout.fulfillment === "delivery" && (
              <div className="mt-2 flex justify-between text-[var(--gz-muted)]">
                <span>Taxa de entrega</span>
                <span>{formatMoney(deliveryFee)}</span>
              </div>
            )}
            <div className="mt-2 flex justify-between text-lg font-bold">
              <span>Total</span>
              <span style={{ color: "var(--gz-secondary)" }}>
                {formatMoney(total)}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="block">
              <span className="text-sm text-[var(--gz-muted)]">
                Nome do cliente *
              </span>
              <input
                required
                value={checkout.customerName}
                onChange={(e) => setField("customerName", e.target.value)}
                className="mt-1 w-full min-h-[48px] rounded-xl border border-white/15 bg-black/30 px-3 py-3 text-base text-white"
                placeholder="Seu nome"
              />
            </label>

            <label className="block">
              <span className="text-sm text-[var(--gz-muted)]">
                Telefone do cliente *
              </span>
              <input
                required
                inputMode="tel"
                value={checkout.customerPhone}
                onChange={(e) => setField("customerPhone", e.target.value)}
                className="mt-1 w-full min-h-[48px] rounded-xl border border-white/15 bg-black/30 px-3 py-3 text-base text-white"
                placeholder="(21) 99999-9999"
              />
            </label>

            <fieldset className="space-y-2">
              <legend className="text-sm text-[var(--gz-muted)]">
                Tipo de pedido *
              </legend>
              {(
                [
                  ["pickup", texts.pickupLabel],
                  ["delivery", texts.deliveryLabel],
                ] as [FulfillmentType, string][]
              ).map(([value, label]) => (
                <label
                  key={value}
                  className="flex min-h-[52px] cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white"
                >
                  <input
                    type="radio"
                    name="fulfillment"
                    className="h-5 w-5 shrink-0"
                    checked={checkout.fulfillment === value}
                    onChange={() => setField("fulfillment", value)}
                  />
                  {label}
                </label>
              ))}
            </fieldset>

            {checkout.fulfillment === "delivery" ? (
              <>
                <label className="block">
                  <span className="text-sm text-[var(--gz-muted)]">
                    Endereço completo *
                  </span>
                  <textarea
                    required
                    rows={3}
                    value={checkout.address}
                    onChange={(e) => setField("address", e.target.value)}
                    className="mt-1 w-full min-h-[80px] rounded-xl border border-white/15 bg-black/30 px-3 py-3 text-base text-white"
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-[var(--gz-muted)]">
                    Ponto de referência
                  </span>
                  <input
                    value={checkout.reference}
                    onChange={(e) => setField("reference", e.target.value)}
                    className="mt-1 w-full min-h-[48px] rounded-xl border border-white/15 bg-black/30 px-3 py-3 text-base text-white"
                  />
                </label>
              </>
            ) : (
              <div className="rounded-xl border border-[var(--gz-primary)]/30 bg-[var(--gz-primary)]/10 p-4 text-sm text-white/90">
                <p className="font-semibold text-[var(--gz-secondary)]">
                  Retirada no local
                </p>
                <p className="mt-1">{business.address}</p>
              </div>
            )}

            <fieldset className="space-y-2">
              <legend className="text-sm text-[var(--gz-muted)]">
                Forma de pagamento *
              </legend>
              {(
                [
                  ["pix", "Pix"],
                  ["dinheiro", "Dinheiro"],
                  ["cartao", "Cartão"],
                ] as [PaymentMethod, string][]
              ).map(([value, label]) => (
                <label
                  key={value}
                  className="flex min-h-[52px] cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white"
                >
                  <input
                    type="radio"
                    name="payment"
                    className="h-5 w-5 shrink-0"
                    checked={checkout.paymentMethod === value}
                    onChange={() => setField("paymentMethod", value)}
                  />
                  {label}
                </label>
              ))}
            </fieldset>

            {checkout.paymentMethod === "dinheiro" && (
              <div className="space-y-3 rounded-xl border border-white/10 bg-white/5 p-4">
                <label className="flex cursor-pointer items-center gap-2 text-white">
                  <input
                    type="checkbox"
                    checked={checkout.needsChange}
                    onChange={(e) => setField("needsChange", e.target.checked)}
                  />
                  Precisa de troco?
                </label>
                {checkout.needsChange && (
                  <label className="block">
                    <span className="text-sm text-[var(--gz-muted)]">
                      Troco para quanto?
                    </span>
                    <input
                      value={checkout.changeFor}
                      onChange={(e) => setField("changeFor", e.target.value)}
                      placeholder="Ex.: R$ 50,00"
                      className="mt-1 w-full rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-white"
                    />
                  </label>
                )}
              </div>
            )}

            <label className="block">
              <span className="text-sm text-[var(--gz-muted)]">
                Observações do pedido (opcional)
              </span>
              <textarea
                rows={2}
                value={checkout.notes}
                onChange={(e) => setField("notes", e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-white"
              />
            </label>

            {error && (
              <p className="text-sm text-red-400" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full min-h-[56px] rounded-2xl py-4 text-base font-black uppercase tracking-wide text-white active:scale-[0.98]"
              style={{
                background:
                  "linear-gradient(135deg, var(--gz-primary), color-mix(in srgb, var(--gz-secondary) 40%, var(--gz-primary)))",
                boxShadow: "0 0 28px rgba(168, 85, 247, 0.45)",
              }}
            >
              {texts.confirmOrder}
            </button>
          </form>

          <div className="mt-10">
            <SiteFooter
              address={business.address}
              openingHours={business.openingHours}
              whatsappNumber={business.whatsappNumber}
            />
          </div>
        </>
      )}
    </main>
  );
}
