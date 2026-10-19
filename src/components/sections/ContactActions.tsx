import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { address, contact } from '@/data/business';
import { whatsappUrl } from '@/lib/whatsapp';
import { Button } from '@/components/ui/Button';
import styles from './ContactActions.module.css';

const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  address.mapsSearchQuery,
)}`;

export interface ContactActionsProps {
  /** `dark` para fondos oscuros. */
  tone?: 'light' | 'dark';
  className?: string;
  /** Cambia el mensaje prellenado de WhatsApp. */
  message?: string;
  showEmail?: boolean;
}

export function ContactActions({
  tone = 'light',
  className,
  message = 'Hola, Don Roberto. Quisiera hacer una consulta. ¿Me pueden orientar?',
  showEmail = false,
}: ContactActionsProps) {
  const dark = tone === 'dark';

  return (
    <div className={`${styles.actions} ${className ?? ''}`} data-tone={tone}>
      <Button
        href={whatsappUrl(message)}
        external
        variant={dark ? 'light' : 'terracotta'}
        icon={<MessageCircle size={18} strokeWidth={2} aria-hidden="true" />}
      >
        Escribir por WhatsApp
      </Button>

      <Button
        href={`tel:${contact.phoneE164}`}
        external
        variant={dark ? 'ghost-light' : 'outline'}
        icon={<Phone size={18} strokeWidth={2} aria-hidden="true" />}
      >
        Llamar {contact.phoneDisplay}
      </Button>

      <Button
        href={mapsUrl}
        external
        variant={dark ? 'ghost-light' : 'outline'}
        icon={<MapPin size={18} strokeWidth={2} aria-hidden="true" />}
      >
        Abrir en Google Maps
      </Button>

      {showEmail ? (
        <Button
          href={`mailto:${contact.email}`}
          external
          variant={dark ? 'ghost-light' : 'outline'}
          icon={<Mail size={18} strokeWidth={2} aria-hidden="true" />}
        >
          {contact.email}
        </Button>
      ) : null}
    </div>
  );
}
