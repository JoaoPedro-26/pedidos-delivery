export const ORDER_STATUS = {
  RECEBIDO: 'RECEBIDO',
  EM_PREPARO: 'EM_PREPARO',
  SAIU_PARA_ENTREGA: 'SAIU_PARA_ENTREGA',
  ENTREGUE: 'ENTREGUE',
  CANCELADO: 'CANCELADO',
} as const

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS]

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  RECEBIDO: 'Recebido',
  EM_PREPARO: 'Em preparo',
  SAIU_PARA_ENTREGA: 'Saiu para entrega',
  ENTREGUE: 'Entregue',
  CANCELADO: 'Cancelado',
}

/** Fluxo feliz exibido na linha do tempo. */
export const ORDER_TIMELINE_STEPS: readonly OrderStatus[] = [
  ORDER_STATUS.RECEBIDO,
  ORDER_STATUS.EM_PREPARO,
  ORDER_STATUS.SAIU_PARA_ENTREGA,
  ORDER_STATUS.ENTREGUE,
] as const

/** Transições válidas — espelha a regra de negócio do backend. */
export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, readonly OrderStatus[]> = {
  RECEBIDO: [ORDER_STATUS.EM_PREPARO, ORDER_STATUS.CANCELADO],
  EM_PREPARO: [ORDER_STATUS.SAIU_PARA_ENTREGA, ORDER_STATUS.CANCELADO],
  SAIU_PARA_ENTREGA: [ORDER_STATUS.ENTREGUE, ORDER_STATUS.CANCELADO],
  ENTREGUE: [],
  CANCELADO: [],
}

export function canTransitionTo(from: OrderStatus, to: OrderStatus): boolean {
  return ORDER_STATUS_TRANSITIONS[from].includes(to)
}

export function getNextStatuses(current: OrderStatus): readonly OrderStatus[] {
  return ORDER_STATUS_TRANSITIONS[current]
}
