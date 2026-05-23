"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Flavor, StoreConfig } from "@/lib/types";

type Tab =
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

export default function AdminPage() {
  const router = useRouter();
  const [config, setConfig] = useState<StoreConfig | null>(null);
  const [tab, setTab] = useState<Tab>("branding");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

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
      .then((data) => {
        if (data) setConfig(data);
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
    { id: "branding", label: "Marca" },
    { id: "theme", label: "Cores" },
    { id: "business", label: "Negócio" },
    { id: "texts", label: "Textos" },
    { id: "flavors", label: "Sabores" },
    { id: "prices", label: "Preços especiais" },
    { id: "sizes", label: "Tamanhos" },
    { id: "modifiers", label: "Adicionais" },
  ];

  return (
    <main className="mx-auto min-h-dvh max-w-2xl px-4 py-6">
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

      <section className="mt-6 space-y-4 rounded-2xl border border-white/10 bg-[var(--gz-surface)] p-4">
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
    </main>
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
