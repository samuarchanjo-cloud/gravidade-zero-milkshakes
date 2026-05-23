import Link from "next/link";
import { InstagramButton } from "@/components/InstagramButton";

type Props = {
  address: string;
  openingHours: string;
  whatsappNumber: string;
};

export function SiteFooter({ address, openingHours, whatsappNumber }: Props) {
  const wa = whatsappNumber.replace(/\D/g, "");

  return (
    <footer className="mx-4 mb-6 mt-4 space-y-5 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--gz-secondary)]">
          Contato
        </p>
        <p className="mt-2 text-sm text-white/75">{openingHours}</p>
        <p className="mt-1 text-sm text-white/60">{address}</p>
      </div>

      <InstagramButton fullWidth />

      <a
        href={`https://wa.me/${wa}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold text-white"
        style={{
          background:
            "linear-gradient(135deg, #25D366, color-mix(in srgb, #128C7E 40%, #25D366))",
          boxShadow: "0 0 20px rgba(37, 211, 102, 0.25)",
        }}
      >
        Falar no WhatsApp
      </a>

      <p className="text-center text-[10px] text-white/25">
        <Link href="/admin" className="underline hover:text-[var(--gz-muted)]">
          Área do lojista
        </Link>
      </p>
    </footer>
  );
}
