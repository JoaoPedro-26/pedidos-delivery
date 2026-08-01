import type { OrderItem } from '../types/order'

export interface CreateOrderFormValues {
  customerName: string
  deliveryAddress: string
  itemsText: string
}

export interface CreateOrderFormErrors {
  customerName?: string
  deliveryAddress?: string
  itemsText?: string
}

export function parseItemsText(raw: string): OrderItem[] {
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const match = line.match(/^(\d+)\s*[xX]?\s+(.+)$/)
      if (match) {
        return {
          quantity: Number(match[1]),
          name: match[2].trim(),
        }
      }

      return { quantity: 1, name: line }
    })
    .filter((item) => item.name.length > 0 && item.quantity > 0)
}

export function validateCreateOrderForm(
  values: CreateOrderFormValues,
): CreateOrderFormErrors {
  const errors: CreateOrderFormErrors = {}

  if (!values.customerName.trim()) {
    errors.customerName = 'Informe o nome do cliente.'
  }

  if (!values.deliveryAddress.trim()) {
    errors.deliveryAddress = 'Informe o endereço de entrega.'
  }

  const items = parseItemsText(values.itemsText)
  if (items.length === 0) {
    errors.itemsText = 'Informe ao menos um item (ex.: 1x Pizza).'
  }

  return errors
}
