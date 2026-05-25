"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Flavor, StoreConfig } from "@/lib/types";
import {
  mockAdminOrders,
  type AdminOrder,
  type AdminOrderStatus,
  type AdminPaymentMethod,
} from "./mockOrders";

type Tab =
  | "finance"
  | "orders"
  | "branding"
  | "theme"
  | "business"
  | "texts"
  | "flavors"
  | "prices"
  | "sizes"
  | "modifiers";

function newFlavor(): Flavor {
  return {
    id: `sabor-${Date.now()}`,
    name: "Novo sabor",
    description: "",
    imageUrl: "",
    category: "Novos",
    available: true,
  };
}

const paymentMethods: AdminPaymentMethod[] = [
  "Pix",
  "Dinheiro",
  "Cartão",
  "Débito",
  "Crédito",
];

const orderStatuses: AdminOrderStatus[] = [
  "Pedido recebido",
  "Pedido aceito",
  "Em preparo",
  "Saiu para entrega",
  "Finalizado",
];

const orderStatusStyles: Record<
  AdminOrderStatus,
  { dot: string; surface: string; border: string; text: string }
> = {
  "Pedido recebido": {
    dot: "#9ca3af",
    surface: "rgba(156, 163, 175, 0.14)",
    border: "rgba(156, 163, 175, 0.32)",
    text: "#e5e7eb",
  },
  "Pedido aceito": {
    dot: "#38bdf8",
    surface: "rgba(56, 189, 248, 0.14)",
    border: "rgba(56, 189, 248, 0.34)",
    text: "#bae6fd",
  },
  "Em preparo": {
    dot: "#facc15",
    surface: "rgba(250, 204, 21, 0.15)",
    border: "rgba(250, 204, 21, 0.36)",
    text: "#fde68a",
  },
  "Saiu para entrega": {
    dot: "#c084fc",
    surface: "rgba(192, 132, 252, 0.15)",
    border: "rgba(192, 132, 252, 0.36)",
    text: "#e9d5ff",
  },
  Finalizado: {
    dot: "#4ade80",
    surface: "rgba(74, 222, 128, 0.14)",
    border: "rgba(74, 222, 128, 0.34)",
    text: "#bbf7d0",
  },
};

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

function isSameDay(date: Date, reference: Date) {
  return (
    date.getFullYear() === reference.getFullYear() &&
    date.getMonth() === reference.getMonth() &&
    date.getDate() === reference.getDate()
  );
}

function isSameMonth(date: Date, reference: Date) {
  return (
    date.getFullYear() === reference.getFullYear() &&
    date.getMonth() === reference.getMonth()
  );
}

export default function AdminPage() {
  const router = useRouter();
  const [config, setConfig] = useState<StoreConfig | null>(null);
  const [tab, setTab] = useState<Tab>("finance");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [adminOrders, setAdminOrders] = useState<AdminOrder[]>(mockAdminOrders);
  const [usingMockOrders, setUsingMockOrders] = useState(true);

  useEffect(() => {
    fetch("/api/admin/config")
      .then(async (res) => {
        if (res.status === 401) {
          router.replace("/admin/login");
          return null;
        }
        if (!res.ok) throw new Error("Erro ao carregar");
        return (await res.json()) as StoreConfig;
      })
      .then(async (data) => {
        if (!data) return;
        setConfig(data);

        const ordersRes = await fetch("/api/admin/orders");
        if (!ordersRes.ok) {
          setUsingMockOrders(true);
          setAdminOrders(mockAdminOrders);
          return;
        }

        const savedOrders = (await ordersRes.json()) as AdminOrder[];
        setUsingMockOrders(savedOrders.length === 0);
        setAdminOrders(savedOrders.length > 0 ? savedOrders : mockAdminOrders);
      })
      .catch(() => setStatus("Não foi possível carregar o painel."))
      .finally(() => setLoading(false));
  }, [router]);

  async function save() {
    if (!config) return;
    setStatus("Salvando…");
    const res = await fetch("/api/admin/config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    if (!res.ok) {
      setStatus("Erro ao salvar. Verifique se ainda está logado.");
      return;
    }
    setStatus("Salvo com sucesso!");
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
  }

  async function updateOrderStatus(orderId: string, nextStatus: AdminOrderStatus) {
    setAdminOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === orderId ? { ...order, status: nextStatus } : order
      )
    );

    if (usingMockOrders) return;

    const res = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: orderId, status: nextStatus }),
    });

    if (!res.ok) {
      setStatus("Não foi possível atualizar o status do pedido.");
    }
  }

  function advanceOrderStatus(order: AdminOrder) {
    const currentIndex = orderStatuses.indexOf(order.status);
    const nextStatus = orderStatuses[Math.min(currentIndex + 1, orderStatuses.length - 1)];
    void updateOrderStatus(order.id, nextStatus);
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-2xl p-6">
        <p>Carregando painel…</p>
      </main>
    );
  }

  if (!config) {
    return (
      <main className="mx-auto max-w-2xl p-6">
        <p>{status || "Acesso negado."}</p>
      </main>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "finance", label: "Financeiro" },
    { id: "orders", label: "Pedidos" },
    { id: "branding", label: "Marca" },
    { id: "theme", label: "Cores" },
    { id: "business", label: "Negócio" },
    { id: "texts", label: "Textos" },
    { id: "flavors", label: "Sabores" },
    { id: "prices", label: "Preços especiais" },
    { id: "sizes", label: "Tamanhos" },
    { id: "modifiers", label: "Adicionais" },
  ];

  const now = new Date();
  const orders = adminOrders
    .map((order) => ({
      ...order,
      createdDate: new Date(order.createdAt),
    }))
    .sort((a, b) => b.createdDate.getTime() - a.createdDate.getTime());
  const todayOrders = orders.filter((order) => isSameDay(order.createdDate, now));
  const monthOrders = orders.filter((order) => isSameMonth(order.createdDate, now));
  const dayRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0);
  const monthRevenue = monthOrders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = monthOrders.length;
  const averageTicket = totalOrders > 0 ? monthRevenue / totalOrders : 0;
  const paymentTotals = paymentMethods.map((method) => ({
    method,
    total: monthOrders
      .filter((order) => order.paymentMethod === method)
      .reduce((sum, order) => sum + order.total, 0),
  }));
  const recentOrders = [...orders]
    .sort((a, b) => b.createdDate.getTime() - a.createdDate.getTime())
    .slice(0, 6);
  const statusCounts = orderStatuses.map((orderStatus) => ({
    status: orderStatus,
    count: orders.filter((order) => order.status === orderStatus).length,
  }));

  return (
    <main className="gz-cosmic-page mx-auto min-h-dvh max-w-5xl px-4 py-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Painel — {config.branding.name}</h1>
          <p className="text-sm text-[var(--gz-muted)]">
            Ajuste visual, cardápio e WhatsApp
          </p>
        </div>
        <div className="flex gap-2">
          <a href="/" className="rounded-lg border border-white/20 px-3 py-2 text-sm">
            Ver loja
          </a>
          <button
            type="button"
            onClick={logout}
            className="rounded-lg border border-white/20 px-3 py-2 text-sm"
          >
            Sair
          </button>
        </div>
      </div>

      <nav className="mt-6 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className="rounded-full px-4 py-2 text-sm"
            style={{
              background: tab === t.id ? "var(--gz-primary)" : "var(--gz-surface)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <section className="mt-6 space-y-4 rounded-2xl border border-white/10 bg-[var(--gz-surface)]/90 p-4 shadow-2xl shadow-purple-950/20 backdrop-blur">
        {tab === "finance" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">Financeiro</h2>
              </div>
              <p className="text-sm text-[var(--gz-muted)]">
                Resumo principal de vendas, pagamentos e pedidos recentes.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard label="Faturamento hoje" value={currencyFormatter.format(dayRevenue)} />
              <MetricCard label="Faturamento do mês" value={currencyFormatter.format(monthRevenue)} />
              <MetricCard label="Pedidos no mês" value={String(totalOrders)} />
              <MetricCard label="Ticket médio" value={currencyFormatter.format(averageTicket)} />
            </div>

            <div className="grid gap-4 lg:grid-cols-[0.9fr_1.4fr]">
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--gz-muted)]">
                  Total por forma de pagamento
                </h3>
                <div className="mt-4 space-y-3">
                  {paymentTotals.map((item) => (
                    <div
                      key={item.method}
                      className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-3"
                    >
                      <span className="text-sm font-medium">{item.method}</span>
                      <span className="text-sm font-semibold text-[var(--gz-secondary)]">
                        {currencyFormatter.format(item.total)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-white/10 bg-black/20">
                <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--gz-muted)]">
                    Pedidos recentes
                  </h3>
                  <span className="text-xs text-[var(--gz-muted)]">
                    {recentOrders.length} últimos
                  </span>
                </div>
                <div className="divide-y divide-white/10">
                  {recentOrders.map((order) => (
                    <article
                      key={order.id}
                      className="grid gap-3 px-4 py-4 sm:grid-cols-[1fr_auto] sm:items-center"
                    >
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <strong>{order.customerName}</strong>
                          <OrderStatusBadge status={order.status} />
                        </div>
                        <p className="mt-1 text-sm text-[var(--gz-muted)]">
                          {dateTimeFormatter.format(order.createdDate)} · {order.paymentMethod}
                        </p>
                      </div>
                      <strong className="text-[var(--gz-secondary)]">
                        {currencyFormatter.format(order.total)}
                      </strong>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "orders" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">Gestão de pedidos</h2>
                <p className="mt-1 text-sm text-[var(--gz-muted)]">
                  Atualize o andamento de cada pedido para manter a operação alinhada.
                </p>
                {usingMockOrders && (
                  <p className="mt-2 text-xs text-[var(--gz-muted)]">
                    Exibindo exemplos porque ainda não há pedidos reais salvos.
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {statusCounts.map((item) => (
                  <div
                    key={item.status}
                    className="rounded-xl border border-white/10 bg-black/20 px-3 py-2"
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--gz-muted)]">
                      {item.status}
                    </p>
                    <strong className="text-sm">{item.count}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-3">
              {orders.map((order) => {
                const isFinalized = order.status === "Finalizado";

                return (
                  <article
                    key={order.id}
                    className="grid gap-4 rounded-xl border border-white/10 bg-black/20 p-4 sm:grid-cols-[1fr_auto] sm:items-center"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gz-muted)]">
                          {order.id}
                        </span>
                        <OrderStatusBadge status={order.status} />
                      </div>
                      <h3 className="mt-2 text-lg font-semibold">{order.customerName}</h3>
                      <p className="mt-1 text-sm text-[var(--gz-muted)]">
                        {dateTimeFormatter.format(order.createdDate)} · {order.paymentMethod} ·{" "}
                        <span className="font-semibold text-[var(--gz-secondary)]">
                          {currencyFormatter.format(order.total)}
                        </span>
                      </p>
                      <p className="mt-1 text-sm text-[var(--gz-muted)]">
                        {order.customerPhone} ·{" "}
                        {order.fulfillment === "delivery" ? "Delivery" : "Retirada"}
                        {order.fulfillment === "delivery" && order.address
                          ? ` · ${order.address}`
                          : ""}
                      </p>
                      <div className="mt-3 space-y-1 text-xs text-white/75">
                        {order.items.map((item, index) => (
                          <p key={`${order.id}-${index}`}>
                            {item.quantity}x {item.flavorName} ({item.sizeLabel})
                            {item.modifiers.length > 0
                              ? ` · ${item.modifiers.map((modifier) => modifier.name).join(", ")}`
                              : ""}
                            {item.observation?.trim() ? ` · Obs.: ${item.observation}` : ""}
                          </p>
                        ))}
                        {order.notes?.trim() && (
                          <p className="text-[var(--gz-secondary)]">
                            Obs. pedido: {order.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-2 sm:min-w-72 sm:grid-cols-[1fr_auto]">
                      <label className="block">
                        <span className="sr-only">Status do pedido {order.id}</span>
                        <select
                          value={order.status}
                          onChange={(event) =>
                            void updateOrderStatus(
                              order.id,
                              event.target.value as AdminOrderStatus
                            )
                          }
                          className="h-11 w-full rounded-xl border border-white/15 bg-black/30 px-3 text-sm outline-none focus:border-[var(--gz-secondary)]"
                        >
                          {orderStatuses.map((orderStatus) => (
                            <option key={orderStatus} value={orderStatus}>
                              {orderStatus}
                            </option>
                          ))}
                        </select>
                      </label>
                      <button
                        type="button"
                        onClick={() => advanceOrderStatus(order)}
                        disabled={isFinalized}
                        className="h-11 rounded-xl border border-white/15 px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-45"
                        style={{
                          background: isFinalized
                            ? "rgba(255,255,255,0.04)"
                            : "var(--gz-primary)",
                        }}
                      >
                        Avançar
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
            {status && <p className="text-sm text-[var(--gz-muted)]">{status}</p>}
          </div>
        )}

        {tab === "branding" && (
          <>
            <Field
              label="Nome da loja"
              value={config.branding.name}
              onChange={(v) =>
                setConfig({ ...config, branding: { ...config.branding, name: v } })
              }
            />
            <Field
              label="Slogan"
              value={config.branding.tagline}
              onChange={(v) =>
                setConfig({
                  ...config,
                  branding: { ...config.branding, tagline: v },
                })
              }
            />
            <Field
              label="URL do logo"
              value={config.branding.logoUrl}
              onChange={(v) =>
                setConfig({
                  ...config,
                  branding: { ...config.branding, logoUrl: v },
                })
              }
            />
            <Field
              label="URL da imagem do topo (hero) — capa principal da loja"
              value={config.branding.heroImageUrl}
              onChange={(v) =>
                setConfig({
                  ...config,
                  branding: { ...config.branding, heroImageUrl: v },
                })
              }
            />
            <Field
              label="Banner — título (Capa)"
              value={config.branding.bannerTitle ?? ""}
              onChange={(v) =>
                setConfig({
                  ...config,
                  branding: { ...config.branding, bannerTitle: v },
                })
              }
            />
            <Field
              label="Banner — URL da imagem"
              value={config.branding.bannerImageUrl ?? ""}
              onChange={(v) =>
                setConfig({
                  ...config,
                  branding: { ...config.branding, bannerImageUrl: v },
                })
              }
              hint="Substitua pela capa real quando tiver o arquivo final"
            />
          </>
        )}

        {tab === "theme" && (
          <div className="grid gap-4 sm:grid-cols-2">
            {(Object.keys(config.theme) as (keyof typeof config.theme)[]).map(
              (key) => (
                <label key={key} className="block">
                  <span className="text-sm capitalize text-[var(--gz-muted)]">
                    {key}
                  </span>
                  <div className="mt-1 flex gap-2">
                    <input
                      type="color"
                      value={config.theme[key]}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          theme: { ...config.theme, [key]: e.target.value },
                        })
                      }
                      className="h-10 w-14 cursor-pointer rounded border-0 bg-transparent"
                    />
                    <input
                      value={config.theme[key]}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          theme: { ...config.theme, [key]: e.target.value },
                        })
                      }
                      className="flex-1 rounded-lg border border-white/15 bg-black/20 px-2 py-2"
                    />
                  </div>
                </label>
              )
            )}
          </div>
        )}

        {tab === "business" && (
          <>
            <Field
              label="WhatsApp (DDI+DDD+número, só dígitos)"
              value={config.business.whatsappNumber}
              onChange={(v) =>
                setConfig({
                  ...config,
                  business: { ...config.business, whatsappNumber: v },
                })
              }
              hint="Ex.: 5511987654321 — pedidos abrem conversa com este número"
            />
            <Field
              label="Endereço (retirada)"
              value={config.business.address}
              onChange={(v) =>
                setConfig({
                  ...config,
                  business: { ...config.business, address: v },
                })
              }
            />
            <Field
              label="Horário de funcionamento"
              value={config.business.openingHours}
              onChange={(v) =>
                setConfig({
                  ...config,
                  business: { ...config.business, openingHours: v },
                })
              }
            />
            <Field
              label="Taxa de delivery (R$)"
              type="number"
              value={String(config.business.deliveryFee)}
              onChange={(v) =>
                setConfig({
                  ...config,
                  business: {
                    ...config.business,
                    deliveryFee: Number(v) || 0,
                  },
                })
              }
            />
            <Field
              label="Pedido mínimo delivery (R$)"
              type="number"
              value={String(config.business.minOrderDelivery)}
              onChange={(v) =>
                setConfig({
                  ...config,
                  business: {
                    ...config.business,
                    minOrderDelivery: Number(v) || 0,
                  },
                })
              }
            />
          </>
        )}

        {tab === "texts" && (
          <>
            {(Object.keys(config.texts) as (keyof typeof config.texts)[]).map(
              (key) => (
                <Field
                  key={key}
                  label={key}
                  value={config.texts[key]}
                  onChange={(v) =>
                    setConfig({
                      ...config,
                      texts: { ...config.texts, [key]: v },
                    })
                  }
                />
              )
            )}
          </>
        )}

        {tab === "flavors" && (
          <div className="space-y-6">
            {config.flavors.map((flavor, index) => (
              <div
                key={flavor.id}
                className="space-y-3 rounded-xl border border-white/10 p-3"
              >
                <div className="flex justify-between">
                  <strong>Sabor {index + 1}</strong>
                  <button
                    type="button"
                    className="text-sm text-red-400"
                    onClick={() =>
                      setConfig({
                        ...config,
                        flavors: config.flavors.filter((f) => f.id !== flavor.id),
                      })
                    }
                  >
                    Remover
                  </button>
                </div>
                <Field
                  label="ID (slug, sem espaços)"
                  value={flavor.id}
                  onChange={(v) => {
                    const flavors = [...config.flavors];
                    flavors[index] = { ...flavor, id: v };
                    setConfig({ ...config, flavors });
                  }}
                />
                <Field
                  label="Nome do sabor"
                  value={flavor.name}
                  onChange={(v) => {
                    const flavors = [...config.flavors];
                    flavors[index] = { ...flavor, name: v };
                    setConfig({ ...config, flavors });
                  }}
                />
                <Field
                  label="Descrição"
                  value={flavor.description}
                  onChange={(v) => {
                    const flavors = [...config.flavors];
                    flavors[index] = { ...flavor, description: v };
                    setConfig({ ...config, flavors });
                  }}
                />
                <Field
                  label="Categoria"
                  value={flavor.category}
                  onChange={(v) => {
                    const flavors = [...config.flavors];
                    flavors[index] = { ...flavor, category: v };
                    setConfig({ ...config, flavors });
                  }}
                />
                <Field
                  label="URL da imagem"
                  value={flavor.imageUrl}
                  onChange={(v) => {
                    const flavors = [...config.flavors];
                    flavors[index] = { ...flavor, imageUrl: v };
                    setConfig({ ...config, flavors });
                  }}
                  hint="Links Instasize (/p/...) funcionam — o site converte automaticamente"
                />
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={flavor.available}
                    onChange={(e) => {
                      const flavors = [...config.flavors];
                      flavors[index] = {
                        ...flavor,
                        available: e.target.checked,
                      };
                      setConfig({ ...config, flavors });
                    }}
                  />
                  Disponível no cardápio
                </label>
              </div>
            ))}
            <button
              type="button"
              className="rounded-lg border border-dashed border-white/30 px-4 py-2 text-sm"
              onClick={() =>
                setConfig({
                  ...config,
                  flavors: [...config.flavors, newFlavor()],
                })
              }
            >
              + Adicionar sabor
            </button>
          </div>
        )}

        {tab === "prices" && (
          <div className="space-y-6">
            <p className="text-sm text-[var(--gz-muted)]">
              Defina preços diferentes para sabores premium. Deixe em branco para
              usar o valor padrão da aba Tamanhos (
              {config.sizes.map((s) => `${s.label}: R$ ${s.price}`).join(" · ")}).
            </p>
            {config.flavors.map((flavor, index) => (
              <div
                key={flavor.id}
                className="space-y-3 rounded-xl border border-white/10 p-3"
              >
                <strong>{flavor.name}</strong>
                <div className="grid gap-3 sm:grid-cols-2">
                  {config.sizes.map((size) => (
                    <Field
                      key={size.id}
                      label={`${size.label} (padrão ${size.price})`}
                      type="number"
                      value={
                        flavor.customPrices?.[size.id] != null
                          ? String(flavor.customPrices[size.id])
                          : ""
                      }
                      onChange={(v) => {
                        const flavors = [...config.flavors];
                        const f = flavors[index];
                        const customPrices = { ...(f.customPrices ?? {}) };
                        if (v === "" || Number(v) <= 0) {
                          delete customPrices[size.id];
                        } else {
                          customPrices[size.id] = Number(v);
                        }
                        flavors[index] = {
                          ...f,
                          customPrices,
                        };
                        setConfig({ ...config, flavors });
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "sizes" && (
          <div className="space-y-4">
            {config.sizes.map((size, index) => (
              <div
                key={size.id}
                className="grid gap-3 rounded-xl border border-white/10 p-3 sm:grid-cols-3"
              >
                <Field
                  label="ID"
                  value={size.id}
                  onChange={(v) => {
                    const sizes = [...config.sizes];
                    sizes[index] = { ...size, id: v };
                    setConfig({ ...config, sizes });
                  }}
                />
                <Field
                  label="Rótulo"
                  value={size.label}
                  onChange={(v) => {
                    const sizes = [...config.sizes];
                    sizes[index] = { ...size, label: v };
                    setConfig({ ...config, sizes });
                  }}
                />
                <Field
                  label="Preço (R$)"
                  type="number"
                  value={String(size.price)}
                  onChange={(v) => {
                    const sizes = [...config.sizes];
                    sizes[index] = { ...size, price: Number(v) || 0 };
                    setConfig({ ...config, sizes });
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {tab === "modifiers" && (
          <div className="space-y-8">
            {config.modifierGroups.map((group, gi) => (
              <div
                key={group.id}
                className="space-y-3 rounded-xl border border-white/10 p-3"
              >
                <Field
                  label="Nome do grupo"
                  value={group.name}
                  onChange={(v) => {
                    const modifierGroups = [...config.modifierGroups];
                    modifierGroups[gi] = { ...group, name: v };
                    setConfig({ ...config, modifierGroups });
                  }}
                />
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={group.required}
                    onChange={(e) => {
                      const modifierGroups = [...config.modifierGroups];
                      modifierGroups[gi] = {
                        ...group,
                        required: e.target.checked,
                        min: e.target.checked ? Math.max(1, group.min) : group.min,
                      };
                      setConfig({ ...config, modifierGroups });
                    }}
                  />
                  Obrigatório (ex.: calda)
                </label>
                {group.options.map((opt, oi) => (
                  <div
                    key={opt.id}
                    className="grid gap-2 rounded-lg bg-black/10 p-2 sm:grid-cols-3"
                  >
                    <Field
                      label="Opção"
                      value={opt.name}
                      onChange={(v) => {
                        const modifierGroups = [...config.modifierGroups];
                        const options = [...group.options];
                        options[oi] = { ...opt, name: v };
                        modifierGroups[gi] = { ...group, options };
                        setConfig({ ...config, modifierGroups });
                      }}
                    />
                    <Field
                      label="Preço extra"
                      type="number"
                      value={String(opt.price)}
                      onChange={(v) => {
                        const modifierGroups = [...config.modifierGroups];
                        const options = [...group.options];
                        options[oi] = { ...opt, price: Number(v) || 0 };
                        modifierGroups[gi] = { ...group, options };
                        setConfig({ ...config, modifierGroups });
                      }}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </section>

      {tab !== "finance" && tab !== "orders" && (
        <div className="mt-6 flex items-center gap-4">
          <button
            type="button"
            onClick={save}
            className="rounded-full px-6 py-3 font-semibold text-white"
            style={{ background: "var(--gz-primary)" }}
          >
            Salvar alterações
          </button>
          {status && <p className="text-sm text-[var(--gz-muted)]">{status}</p>}
        </div>
      )}
    </main>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gz-muted)]">
        {label}
      </p>
      <strong className="mt-3 block text-2xl text-white">{value}</strong>
    </div>
  );
}

function OrderStatusBadge({ status }: { status: AdminOrderStatus }) {
  const colors = orderStatusStyles[status];

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold"
      style={{
        background: colors.surface,
        borderColor: colors.border,
        color: colors.text,
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: colors.dot }}
      />
      {status}
    </span>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm text-[var(--gz-muted)]">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2"
      />
      {hint && <p className="mt-1 text-xs text-[var(--gz-muted)]">{hint}</p>}
    </label>
  );
}
