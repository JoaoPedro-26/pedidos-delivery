import { Link, Outlet } from 'react-router-dom'
import { Button } from '@/shared/components/Button/Button'
import { BrandMark } from '@/shared/components/BrandMark/BrandMark'
import { useAuth } from '@/features/auth/hooks/useAuth'
import styles from './AppLayout.module.css'

export function AppLayout() {
  const { user, logout } = useAuth()

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link to="/" className={styles.brand}>
            <BrandMark />
            <span className={styles.brandText}>
              <strong>Pedidos</strong>
              <span className={styles.brandSuffix}>Delivery</span>
            </span>
          </Link>

          <div className={styles.headerActions}>
            <nav className={styles.nav} aria-label="Principal">
              <Link to="/" className={styles.navLink}>
                Pedidos
              </Link>
            </nav>
            {user ? (
              <div className={styles.userMenu}>
                <span className={styles.userName} title={user.email}>
                  {user.name}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  className={styles.logoutButton}
                  onClick={logout}
                >
                  Sair
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <p>Mini Rastreador de Pedidos — conectado à API Spring Boot.</p>
      </footer>
    </div>
  )
}
