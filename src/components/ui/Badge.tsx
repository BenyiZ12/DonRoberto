import type { ReactNode } from 'react';
import styles from './Badge.module.css';

export type BadgeTone = 'demo' | 'pending' | 'neutral' | 'accent';

export interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}

/** Etiqueta corta. `demo` marca contenido de ejemplo no verificado. */
export function Badge({ children, tone = 'neutral', className }: BadgeProps) {
  return <span className={`${styles.badge} ${styles[tone]} ${className ?? ''}`}>{children}</span>;
}
