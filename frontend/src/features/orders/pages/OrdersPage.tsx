import { useMemo, useState } from 'react'
import { Button } from '@/shared/components/Button/Button'
import { Modal } from '@/shared/components/Modal/Modal'
import { ORDER_STATUS, ORDER_STATUS_LABEL, type OrderStatus } from '../types/orderStatus'
import { useOrders } from '../hooks/useOrders'
import { OrderForm } from '../components/OrderForm/OrderForm'
import { OrderList } from '../components/OrderList/OrderList'
import styles from './OrdersPage.module.css'

const FILTERS: Array<{ value: 'ALL' | OrderStatus; label: string }> = [
  { value: 'ALL', label: 'Todos' },
  ...Object.values(ORDER_STATUS).map((status) => ({
    value: status,
    label: ORDER_STATUS_LABEL[status],
  })),
]

export function OrdersPage() {
  const {
    orders,
    isLoading,
    isMutating,
    updatingOrderId,
    error,
    createOrder,
    updateStatus,
    refresh,
  } = useOrders()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<'ALL' | OrderStatus>('ALL')

  const filteredOrders = useMemo(() => {
    if (statusFilter === 'ALL') return orders
    return orders.filter((order) => order.status === statusFilter)
  }, [orders, statusFilter])

  const counts = useMemo(() => {
    return orders.reduce(
      (acc, order) => {
        acc[order.status] += 1
        return acc
      },
      {
        RECEBIDO: 0,
        EM_PREPARO: 0,
        SAIU_PARA_ENTREGA: 0,
        ENTREGUE: 0,
        CANCELADO: 0,
      } satisfies Record<OrderStatus, number>,
    )
  }, [orders])

  const handleCreate = async (input: Parameters<typeof createOrder>[0]) => {
    await createOrder(input)
    setIsFormOpen(false)
  }

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    await updateStatus(orderId, status)
  }

  return (
    <section className={styles.page}>
      <header className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>Operação de entregas</p>
          <h1>Rastreador de pedidos</h1>
          <p className={styles.subtitle}>
            Acompanhe o ciclo completo do pedido — do recebimento à entrega.
          </p>
        </div>
        <div className={styles.heroActions}>
          <Button variant="secondary" onClick={() => void refresh()} disabled={isLoading}>
            Atualizar
          </Button>
          <Button onClick={() => setIsFormOpen(true)}>Novo pedido</Button>
        </div>
      </header>

      <div className={styles.stats}>
        <article>
          <span>Ativos</span>
          <strong>
            {counts.RECEBIDO + counts.EM_PREPARO + counts.SAIU_PARA_ENTREGA}
          </strong>
        </article>
        <article>
          <span>Em preparo</span>
          <strong>{counts.EM_PREPARO}</strong>
        </article>
        <article>
          <span>Na rua</span>
          <strong>{counts.SAIU_PARA_ENTREGA}</strong>
        </article>
        <article>
          <span>Entregues</span>
          <strong>{counts.ENTREGUE}</strong>
        </article>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.filters} role="tablist" aria-label="Filtrar por status">
          {FILTERS.map((filter) => (
            <button
              key={filter.value}
              type="button"
              role="tab"
              aria-selected={statusFilter === filter.value}
              className={`${styles.filter} ${statusFilter === filter.value ? styles.active : ''}`}
              onClick={() => setStatusFilter(filter.value)}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <p className={styles.count}>
          {filteredOrders.length} pedido{filteredOrders.length === 1 ? '' : 's'}
        </p>
      </div>

      {error ? (
        <div className={styles.banner} role="alert">
          <span>{error}</span>
          <Button variant="ghost" size="sm" onClick={() => void refresh()}>
            Tentar novamente
          </Button>
        </div>
      ) : null}

      <OrderList
        orders={filteredOrders}
        isLoading={isLoading}
        updatingOrderId={updatingOrderId}
        onStatusChange={(orderId, status) => void handleStatusChange(orderId, status)}
      />

      <Modal
        open={isFormOpen}
        title="Novo pedido"
        description="Preencha os dados do cliente, itens e endereço de entrega."
        onClose={() => setIsFormOpen(false)}
      >
        <OrderForm
          isSubmitting={isMutating}
          onSubmit={handleCreate}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>
    </section>
  )
}
