import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { address, business, contact, openingHours, social } from '@/data/business';
import { site } from '@/data/site';
import { whatsappUrl } from '@/lib/whatsapp';
import { FacebookIcon } from '@/components/ui/SocialIcon';
import { TrackLink } from '@/components/ui/TrackLink';
import { Logo } from './Logo';
import styles from './Footer.module.css';

const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  address.mapsSearchQuery,
)}`;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className={`container ${styles.inner}`}>
        <div className={styles.brandCol}>
          <Logo tone="light" />
          <p className={styles.about}>
            Hotel y cafetería en San Isidro de El General, Pérez Zeledón. Doce habitaciones con
            baño privado y una cocina costarricense en el mismo local.
          </p>
          {social
            .filter((item) => item.verified)
            .map((item) => (
              <a
                key={item.id}
                className={styles.social}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FacebookIcon size={16} />
                <span>{item.label}</span>
              </a>
            ))}
        </div>

        <nav className={styles.col} aria-label="Navegación del pie de página">
          <h2 className={styles.colTitle}>Sitio</h2>
          <ul className={styles.list}>
            {site.mainNav.map((item) => (
              <li key={item.href}>
                <TrackLink href={item.href}>{item.label}</TrackLink>
              </li>
            ))}
            {site.secondaryNav.map((item) => (
              <li key={item.href}>
                <TrackLink href={item.href}>{item.label}</TrackLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.col}>
          <h2 className={styles.colTitle}>Contacto</h2>
          <ul className={styles.list}>
            <li>
              <a
                className={styles.contactLink}
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MapPin size={15} strokeWidth={1.8} aria-hidden="true" />
                <span>
                  {address.streetLine}
                  <br />
                  {address.city}, {address.region}
                </span>
              </a>
            </li>
            <li>
              <a className={styles.contactLink} href={`tel:${contact.phoneE164}`}>
                <Phone size={15} strokeWidth={1.8} aria-hidden="true" />
                <span>{contact.phoneDisplay}</span>
              </a>
            </li>
            <li>
              <a
                className={styles.contactLink}
                href={whatsappUrl('Hola, Don Roberto. Quisiera hacer una consulta.')}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle size={15} strokeWidth={1.8} aria-hidden="true" />
                <span>WhatsApp</span>
              </a>
            </li>
            <li>
              <a className={styles.contactLink} href={`mailto:${contact.email}`}>
                <Mail size={15} strokeWidth={1.8} aria-hidden="true" />
                <span>{contact.email}</span>
              </a>
            </li>
          </ul>
        </div>

        <div className={styles.col}>
          <h2 className={styles.colTitle}>{openingHours.title}</h2>
          <ul className={styles.hoursList}>
            {openingHours.days.map((day) => (
              <li key={day.label} className={styles.hoursRow}>
                <span className={styles.hoursLabel}>
                  <Clock size={14} strokeWidth={1.8} aria-hidden="true" />
                  {day.label}
                </span>
                <span className={styles.hoursValue}>{day.value ?? 'Por confirmar'}</span>
              </li>
            ))}
          </ul>
          <p className={styles.hoursNote}>
            El horario de recepción del hotel se confirma al reservar.
          </p>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={`container ${styles.bottomInner}`}>
          <p>
            © {year} {business.fullName}. Todos los derechos reservados.
          </p>
          <p className={styles.bottomNote}>
            Este sitio no procesa reservas ni pagos en línea. La disponibilidad y las tarifas las
            confirma el equipo de Don Roberto.
          </p>
        </div>
      </div>
    </footer>
  );
}
