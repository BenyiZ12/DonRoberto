import { MapPin, Navigation, Phone } from 'lucide-react';
import { address, contact, openingHours } from '@/data/business';
import { Button } from '@/components/ui/Button';
import { SectionHead } from '@/components/ui/SectionHead';
import { HoursList } from './HoursList';
import { MapPanel } from './MapPanel';
import styles from './LocationPreview.module.css';

const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  address.mapsSearchQuery,
)}`;

export function LocationPreview() {
  return (
    <section className="section section--cream" aria-labelledby="ubicacion-preview">
      <div className="container">
        <SectionHead
          id="ubicacion-preview"
          eyebrow="Dónde estamos"
          title="En el centro de San Isidro"
          lead="A unos pasos de la plaza, con comercios, transporte y el centro de Pérez Zeledón al alcance de la mano."
        />

        <div className={styles.layout}>
          <MapPanel />

          <div className={styles.info}>
            <div className={styles.block}>
              <h3 className={styles.blockTitle}>
                <MapPin size={17} strokeWidth={1.7} aria-hidden="true" />
                Dirección
              </h3>
              <address className={styles.address}>
                {address.streetLine}
                <br />
                {address.landmark}
                <br />
                {address.city}, {address.region}, {address.province}
                <br />
                {address.country}
              </address>
              <Button
                href={mapsUrl}
                external
                variant="outline"
                size="sm"
                icon={<Navigation size={15} strokeWidth={2} aria-hidden="true" />}
              >
                Abrir en Google Maps
              </Button>
            </div>

            <div className={styles.block}>
              <h3 className={styles.blockTitle}>
                <Phone size={17} strokeWidth={1.7} aria-hidden="true" />
                Teléfono
              </h3>
              <p className={styles.phone}>
                <a href={`tel:${contact.phoneE164}`}>{contact.phoneDisplay}</a>
              </p>
            </div>

            <div className={styles.block}>
              <h3 className={styles.blockTitle}>{openingHours.title}</h3>
              <HoursList hours={openingHours} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
