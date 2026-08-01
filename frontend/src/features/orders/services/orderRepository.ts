import type { CreateOrderInput, Order, UpdateOrderStatusInput } from '../types/order'

/**
 * Contrato da camada de pedidos.
 * Hoje: implementação mock. Depois: cliente HTTP do Spring Boot sem mudar a UI.
 */
export interface OrderRepository {
  list(): Promise<Order[]>
  getById(id: string): Promise<Order | null>
  create(input: CreateOrderInput): Promise<Order>
  updateStatus(input: UpdateOrderStatusInput): Promise<Order>
}
