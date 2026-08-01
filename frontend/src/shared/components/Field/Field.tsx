import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'
import styles from './Field.module.css'

interface FieldBaseProps {
  label: string
  error?: string
  hint?: string
}

interface TextFieldProps
  extends FieldBaseProps, InputHTMLAttributes<HTMLInputElement> {
  as?: 'input'
}

interface TextAreaProps
  extends FieldBaseProps, TextareaHTMLAttributes<HTMLTextAreaElement> {
  as: 'textarea'
}

type FieldProps = TextFieldProps | TextAreaProps

export function Field(props: FieldProps) {
  const { label, error, hint, as = 'input', id, ...rest } = props
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, '-')

  return (
    <label className={styles.field} htmlFor={fieldId}>
      <span className={styles.label}>{label}</span>
      {as === 'textarea' ? (
        <textarea
          id={fieldId}
          className={`${styles.control} ${error ? styles.invalid : ''}`}
          {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          id={fieldId}
          className={`${styles.control} ${error ? styles.invalid : ''}`}
          {...(rest as InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      {error ? <span className={styles.error}>{error}</span> : null}
      {!error && hint ? <span className={styles.hint}>{hint}</span> : null}
    </label>
  )
}
