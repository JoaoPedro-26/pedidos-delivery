import type { OrderStatus } from '../../types/orderStatus'
import { ORDER_STATUS_LABEL } from '../../types/orderStatus'
import styles from './StatusBadge.module.css'

const STATUS_CLASS: Record<OrderStatus, string> = {
  RECEBIDO: styles.recebido,
  EM_PREPARO: styles.emPreparo,
  SAIU_PARA_ENTREGA: styles.saiuParaEntrega,
  ENTREGUE: styles.entregue,
  CANCELADO: styles.cancelado,
}

interface StatusBadgeProps {
  status: OrderStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`${styles.badge} ${STATUS_CLASS[status]}`}>
      {ORDER_STATUS_LABEL[status]}
    </span>
  )
}
