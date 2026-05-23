export type FlavorVisual = {
  glow: string;
  gradientFrom: string;
  gradientTo: string;
  border: string;
  imageGlow: string;
};

const DEFAULT: FlavorVisual = {
  glow: "rgba(168, 85, 247, 0.45)",
  gradientFrom: "#1e1035",
  gradientTo: "#0a0618",
  border: "rgba(168, 85, 247, 0.35)",
  imageGlow: "rgba(139, 92, 246, 0.5)",
};

const BY_ID: Record<string, FlavorVisual> = {
  marte: {
    glow: "rgba(244, 63, 94, 0.5)",
    gradientFrom: "#3b0a1a",
    gradientTo: "#120610",
    border: "rgba(251, 113, 133, 0.4)",
    imageGlow: "rgba(244, 63, 94, 0.55)",
  },
  netuno: {
    glow: "rgba(56, 189, 248, 0.55)",
    gradientFrom: "#0c1e3d",
    gradientTo: "#050a18",
    border: "rgba(56, 189, 248, 0.4)",
    imageGlow: "rgba(34, 211, 238, 0.6)",
  },
  eclipse: {
    glow: "rgba(217, 119, 6, 0.45)",
    gradientFrom: "#2a1508",
    gradientTo: "#0c0804",
    border: "rgba(251, 191, 36, 0.35)",
    imageGlow: "rgba(180, 83, 9, 0.5)",
  },
  jupiter: {
    glow: "rgba(234, 179, 8, 0.4)",
    gradientFrom: "#2a1f0a",
    gradientTo: "#100c04",
    border: "rgba(250, 204, 21, 0.35)",
    imageGlow: "rgba(161, 98, 7, 0.45)",
  },
  saturno: {
    glow: "rgba(251, 146, 60, 0.45)",
    gradientFrom: "#2a1808",
    gradientTo: "#100804",
    border: "rgba(251, 146, 60, 0.38)",
    imageGlow: "rgba(234, 88, 12, 0.5)",
  },
  "meteoro-crocante": {
    glow: "rgba(249, 115, 22, 0.5)",
    gradientFrom: "#2a1206",
    gradientTo: "#0e0804",
    border: "rgba(251, 146, 60, 0.4)",
    imageGlow: "rgba(234, 88, 12, 0.55)",
  },
  "via-lactea": {
    glow: "rgba(192, 132, 252, 0.5)",
    gradientFrom: "#2a1450",
    gradientTo: "#0c0618",
    border: "rgba(216, 180, 254, 0.4)",
    imageGlow: "rgba(168, 85, 247, 0.55)",
  },
  plutao: {
    glow: "rgba(236, 72, 153, 0.45)",
    gradientFrom: "#2a0a28",
    gradientTo: "#100410",
    border: "rgba(244, 114, 182, 0.4)",
    imageGlow: "rgba(192, 38, 211, 0.5)",
  },
  "area-51": {
    glow: "rgba(74, 222, 128, 0.55)",
    gradientFrom: "#0a2818",
    gradientTo: "#040e08",
    border: "rgba(74, 222, 128, 0.45)",
    imageGlow: "rgba(34, 197, 94, 0.55)",
  },
  "materia-escura": {
    glow: "rgba(99, 102, 241, 0.5)",
    gradientFrom: "#0f0a2e",
    gradientTo: "#020208",
    border: "rgba(129, 140, 248, 0.4)",
    imageGlow: "rgba(67, 56, 202, 0.6)",
  },
};

export function getFlavorVisual(flavorId: string): FlavorVisual {
  return BY_ID[flavorId] ?? DEFAULT;
}
