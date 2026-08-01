import type { OrderStatusHistoryEntry } from '../../types/order'
import type { OrderStatus } from '../../types/orderStatus'
import {
  ORDER_STATUS,
  ORDER_STATUS_LABEL,
  ORDER_TIMELINE_STEPS,
} from '../../types/orderStatus'
import { formatTimelineDateTime } from '@/shared/utils/format'
import styles from './StatusTimeline.module.css'

type StepState = 'completed' | 'current' | 'pending'

interface TimelineStepView {
  status: OrderStatus
  label: string
  state: StepState
  occurredAt?: string
}

interface StatusTimelineProps {
  currentStatus: OrderStatus
  statusHistory: OrderStatusHistoryEntry[]
}

function buildSteps(
  currentStatus: OrderStatus,
  statusHistory: OrderStatusHistoryEntry[],
): TimelineStepView[] {
  const historyByStatus = new Map(
    statusHistory.map((entry) => [entry.status, entry.occurredAt] as const),
  )
  const isCancelled = currentStatus === ORDER_STATUS.CANCELADO
  const currentIndex = isCancelled
    ? -1
    : ORDER_TIMELINE_STEPS.indexOf(currentStatus)

  return ORDER_TIMELINE_STEPS.map((status, index) => {
    const occurredAt = historyByStatus.get(status)
    let state: StepState = 'pending'

    if (isCancelled) {
      state = occurredAt ? 'completed' : 'pending'
    } else if (status === currentStatus) {
      state = status === ORDER_STATUS.ENTREGUE ? 'completed' : 'current'
    } else if (occurredAt || (currentIndex >= 0 && index < currentIndex)) {
      state = 'completed'
    }

    return {
      status,
      label: ORDER_STATUS_LABEL[status],
      state,
      occurredAt,
    }
  })
}

export function StatusTimeline({ currentStatus, statusHistory }: StatusTimelineProps) {
  const steps = buildSteps(currentStatus, statusHistory)
  const cancelledAt = statusHistory.find(
    (entry) => entry.status === ORDER_STATUS.CANCELADO,
  )?.occurredAt
  const isCancelled = currentStatus === ORDER_STATUS.CANCELADO

  const filledCount = steps.filter((step) => step.state !== 'pending').length
  const progressRatio =
    steps.length <= 1 ? 0 : Math.max(filledCount - 1, 0) / (steps.length - 1)

  return (
    <div className={`${styles.timeline} ${isCancelled ? styles.cancelled : ''}`}>
      <div className={styles.track} aria-hidden>
        <div
          className={styles.trackProgress}
          style={{ width: `${progressRatio * 100}%` }}
        />
      </div>

      <ol className={styles.steps}>
        {steps.map((step) => (
          <li key={step.status} className={`${styles.step} ${styles[step.state]}`}>
            <span className={styles.dot} aria-hidden>
              {step.state === 'completed' ? (
                <svg viewBox="0 0 16 16" width="12" height="12">
                  <path
                    d="M3.5 8.5 6.5 11.5 12.5 4.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : null}
            </span>
            <span className={styles.label}>{step.label}</span>
            {step.occurredAt ? (
              <time className={styles.time} dateTime={step.occurredAt}>
                {formatTimelineDateTime(step.occurredAt)}
              </time>
            ) : (
              <span className={styles.timePlaceholder}>—</span>
            )}
          </li>
        ))}
      </ol>

      {isCancelled ? (
        <div className={styles.cancelBanner} role="status">
          <span className={styles.cancelDot} aria-hidden>
            ×
          </span>
          <div>
            <strong>Pedido cancelado</strong>
            {cancelledAt ? (
              <time dateTime={cancelledAt}>{formatTimelineDateTime(cancelledAt)}</time>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}
