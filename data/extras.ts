import type { ModifierGroup } from "@/lib/types";

/** Calda obrigatória — edite nomes e opções aqui */
export const syrupGroup: ModifierGroup = {
  id: "calda",
  name: "Calda",
  required: true,
  min: 1,
  max: 1,
  options: [
    { id: "calda-morango", name: "Morango", price: 0 },
    { id: "calda-chocolate", name: "Chocolate", price: 0 },
    { id: "calda-caramelo", name: "Caramelo", price: 0 },
    { id: "calda-leite-condensado", name: "Leite condensado", price: 0 },
    { id: "sem-calda", name: "Sem calda", price: 0 },
  ],
};

/**
 * Adicionais extras — edite nome e price de cada item aqui.
 */
export const extrasGroup: ModifierGroup = {
  id: "extras",
  name: "Adicionais",
  required: false,
  min: 0,
  max: 10,
  options: [
    { id: "chantilly", name: "Chantilly extra", price: 2 },
    { id: "oreo", name: "Oreo", price: 3 },
    { id: "amendoim", name: "Amendoim", price: 2 },
    { id: "granulado", name: "Granulado", price: 1.5 },
    { id: "leite-po", name: "Leite em pó", price: 2 },
    { id: "ovomaltine", name: "Ovomaltine", price: 3 },
    { id: "calda-extra", name: "Calda extra", price: 2 },
  ],
};

export const modifierGroups: ModifierGroup[] = [syrupGroup, extrasGroup];
