export type AdminPaymentMethod = "Pix" | "Dinheiro" | "Débito" | "Crédito";

export type AdminOrderStatus =
  | "Recebido"
  | "Em preparo"
  | "Saiu para entrega"
  | "Concluído";

export type AdminOrder = {
  id: string;
  customerName: string;
  total: number;
  paymentMethod: AdminPaymentMethod;
  createdAt: string;
  status: AdminOrderStatus;
};

export const mockAdminOrders: AdminOrder[] = [
  {
    id: "gz-1089",
    customerName: "Mariana Souza",
    total: 42.8,
    paymentMethod: "Pix",
    createdAt: "2026-05-24T20:18:00-03:00",
    status: "Em preparo",
  },
  {
    id: "gz-1088",
    customerName: "Lucas Andrade",
    total: 27.9,
    paymentMethod: "Crédito",
    createdAt: "2026-05-24T19:47:00-03:00",
    status: "Recebido",
  },
  {
    id: "gz-1087",
    customerName: "Renata Lima",
    total: 62.7,
    paymentMethod: "Dinheiro",
    createdAt: "2026-05-24T18:52:00-03:00",
    status: "Saiu para entrega",
  },
  {
    id: "gz-1086",
    customerName: "Thiago Martins",
    total: 19.9,
    paymentMethod: "Débito",
    createdAt: "2026-05-24T17:36:00-03:00",
    status: "Concluído",
  },
  {
    id: "gz-1085",
    customerName: "Camila Rocha",
    total: 39.8,
    paymentMethod: "Pix",
    createdAt: "2026-05-23T21:12:00-03:00",
    status: "Concluído",
  },
  {
    id: "gz-1084",
    customerName: "Pedro Nunes",
    total: 49.7,
    paymentMethod: "Crédito",
    createdAt: "2026-05-22T20:31:00-03:00",
    status: "Concluído",
  },
  {
    id: "gz-1083",
    customerName: "Aline Costa",
    total: 34.9,
    paymentMethod: "Débito",
    createdAt: "2026-05-20T16:08:00-03:00",
    status: "Concluído",
  },
  {
    id: "gz-1082",
    customerName: "Bruno Ferreira",
    total: 24.9,
    paymentMethod: "Dinheiro",
    createdAt: "2026-05-18T19:20:00-03:00",
    status: "Concluído",
  },
];
