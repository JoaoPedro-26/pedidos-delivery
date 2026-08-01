import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { CreateOrderInput, Order } from '../types/order'
import type { OrderStatus } from '../types/orderStatus'
import { orderRepository } from '../services/orderService'

interface OrdersContextValue {
  orders: Order[]
  isLoading: boolean
  isMutating: boolean
  updatingOrderId: string | null
  error: string | null
  refresh: () => Promise<void>
  createOrder: (input: CreateOrderInput) => Promise<Order>
  updateStatus: (orderId: string, status: OrderStatus) => Promise<Order>
}

const OrdersContext = createContext<OrdersContextValue | null>(null)

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isMutating, setIsMutating] = useState(false)
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await orderRepository.list()
      setOrders(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao carregar pedidos.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const createOrder = useCallback(async (input: CreateOrderInput) => {
    setIsMutating(true)
    setError(null)

    try {
      const created = await orderRepository.create(input)
      setOrders((current) => [created, ...current])
      return created
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Falha ao criar pedido.'
      setError(message)
      throw err
    } finally {
      setIsMutating(false)
    }
  }, [])

  const updateStatus = useCallback(async (orderId: string, status: OrderStatus) => {
    setUpdatingOrderId(orderId)
    setError(null)

    try {
      const updated = await orderRepository.updateStatus({ orderId, status })
      setOrders((current) =>
        current.map((order) => (order.id === orderId ? updated : order)),
      )
      return updated
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Falha ao atualizar status.'
      setError(message)
      throw err
    } finally {
      setUpdatingOrderId(null)
    }
  }, [])

  const value = useMemo(
    () => ({
      orders,
      isLoading,
      isMutating,
      updatingOrderId,
      error,
      refresh,
      createOrder,
      updateStatus,
    }),
    [
      orders,
      isLoading,
      isMutating,
      updatingOrderId,
      error,
      refresh,
      createOrder,
      updateStatus,
    ],
  )

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
}

export function useOrders(): OrdersContextValue {
  const context = useContext(OrdersContext)
  if (!context) {
    throw new Error('useOrders deve ser usado dentro de OrdersProvider.')
  }
  return context
}
