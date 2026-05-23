import type { Flavor } from "@/lib/types";
import { getProductImage } from "./images";

/**
 * Cardápio de sabores — edite nome, descrição, categoria, available e customPrices.
 * Imagens: data/images.ts (getProductImage usa URL real ou placeholder).
 */
export const products: Flavor[] = [
  {
    id: "marte",
    name: "Marte",
    description:
      "Morango cremoso da galáxia com base espacial e calda alienígena",
    imageUrl: getProductImage("marte"),
    category: "Clássicos",
    available: true,
  },
  {
    id: "netuno",
    name: "Netuno",
    description:
      "Baunilha espacial azul com brilho cósmico e chantilly",
    imageUrl: getProductImage("netuno"),
    category: "Clássicos",
    available: true,
  },
  {
    id: "via-lactea",
    name: "Via Láctea",
    description:
      "Base cremosa de leite em pó com chocolate e Oreo, finalizada com chantilly e pedaços de biscoito",
    imageUrl: getProductImage("via-lactea"),
    category: "Mais Pedidos",
    available: true,
  },
  {
    id: "eclipse",
    name: "Eclipse",
    description:
      "Chocolate meio amargo equilibrado, coberto com chantilly e finalização intensa de chocolate",
    imageUrl: getProductImage("eclipse"),
    category: "Clássicos",
    available: true,
  },
  {
    id: "meteoro-crocante",
    name: "Meteoro Crocante",
    description:
      "Chocolate cremoso com pedaços crocantes, finalizado com chantilly e extra de crocância no topo",
    imageUrl: getProductImage("meteoro-crocante"),
    category: "Mais Pedidos",
    available: true,
  },
  {
    id: "jupiter",
    name: "Júpiter",
    description:
      "Chocolate com amendoim, cremoso e intenso, com finalização crocante",
    imageUrl: getProductImage("jupiter"),
    category: "Premium",
    available: true,
  },
  {
    id: "saturno",
    name: "Saturno",
    description:
      "Milkshake especial com visual cósmico e sabor marcante da casa",
    imageUrl: getProductImage("saturno"),
    category: "Premium",
    available: true,
  },
  {
    id: "plutao",
    name: "Plutão",
    description:
      "Sabor misterioso, gelado e distante, feito para quem quer experimentar algo diferente",
    imageUrl: getProductImage("plutao"),
    category: "Misterioso da Semana",
    available: true,
  },
  {
    id: "area-51",
    name: "Área 51",
    description: "Receita secreta da nave, cremosa e surpreendente",
    imageUrl: getProductImage("area-51"),
    category: "Misterioso da Semana",
    available: true,
  },
  {
    id: "materia-escura",
    name: "Matéria Escura",
    description:
      "Chocolate intenso sem amendoim, escuro, cremoso e misterioso",
    imageUrl: getProductImage("materia-escura"),
    category: "Premium",
    available: true,
  },
];
