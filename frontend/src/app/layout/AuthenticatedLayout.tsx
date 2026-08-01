import { OrdersProvider } from '@/features/orders/hooks/useOrders'
import { AppLayout } from './AppLayout'

/** Provider de pedidos + shell autenticado. */
export function AuthenticatedLayout() {
  return (
    <OrdersProvider>
      <AppLayout />
    </OrdersProvider>
  )
}
