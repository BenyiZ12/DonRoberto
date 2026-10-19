import styles from './Logo.module.css';

export interface LogoProps {
  /** `light` para fondos oscuros. */
  tone?: 'dark' | 'light';
  /** Oculta el descriptor "Hotel y Cafetería" (versiones compactas). */
  compact?: boolean;
  className?: string;
}

/**
 * Logotipo tipográfico provisional.
 *
 * La marca "Don Roberto" en serif editorial con un descriptor discreto.
 * Cuando el propietario tenga el logotipo original, se sustituye el bloque
 * `<span>` de texto por la imagen y se mantiene la misma altura.
 */
export function Logo({ tone = 'dark', compact = false, className }: LogoProps) {
  return (
    <span className={`${styles.logo} ${tone === 'light' ? styles.light : ''} ${className ?? ''}`}>
      <svg
        className={styles.mark}
        viewBox="0 0 40 48"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M3 46V19a17 17 0 0 1 34 0v27"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d="M20 5.5V46M3 31h34"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.5"
        />
      </svg>
      <span className={styles.text}>
        <span className={styles.name}>Don Roberto</span>
        {compact ? null : <span className={styles.descriptor}>Hotel y Cafetería</span>}
      </span>
    </span>
  );
}
