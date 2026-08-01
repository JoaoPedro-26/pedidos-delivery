import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/shared/components/Button/Button'
import { BrandMark } from '@/shared/components/BrandMark/BrandMark'
import { Field } from '@/shared/components/Field/Field'
import { useAuth } from '../hooks/useAuth'
import styles from './AuthPages.module.css'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await login({ email, password })
      navigate('/', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao entrar.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.page}>
      <section className={styles.panel}>
        <div className={styles.brand}>
          <BrandMark />
          <div>
            <strong>Pedidos</strong>
            <span>Delivery</span>
          </div>
        </div>

        <header className={styles.header}>
          <h1>Entrar</h1>
          <p>Acesse o rastreador de pedidos com seu e-mail e senha.</p>
        </header>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <Field
            label="E-mail"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="voce@empresa.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={isSubmitting}
            required
          />
          <Field
            label="Senha"
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={isSubmitting}
            required
          />

          {error ? <p className={styles.error}>{error}</p> : null}

          <Button type="submit" disabled={isSubmitting || !email || !password}>
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <p className={styles.switch}>
          Ainda não tem conta? <Link to="/register">Criar cadastro</Link>
        </p>
      </section>
    </div>
  )
}
