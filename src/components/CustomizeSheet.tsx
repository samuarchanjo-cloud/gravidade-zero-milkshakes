"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  Flavor,
  ModifierGroup,
  SelectedModifier,
  SizeOption,
  Texts,
} from "@/lib/types";
import {
  buildDisplayName,
  calcUnitPrice,
  formatMoney,
  getFlavorSizePrice,
  validateModifierSelection,
} from "@/lib/pricing";
import { StoreImage } from "@/components/StoreImage";
import { getFlavorVisual } from "@/lib/flavorTheme";
import { PRODUCT_IMAGE_SHEET_CLASS } from "@/lib/imageClasses";

type Props = {
  flavor: Flavor | null;
  sizes: SizeOption[];
  modifierGroups: ModifierGroup[];
  texts: Texts;
  onClose: () => void;
  onAdd: (line: {
    flavorId: string;
    flavorName: string;
    sizeId: string;
    sizeLabel: string;
    modifiers: SelectedModifier[];
    unitPrice: number;
    displayName: string;
    quantity: number;
    observation?: string;
  }) => void;
};

export function CustomizeSheet({
  flavor,
  sizes,
  modifierGroups,
  texts,
  onClose,
  onAdd,
}: Props) {
  const [sizeId, setSizeId] = useState("");
  const [picked, setPicked] = useState<SelectedModifier[]>([]);
  const [qty, setQty] = useState(1);
  const [observation, setObservation] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!flavor) return;
    setSizeId(sizes[0]?.id ?? "");
    setPicked([]);
    setQty(1);
    setObservation("");
    setError("");
  }, [flavor, sizes]);

  const size = sizes.find((s) => s.id === sizeId);
  const visual = flavor ? getFlavorVisual(flavor.id) : null;

  const unitPrice = useMemo(() => {
    if (!size || !flavor) return 0;
    return calcUnitPrice(flavor, size, sizes, picked);
  }, [flavor, size, sizes, picked]);

  if (!flavor || !visual) return null;

  function toggleModifier(
    group: ModifierGroup,
    optionId: string,
    optionName: string,
    price: number
  ) {
    setError("");
    const inGroup = picked.filter((p) => p.groupId === group.id);

    if (group.max === 1) {
      const without = picked.filter((p) => p.groupId !== group.id);
      setPicked([
        ...without,
        {
          groupId: group.id,
          groupName: group.name,
          optionId,
          name: optionName,
          price,
        },
      ]);
      return;
    }

    const exists = inGroup.find((p) => p.optionId === optionId);
    if (exists) {
      setPicked(picked.filter((p) => p.optionId !== optionId));
      return;
    }
    if (inGroup.length >= group.max) {
      setError(`Máximo de ${group.max} em "${group.name}".`);
      return;
    }
    setPicked([
      ...picked,
      {
        groupId: group.id,
        groupName: group.name,
        optionId,
        name: optionName,
        price,
      },
    ]);
  }

  function isOptionSelected(groupId: string, optionId: string) {
    return picked.some((p) => p.groupId === groupId && p.optionId === optionId);
  }

  function handleAdd() {
    if (!flavor) return;
    if (!size) {
      setError("Escolha o tamanho.");
      return;
    }
    const validation = validateModifierSelection(modifierGroups, picked);
    if (validation) {
      setError(validation);
      return;
    }

    onAdd({
      flavorId: flavor.id,
      flavorName: flavor.name,
      sizeId: size.id,
      sizeLabel: size.label,
      modifiers: picked,
      unitPrice,
      displayName: buildDisplayName(flavor, size, picked),
      quantity: qty,
      observation: observation.trim() || undefined,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-label="Fechar"
        onClick={onClose}
      />
      <div
        className="relative max-h-[92dvh] overflow-y-auto rounded-t-[2rem] shadow-2xl"
        style={{
          background: `linear-gradient(180deg, ${visual.gradientFrom} 0%, #080612 100%)`,
          boxShadow: `0 -8px 48px ${visual.glow}, inset 0 1px 0 rgba(255,255,255,0.08)`,
        }}
      >
        {flavor.imageUrl && (
          <div className="relative aspect-[16/9] max-h-52 w-full overflow-hidden">
            <div
              className="absolute inset-0 z-0"
              style={{
                background: `radial-gradient(ellipse 80% 100% at 50% 100%, ${visual.imageGlow}, transparent)`,
              }}
            />
            <StoreImage
              src={flavor.imageUrl}
              alt={flavor.name}
              className={`relative z-10 ${PRODUCT_IMAGE_SHEET_CLASS}`}
            />
            <div
              className="absolute inset-0 z-20 bg-gradient-to-t from-[#080612] to-transparent"
              aria-hidden
            />
          </div>
        )}

        <div className="sticky top-0 z-10 px-4 pb-3 pt-3 backdrop-blur-md">
          <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-white/25" />
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2
                className="text-2xl font-black text-white"
                style={{ textShadow: `0 0 20px ${visual.glow}` }}
              >
                {flavor.name}
              </h2>
              <p className="text-sm text-white/60">{flavor.description}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-white/10 px-3 py-1 text-2xl text-white/70"
            >
              ×
            </button>
          </div>
        </div>

        <div className="space-y-6 px-4 py-4">
          <section>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-[var(--gz-secondary)]">
              {texts.sizeLabel}
            </h3>
            <div className="flex flex-wrap gap-2">
              {sizes.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSizeId(s.id)}
                  className="rounded-2xl border-2 px-4 py-2.5 text-sm font-bold transition"
                  style={{
                    borderColor:
                      sizeId === s.id ? "var(--gz-secondary)" : "rgba(255,255,255,0.15)",
                    background:
                      sizeId === s.id
                        ? "color-mix(in srgb, var(--gz-primary) 35%, transparent)"
                        : "rgba(255,255,255,0.05)",
                    color: sizeId === s.id ? "#fff" : "var(--gz-muted)",
                    boxShadow:
                      sizeId === s.id ? `0 0 16px ${visual.glow}` : "none",
                  }}
                >
                  {s.label} — {formatMoney(getFlavorSizePrice(flavor, s.id, sizes))}
                </button>
              ))}
            </div>
          </section>

          {modifierGroups.map((group) => (
            <section key={group.id}>
              <h3 className="mb-1 text-xs font-bold uppercase tracking-widest text-white/80">
                {group.name}
                {group.required && (
                  <span className="ml-1 text-[var(--gz-accent)]">*</span>
                )}
              </h3>
              <div className="space-y-2">
                {group.options.map((opt) => (
                  <label
                    key={opt.id}
                    className="flex cursor-pointer items-center justify-between rounded-2xl border px-3 py-3 transition"
                    style={{
                      borderColor: isOptionSelected(group.id, opt.id)
                        ? visual.border
                        : "rgba(255,255,255,0.1)",
                      background: isOptionSelected(group.id, opt.id)
                        ? "rgba(255,255,255,0.08)"
                        : "rgba(0,0,0,0.25)",
                    }}
                  >
                    <div className="flex items-center gap-3 text-white">
                      <input
                        type={group.max === 1 ? "radio" : "checkbox"}
                        name={group.max === 1 ? group.id : undefined}
                        checked={isOptionSelected(group.id, opt.id)}
                        onChange={() =>
                          toggleModifier(group, opt.id, opt.name, opt.price)
                        }
                      />
                      <span className="text-sm font-medium">{opt.name}</span>
                    </div>
                    {opt.price > 0 && (
                      <span className="text-sm text-[var(--gz-secondary)]">
                        + {formatMoney(opt.price)}
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </section>
          ))}

          <section>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-white/80">
              Observação
            </h3>
            <input
              type="text"
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              placeholder="Ex.: sem granulado, ponto extra de calda…"
              className="w-full rounded-2xl border border-white/15 bg-black/30 px-3 py-3 text-sm text-white placeholder:text-white/35"
            />
          </section>

          <section className="flex items-center justify-between text-white">
            <span className="text-sm font-medium">Quantidade</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="h-9 w-9 rounded-full border border-white/20 text-lg"
                onClick={() => setQty(Math.max(1, qty - 1))}
              >
                −
              </button>
              <span className="w-6 text-center font-semibold">{qty}</span>
              <button
                type="button"
                className="h-9 w-9 rounded-full border border-white/20 text-lg"
                onClick={() => setQty(qty + 1)}
              >
                +
              </button>
            </div>
          </section>

          {error && (
            <p className="text-sm text-red-400" role="alert">
              {error}
            </p>
          )}
        </div>

        <div className="sticky bottom-0 border-t border-white/10 bg-black/40 p-4 backdrop-blur-xl">
          <button
            type="button"
            onClick={handleAdd}
            className="w-full rounded-2xl py-4 text-base font-black text-white"
            style={{
              background:
                "linear-gradient(135deg, var(--gz-primary), color-mix(in srgb, var(--gz-accent) 30%, var(--gz-primary)))",
              boxShadow: `0 0 28px ${visual.glow}`,
            }}
          >
            {texts.addToCart} — {formatMoney(unitPrice * qty)}
          </button>
        </div>
      </div>
    </div>
  );
}
