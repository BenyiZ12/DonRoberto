import { MessageCircle } from 'lucide-react';
import { business } from '@/data/business';
import { Button } from '@/components/ui/Button';
import styles from './CtaBand.module.css';

export interface CtaBandProps {
  title?: string;
  text?: string;
  /** Enlace del botón principal. */
  href?: string;
  ctaLabel?: string;
}

export function CtaBand({
  title = '¿Consultamos disponibilidad?',
  text = 'Contanos las fechas y cuántos son. El equipo de Don Roberto te responde con las habitaciones disponibles y las tarifas vigentes.',
  href = '/habitaciones#consulta',
  ctaLabel = 'Consultar habitación',
}: CtaBandProps) {
  return (
    <section className={`section section--forest ${styles.band}`} aria-labelledby="cta-band-title">
      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          <h2 className={styles.title} id="cta-band-title">
            {title}
          </h2>
          <p className={styles.text}>{text}</p>
        </div>
        <Button
          href={href}
          variant="terracotta"
          size="lg"
          icon={<MessageCircle size={18} strokeWidth={2} aria-hidden="true" />}
        >
          {ctaLabel}
        </Button>
      </div>
      <p className={styles.disclaimer}>
        {business.fullName} · {business.phoneDisplay} · San Isidro de El General, Pérez Zeledón
      </p>
    </section>
  );
}
