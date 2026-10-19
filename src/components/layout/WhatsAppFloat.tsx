'use client';

import { MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { trackEvent } from '@/lib/analytics';
import { whatsappUrl } from '@/lib/whatsapp';
import styles from './WhatsAppFloat.module.css';

const MESSAGE =
  'Hola, Don Roberto. Quisiera consultar disponibilidad de habitaciones. ¿Me pueden orientar?';

/**
 * Botón flotante de WhatsApp.
 *
 * Solo aparece después de un pequeño desplazamiento para no competir con la
 * llamada a la acción del encabezado, y se oculta cuando el menú móvil está
 * abierto o en pantallas muy pequeñas con barra de direcciones visible.
 */
export function WhatsAppFloat() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 420);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <a
      className={`whatsapp-float ${styles.float}`}
      data-visible={visible ? 'true' : 'false'}
      href={whatsappUrl(MESSAGE)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Consultar disponibilidad por WhatsApp"
      onClick={() => trackEvent('clic_whatsapp', { ubicacion: 'flotante' })}
    >
      <MessageCircle size={20} strokeWidth={2} aria-hidden="true" />
      <span className={styles.label}>Consultar disponibilidad</span>
    </a>
  );
}
