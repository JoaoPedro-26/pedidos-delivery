import type { Order } from '../../features/orders/types/order'
import { ORDER_STATUS } from '../../features/orders/types/orderStatus'

const hoursAgo = (hours: number): string => {
  const date = new Date()
  date.setHours(date.getHours() - hours)
  return date.toISOString()
}

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    customerName: 'Ana Souza',
    items: [
      { name: 'Pizza Margherita', quantity: 1 },
      { name: 'Refrigerante 2L', quantity: 1 },
    ],
    deliveryAddress: 'Rua das Flores, 120 — Centro, São Paulo/SP',
    status: ORDER_STATUS.RECEBIDO,
    statusHistory: [{ status: ORDER_STATUS.RECEBIDO, occurredAt: hoursAgo(0.5) }],
    createdAt: hoursAgo(0.5),
    updatedAt: hoursAgo(0.5),
  },
  {
    id: 'ord-1002',
    customerName: 'Bruno Lima',
    items: [
      { name: 'X-Burguer', quantity: 2 },
      { name: 'Batata frita', quantity: 1 },
    ],
    deliveryAddress: 'Av. Paulista, 1500 — Bela Vista, São Paulo/SP',
    status: ORDER_STATUS.EM_PREPARO,
    statusHistory: [
      { status: ORDER_STATUS.RECEBIDO, occurredAt: hoursAgo(1) },
      { status: ORDER_STATUS.EM_PREPARO, occurredAt: hoursAgo(0.4) },
    ],
    createdAt: hoursAgo(1),
    updatedAt: hoursAgo(0.4),
  },
  {
    id: 'ord-1003',
    customerName: 'Carla Mendes',
    items: [
      { name: 'Poke de salmão', quantity: 1 },
      { name: 'Suco natural', quantity: 2 },
    ],
    deliveryAddress: 'Rua Augusta, 890 — Consolação, São Paulo/SP',
    status: ORDER_STATUS.SAIU_PARA_ENTREGA,
    statusHistory: [
      { status: ORDER_STATUS.RECEBIDO, occurredAt: hoursAgo(2) },
      { status: ORDER_STATUS.EM_PREPARO, occurredAt: hoursAgo(1.2) },
      { status: ORDER_STATUS.SAIU_PARA_ENTREGA, occurredAt: hoursAgo(0.25) },
    ],
    createdAt: hoursAgo(2),
    updatedAt: hoursAgo(0.25),
  },
  {
    id: 'ord-1004',
    customerName: 'Diego Alves',
    items: [{ name: 'Combo executivo', quantity: 1 }],
    deliveryAddress: 'Rua Vergueiro, 450 — Liberdade, São Paulo/SP',
    status: ORDER_STATUS.ENTREGUE,
    statusHistory: [
      { status: ORDER_STATUS.RECEBIDO, occurredAt: hoursAgo(5) },
      { status: ORDER_STATUS.EM_PREPARO, occurredAt: hoursAgo(4.5) },
      { status: ORDER_STATUS.SAIU_PARA_ENTREGA, occurredAt: hoursAgo(3.5) },
      { status: ORDER_STATUS.ENTREGUE, occurredAt: hoursAgo(3) },
    ],
    createdAt: hoursAgo(5),
    updatedAt: hoursAgo(3),
  },
  {
    id: 'ord-1005',
    customerName: 'Elena Costa',
    items: [
      { name: 'Salada Caesar', quantity: 1 },
      { name: 'Água com gás', quantity: 1 },
    ],
    deliveryAddress: 'Alameda Santos, 200 — Jardins, São Paulo/SP',
    status: ORDER_STATUS.CANCELADO,
    statusHistory: [
      { status: ORDER_STATUS.RECEBIDO, occurredAt: hoursAgo(4) },
      { status: ORDER_STATUS.EM_PREPARO, occurredAt: hoursAgo(3.8) },
      { status: ORDER_STATUS.CANCELADO, occurredAt: hoursAgo(3.5) },
    ],
    createdAt: hoursAgo(4),
    updatedAt: hoursAgo(3.5),
  },
]
