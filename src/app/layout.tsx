import type { Metadata } from "next";
import "./globals.css";
import { readStore } from "@/lib/store";
import { ThemeStyles } from "@/components/ThemeStyles";
import { StoreProvider } from "@/components/StoreProvider";

export async function generateMetadata(): Promise<Metadata> {
  const store = await readStore();
  return {
    title: store.branding.name,
    description: store.branding.tagline,
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const store = await readStore();

  return (
    <html lang="pt-BR">
      <body>
        <ThemeStyles theme={store.theme} />
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
