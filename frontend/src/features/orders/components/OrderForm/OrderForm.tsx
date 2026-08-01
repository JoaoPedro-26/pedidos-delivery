import { useMemo, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Button } from '@/shared/components/Button/Button'
import { Field } from '@/shared/components/Field/Field'
import {
  parseItemsText,
  validateCreateOrderForm,
  type CreateOrderFormErrors,
  type CreateOrderFormValues,
} from '../../utils/orderForm'
import type { CreateOrderInput } from '../../types/order'
import styles from './OrderForm.module.css'

const INITIAL_VALUES: CreateOrderFormValues = {
  customerName: '',
  deliveryAddress: '',
  itemsText: '',
}

interface OrderFormProps {
  isSubmitting?: boolean
  onSubmit: (input: CreateOrderInput) => Promise<void>
  onCancel: () => void
}

export function OrderForm({ isSubmitting = false, onSubmit, onCancel }: OrderFormProps) {
  const [values, setValues] = useState<CreateOrderFormValues>(INITIAL_VALUES)
  const [errors, setErrors] = useState<CreateOrderFormErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)

  const canSubmit = useMemo(
    () => Object.values(values).some((value) => value.trim().length > 0),
    [values],
  )

  const handleChange =
    (field: keyof CreateOrderFormValues) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((current) => ({ ...current, [field]: event.target.value }))
      setErrors((current) => ({ ...current, [field]: undefined }))
      setSubmitError(null)
    }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors = validateCreateOrderForm(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) return

    try {
      await onSubmit({
        customerName: values.customerName,
        deliveryAddress: values.deliveryAddress,
        items: parseItemsText(values.itemsText),
      })
      setValues(INITIAL_VALUES)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Não foi possível criar o pedido.')
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <Field
        label="Nome do cliente"
        name="customerName"
        placeholder="Ex.: Maria Oliveira"
        value={values.customerName}
        onChange={handleChange('customerName')}
        error={errors.customerName}
        disabled={isSubmitting}
        autoFocus
      />

      <Field
        as="textarea"
        label="Itens do pedido"
        name="items"
        placeholder={'1x Pizza Calabresa\n2x Refrigerante'}
        value={values.itemsText}
        onChange={handleChange('itemsText')}
        error={errors.itemsText}
        hint="Um item por linha. Aceita formato 2x Nome."
        disabled={isSubmitting}
      />

      <Field
        as="textarea"
        label="Endereço de entrega"
        name="deliveryAddress"
        placeholder="Rua, número, bairro, cidade/UF"
        value={values.deliveryAddress}
        onChange={handleChange('deliveryAddress')}
        error={errors.deliveryAddress}
        disabled={isSubmitting}
      />

      {submitError ? <p className={styles.error}>{submitError}</p> : null}

      <div className={styles.actions}>
        <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting || !canSubmit}>
          {isSubmitting ? 'Criando...' : 'Criar pedido'}
        </Button>
      </div>
    </form>
  )
}
