import type { OrderStatus } from './orderStatus'

export interface OrderItem {
  name: string
  quantity: number
}

export interface OrderStatusHistoryEntry {
  status: OrderStatus
  occurredAt: string
}

export interface Order {
  id: string
  customerName: string
  items: OrderItem[]
  deliveryAddress: string
  status: OrderStatus
  statusHistory: OrderStatusHistoryEntry[]
  createdAt: string
  updatedAt: string
}

export interface CreateOrderInput {
  customerName: string
  items: OrderItem[]
  deliveryAddress: string
}

export interface UpdateOrderStatusInput {
  orderId: string
  status: OrderStatus
}
