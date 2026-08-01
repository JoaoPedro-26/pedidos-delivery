import styles from './BrandMark.module.css'

interface BrandMarkProps {
  className?: string
}

/** Marca visual: sacola de delivery. */
export function BrandMark({ className = '' }: BrandMarkProps) {
  return (
    <span className={`${styles.mark} ${className}`.trim()} aria-hidden>
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
        <path
          d="M7.5 8.5h9l.8 2.2h1.4c.7 0 1.2.7 1 1.4l-1.3 4.2a1.5 1.5 0 0 1-1.4 1.1H8c-.7 0-1.2-.4-1.4-1.1L5.3 12c-.2-.7.3-1.3 1-1.3h1.4L7.5 8.5Z"
          stroke="#fff"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <path
          d="M9 8.5V7.2A3 3 0 0 1 12 4.2v0a3 3 0 0 1 3 3v1.3"
          stroke="#fff"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <path
          d="M10.2 13.2h3.6"
          stroke="#fff"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    </span>
  )
}
