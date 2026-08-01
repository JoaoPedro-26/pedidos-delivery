import type { CreateOrderInput, Order, UpdateOrderStatusInput } from '../../features/orders/types/order'
import { canTransitionTo, ORDER_STATUS } from '../../features/orders/types/orderStatus'
import type { OrderRepository } from '../../features/orders/services/orderRepository'
import { MOCK_ORDERS } from '../data/mockOrders'

const LATENCY_MS = 350

function delay(ms = LATENCY_MS): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function createId(): string {
  return `ord-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
}

/**
 * Repositório em memória com latência simulada.
 * Facilita validar loading/error states antes da API real.
 */
export class MockOrderRepository implements OrderRepository {
  private orders: Order[] = structuredClone(MOCK_ORDERS)

  async list(): Promise<Order[]> {
    await delay()
    return [...this.orders].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
  }

  async getById(id: string): Promise<Order | null> {
    await delay()
    return this.orders.find((order) => order.id === id) ?? null
  }

  async create(input: CreateOrderInput): Promise<Order> {
    await delay()

    const now = new Date().toISOString()
    const order: Order = {
      id: createId(),
      customerName: input.customerName.trim(),
      items: input.items.map((item) => ({
        name: item.name.trim(),
        quantity: item.quantity,
      })),
      deliveryAddress: input.deliveryAddress.trim(),
      status: ORDER_STATUS.RECEBIDO,
      statusHistory: [{ status: ORDER_STATUS.RECEBIDO, occurredAt: now }],
      createdAt: now,
      updatedAt: now,
    }

    this.orders = [order, ...this.orders]
    return order
  }

  async updateStatus({ orderId, status }: UpdateOrderStatusInput): Promise<Order> {
    await delay()

    const index = this.orders.findIndex((order) => order.id === orderId)
    if (index === -1) {
      throw new Error('Pedido não encontrado.')
    }

    const current = this.orders[index]
    if (!canTransitionTo(current.status, status)) {
      throw new Error(`Transição inválida: ${current.status} → ${status}`)
    }

    const now = new Date().toISOString()
    const updated: Order = {
      ...current,
      status,
      statusHistory: [...current.statusHistory, { status, occurredAt: now }],
      updatedAt: now,
    }

    this.orders[index] = updated
    return updated
  }
}
