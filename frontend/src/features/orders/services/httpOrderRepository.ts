import { ApiError } from '@/shared/api/apiError'
import { apiRequest } from '@/shared/api/httpClient'
import type { CreateOrderInput, Order, UpdateOrderStatusInput } from '../types/order'
import type { OrderRepository } from './orderRepository'

export class HttpOrderRepository implements OrderRepository {
  async list(): Promise<Order[]> {
    return apiRequest<Order[]>('/api/orders')
  }

  async getById(id: string): Promise<Order | null> {
    try {
      return await apiRequest<Order>(`/api/orders/${id}`)
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return null
      }
      throw error
    }
  }

  async create(input: CreateOrderInput): Promise<Order> {
    return apiRequest<Order>('/api/orders', {
      method: 'POST',
      body: JSON.stringify(input),
    })
  }

  async updateStatus({ orderId, status }: UpdateOrderStatusInput): Promise<Order> {
    return apiRequest<Order>(`/api/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
  }
}
