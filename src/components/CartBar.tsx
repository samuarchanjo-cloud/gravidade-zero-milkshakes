"use client";

import Link from "next/link";
import type { CartItem, Texts } from "@/lib/types";
import { cartSubtotal, formatMoney } from "@/lib/pricing";

type Props = {
  items: CartItem[];
  texts: Texts;
};

export function CartBar({ items, texts }: Props) {
  const count = items.reduce((n, i) => n + i.quantity, 0);
  if (count === 0) return null;

  const subtotal = cartSubtotal(items);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-30 p-4 backdrop-blur-xl"
      style={{
        background: "rgba(8, 6, 18, 0.92)",
        borderTop: "1px solid rgba(168, 85, 247, 0.25)",
        boxShadow: "0 -8px 32px rgba(168, 85, 247, 0.2)",
      }}
    >
      <div className="mx-auto flex max-w-xl items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-white/45">
            {count} {count === 1 ? "item" : "itens"}
          </p>
          <p
            className="text-xl font-black text-white"
            style={{ textShadow: "0 0 16px rgba(34, 211, 238, 0.4)" }}
          >
            {formatMoney(subtotal)}
          </p>
        </div>
        <Link
          href="/checkout"
          className="flex min-h-[48px] min-w-[120px] items-center justify-center rounded-2xl px-6 py-3 text-sm font-black uppercase tracking-wide text-[#050510] active:scale-95"
          style={{
            background:
              "linear-gradient(135deg, var(--gz-secondary), var(--gz-accent))",
            boxShadow: "0 0 24px rgba(74, 222, 128, 0.35)",
          }}
        >
          {texts.viewCart}
        </Link>
      </div>
    </div>
  );
}
