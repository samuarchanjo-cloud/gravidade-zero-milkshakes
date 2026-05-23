import type { Theme } from "@/lib/types";

type Props = { theme: Theme };

export function ThemeStyles({ theme }: Props) {
  const css = `
    :root {
      --gz-primary: ${theme.primary};
      --gz-secondary: ${theme.secondary};
      --gz-accent: ${theme.accent ?? "#4ADE80"};
      --gz-background: ${theme.background};
      --gz-surface: ${theme.surface};
      --gz-text: ${theme.text};
      --gz-muted: ${theme.muted};
      --gz-glow: color-mix(in srgb, ${theme.primary} 50%, transparent);
    }
  `;

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
