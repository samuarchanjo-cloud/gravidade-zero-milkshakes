"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setLoading(false);
    if (!res.ok) {
      setError("Senha incorreta.");
      return;
    }

    router.replace("/admin");
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4">
      <h1 className="text-2xl font-bold">Área do lojista</h1>
      <p className="mt-1 text-sm text-[var(--gz-muted)]">
        Entre para editar cores, textos, cardápio e WhatsApp.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <label className="block">
          <span className="text-sm text-[var(--gz-muted)]">Senha</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-xl border border-white/15 bg-[var(--gz-surface)] px-3 py-2"
          />
        </label>

        {error && (
          <p className="text-sm text-red-400" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full py-3 font-semibold text-white disabled:opacity-60"
          style={{ background: "var(--gz-primary)" }}
        >
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </form>

      <Link href="/" className="mt-6 text-center text-sm text-[var(--gz-muted)] underline">
        Voltar à loja
      </Link>
    </main>
  );
}
