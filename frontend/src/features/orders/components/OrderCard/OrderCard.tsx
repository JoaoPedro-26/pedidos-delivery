import type { Order } from '../../types/order'
import type { OrderStatus } from '../../types/orderStatus'
import { formatDateTime, formatItemsSummary } from '@/shared/utils/format'
import { StatusBadge } from '../StatusBadge/StatusBadge'
import { StatusActions } from '../StatusActions/StatusActions'
import { StatusTimeline } from '../StatusTimeline/StatusTimeline'
import styles from './OrderCard.module.css'

interface OrderCardProps {
  order: Order
  isUpdating?: boolean
  onStatusChange: (orderId: string, status: OrderStatus) => void
}

export function OrderCard({ order, isUpdating = false, onStatusChange }: OrderCardProps) {
  return (
    <article className={`${styles.card} ${isUpdating ? styles.updating : ''}`}>
      {isUpdating ? (
        <div className={styles.loadingOverlay} role="status" aria-live="polite">
          <div className={styles.spinner} aria-hidden />
          <span>Atualizando status...</span>
        </div>
      ) : null}

      <header className={styles.header}>
        <div>
          <p className={styles.id}>{order.id}</p>
          <h3>{order.customerName}</h3>
        </div>
        <StatusBadge status={order.status} />
      </header>

      <StatusTimeline
        currentStatus={order.status}
        statusHistory={order.statusHistory ?? []}
      />

      <dl className={styles.meta}>
        <div>
          <dt>Itens</dt>
          <dd>{formatItemsSummary(order.items)}</dd>
        </div>
        <div>
          <dt>Endereço</dt>
          <dd>{order.deliveryAddress}</dd>
        </div>
        <div className={styles.timestamps}>
          <div>
            <dt>Criado</dt>
            <dd>{formatDateTime(order.createdAt)}</dd>
          </div>
          <div>
            <dt>Atualizado</dt>
            <dd>{formatDateTime(order.updatedAt)}</dd>
          </div>
        </div>
      </dl>

      <footer className={styles.footer}>
        <StatusActions
          currentStatus={order.status}
          disabled={isUpdating}
          onChange={(status) => onStatusChange(order.id, status)}
        />
      </footer>
    </article>
  )
}
