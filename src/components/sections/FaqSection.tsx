import { Accordion } from '@/components/ui/Accordion';
import { SectionHead } from '@/components/ui/SectionHead';
import { TrackLink } from '@/components/ui/TrackLink';
import { faqs } from '@/data/faq';
import { ArrowRight } from 'lucide-react';
import styles from './FaqSection.module.css';

export interface FaqSectionProps {
  /** Cantidad de preguntas que se muestran. */
  limit?: number;
  /** Muestra el enlace a la página completa. */
  showAllLink?: boolean;
  title?: string;
  eyebrow?: string;
  lead?: string;
}

export function FaqSection({
  limit,
  showAllLink = true,
  title = 'Preguntas frecuentes',
  eyebrow = 'Antes de escribirnos',
  lead = 'Lo que más nos preguntan por teléfono y por WhatsApp. Si tu duda no está aquí, escríbenos y te la contestamos.',
}: FaqSectionProps) {
  const items = typeof limit === 'number' ? faqs.slice(0, limit) : faqs;

  return (
    <section className="section" aria-labelledby="faq-title">
      <div className="container">
        <SectionHead id="faq-title" eyebrow={eyebrow} title={title} lead={lead} />

        <div className={styles.layout}>
          <Accordion items={items} defaultOpenFirst />

          {showAllLink ? (
            <div className={styles.aside}>
              <p className={styles.asideLabel}>¿Buscabas algún tema en particular?</p>
              <TrackLink
                className="link-arrow"
                href="/preguntas-frecuentes"
                event="clic_navegacion"
                params={{ destino: 'faq-completo' }}
              >
                Ver todas las preguntas
                <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
              </TrackLink>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
