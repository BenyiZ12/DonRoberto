import type { ReactNode } from 'react';
import styles from './PageHero.module.css';

export interface PageHeroProps {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  /** Contenido adicional (botones, avisos). */
  children?: ReactNode;
}

/**
 * Encabezado de las páginas interiores.
 *
 * Reutiliza el motivo de arco de la portada para dar identidad a cada
 * sección sin recurrir a imágenes de banco que no representen el local.
 */
export function PageHero({ eyebrow, title, lead, children }: PageHeroProps) {
  return (
    <section className={styles.hero} aria-labelledby="titulo-pagina">
      <svg className={styles.deco} viewBox="0 0 200 240" fill="none" aria-hidden="true">
        <path
          d="M10 234V96a90 90 0 0 1 180 0v138"
          stroke="currentColor"
          strokeWidth="1.2"
          opacity="0.5"
        />
        <path d="M100 14v220M10 160h180" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
      </svg>

      <div className={`container ${styles.inner}`}>
        {eyebrow ? <p className={`eyebrow ${styles.eyebrow}`}>{eyebrow}</p> : null}
        <h1 className={styles.title} id="titulo-pagina">
          {title}
        </h1>
        {lead ? <p className={styles.lead}>{lead}</p> : null}
        {children ? <div className={styles.extra}>{children}</div> : null}
      </div>
    </section>
  );
}
