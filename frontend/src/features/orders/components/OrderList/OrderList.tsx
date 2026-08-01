import type { Order } from '../../types/order'
import type { OrderStatus } from '../../types/orderStatus'
import { OrderCard } from '../OrderCard/OrderCard'
import styles from './OrderList.module.css'

interface OrderListProps {
  orders: Order[]
  isLoading: boolean
  updatingOrderId: string | null
  onStatusChange: (orderId: string, status: OrderStatus) => void
}

export function OrderList({
  orders,
  isLoading,
  updatingOrderId,
  onStatusChange,
}: OrderListProps) {
  if (isLoading) {
    return (
      <div className={styles.state} role="status">
        <div className={styles.spinner} aria-hidden />
        <p>Carregando pedidos...</p>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className={styles.state}>
        <h3>Nenhum pedido ainda</h3>
        <p>Crie o primeiro pedido para começar a rastrear entregas.</p>
      </div>
    )
  }

  return (
    <div className={styles.grid}>
      {orders.map((order, index) => (
        <div key={order.id} style={{ animationDelay: `${index * 40}ms` }}>
          <OrderCard
            order={order}
            isUpdating={updatingOrderId === order.id}
            onStatusChange={onStatusChange}
          />
        </div>
      ))}
    </div>
  )
}
