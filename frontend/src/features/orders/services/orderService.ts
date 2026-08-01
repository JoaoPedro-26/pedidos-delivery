import { HttpOrderRepository } from './httpOrderRepository'
import type { OrderRepository } from './orderRepository'

/** Implementação ativa: API Spring Boot. */
export const orderRepository: OrderRepository = new HttpOrderRepository()
