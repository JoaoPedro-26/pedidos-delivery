import type { OrderStatus } from '../../types/orderStatus'
import {
  getNextStatuses,
  ORDER_STATUS_LABEL,
} from '../../types/orderStatus'
import styles from './StatusActions.module.css'

interface StatusActionsProps {
  currentStatus: OrderStatus
  disabled?: boolean
  onChange: (status: OrderStatus) => void
}

export function StatusActions({
  currentStatus,
  disabled = false,
  onChange,
}: StatusActionsProps) {
  const nextStatuses = getNextStatuses(currentStatus)

  if (nextStatuses.length === 0) {
    return <span className={styles.terminal}>Status final</span>
  }

  return (
    <div className={styles.actions}>
      {nextStatuses.map((status) => (
        <button
          key={status}
          type="button"
          className={`${styles.action} ${status === 'CANCELADO' ? styles.cancel : styles.advance}`}
          disabled={disabled}
          onClick={() => onChange(status)}
        >
          {status === 'CANCELADO'
            ? 'Cancelar'
            : `Marcar como ${ORDER_STATUS_LABEL[status].toLowerCase()}`}
        </button>
      ))}
    </div>
  )
}
