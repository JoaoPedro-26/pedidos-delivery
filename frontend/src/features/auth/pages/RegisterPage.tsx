import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/shared/components/Button/Button'
import { BrandMark } from '@/shared/components/BrandMark/BrandMark'
import { Field } from '@/shared/components/Field/Field'
import { useAuth } from '../hooks/useAuth'
import styles from './AuthPages.module.css'

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await register({ name, email, password })
      navigate('/', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao cadastrar.')
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
          <h1>Criar conta</h1>
          <p>Cadastre-se para gerenciar e rastrear pedidos de delivery.</p>
        </header>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <Field
            label="Nome"
            name="name"
            autoComplete="name"
            placeholder="Seu nome"
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={isSubmitting}
            required
          />
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
            autoComplete="new-password"
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            hint="Use ao menos 6 caracteres."
            disabled={isSubmitting}
            required
          />

          {error ? <p className={styles.error}>{error}</p> : null}

          <Button
            type="submit"
            disabled={isSubmitting || !name || !email || password.length < 6}
          >
            {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
          </Button>
        </form>

        <p className={styles.switch}>
          Já tem conta? <Link to="/login">Fazer login</Link>
        </p>
      </section>
    </div>
  )
}
