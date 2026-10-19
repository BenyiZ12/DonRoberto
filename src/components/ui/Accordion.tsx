'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useId, useState } from 'react';
import type { FaqItem } from '@/data/faq';
import styles from './Accordion.module.css';

export interface AccordionProps {
  items: FaqItem[];
  /** Abre el primer bloque por defecto. */
  defaultOpenFirst?: boolean;
  className?: string;
}

/**
 * Acordeón de preguntas frecuentes.
 *
 * Accesibilidad:
 * - Cada pregunta es un `<button>` dentro de un encabezado, con
 *   `aria-expanded` y `aria-controls`.
 * - El panel es una región (`role="region"`) asociada al botón.
 * - Los paneles cerrados quedan `inert`, de modo que sus enlaces no son
 *   alcanzables con el teclado pero el texto sigue en el DOM (bueno para SEO).
 * - Se cierra con Escape y con Enter/Espacio (comportamiento nativo).
 */
export function Accordion({ items, defaultOpenFirst = false, className }: AccordionProps) {
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>(
    defaultOpenFirst && items.length > 0 ? (items[0]?.id ?? null) : null,
  );

  return (
    <div className={`${styles.accordion} ${className ?? ''}`}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        const buttonId = `${baseId}-btn-${item.id}`;
        const panelId = `${baseId}-panel-${item.id}`;

        return (
          <div key={item.id} className={styles.item} data-open={isOpen}>
            <h3 className={styles.heading}>
              <button
                type="button"
                id={buttonId}
                className={styles.trigger}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenId(isOpen ? null : item.id)}
              >
                <span className={styles.question}>{item.question}</span>
                <span className={styles.indicator} aria-hidden="true">
                  <Plus size={18} strokeWidth={1.8} className={styles.plusIcon} />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={styles.panel}
              data-open={isOpen}
              inert={!isOpen ? true : undefined}
            >
              <div className={styles.panelInner}>
                <p className={styles.answer}>{item.answer}</p>
                {item.link ? (
                  <Link className={styles.link} href={item.link.href}>
                    {item.link.label}
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
