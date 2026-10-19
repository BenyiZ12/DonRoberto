import type { ReactNode } from 'react';
import styles from './SectionHead.module.css';

export interface SectionHeadProps {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  /** `center` centra el bloque; `split` usa dos columnas. */
  layout?: 'stack' | 'center' | 'split';
  /** Etiqueta de la acción a la derecha (solo en `split`). */
  action?: ReactNode;
  /** Nivel del encabezado. Por defecto `h2`. */
  as?: 'h1' | 'h2' | 'h3';
  id?: string;
  className?: string;
}

export function SectionHead({
  eyebrow,
  title,
  lead,
  layout = 'stack',
  action,
  as: Tag = 'h2',
  id,
  className,
}: SectionHeadProps) {
  const layoutClass =
    layout === 'center'
      ? styles.center
      : layout === 'split'
        ? styles.split
        : styles.stack;

  return (
    <div className={`${styles.head} ${layoutClass} ${className ?? ''}`}>
      <div className={styles.main}>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <Tag className={styles.title} id={id}>
          {title}
        </Tag>
        {lead ? <div className={`lead ${styles.lead}`}>{lead}</div> : null}
      </div>
      {action ? <div className={styles.action}>{action}</div> : null}
    </div>
  );
}
