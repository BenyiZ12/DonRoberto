import { ArrowRight, MessageCircle, Wifi, BedDouble, SquareParking } from 'lucide-react';
import { openingHours, photoSlot } from '@/data/business';
import { Button } from '@/components/ui/Button';
import { PhotoSlot } from '@/components/ui/PhotoSlot';
import { TrackLink } from '@/components/ui/TrackLink';
import styles from './Hero.module.css';

const heroPhoto = photoSlot('fachada-principal');

const facts = [
  { icon: BedDouble, label: '12 habitaciones' },
  { icon: Wifi, label: 'Wi-Fi sin costo' },
  { icon: SquareParking, label: 'Estacionamiento' },
];

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={`container ${styles.inner}`}>
        <div className={styles.content}>
          <p className={`eyebrow ${styles.eyebrow}`}>Hotel y Cafetería · Pérez Zeledón</p>

          <h1 className={styles.title} id="hero-title">
            Dormir y comer bien,{' '}
            <span className={styles.titleAccent}>en el mismo lugar</span> de San Isidro
          </h1>

          <p className={styles.lead}>
            Un hotel pequeño de doce habitaciones con baño privado y, en el mismo local, una
            cafetería con cocina costarricense. En el centro de San Isidro de El General.
          </p>

          <div className={styles.actions}>
            <Button
              href="/habitaciones#consulta"
              variant="terracotta"
              size="lg"
              icon={<MessageCircle size={18} strokeWidth={2} aria-hidden="true" />}
            >
              Consultar habitación
            </Button>
            <Button
              href="/cafeteria"
              variant="ghost-light"
              size="lg"
              icon={<ArrowRight size={18} strokeWidth={2} aria-hidden="true" />}
            >
              Explorar la cafetería
            </Button>
          </div>

          <ul className={styles.facts}>
            {facts.map((fact) => {
              const Icon = fact.icon;
              return (
                <li key={fact.label} className={styles.fact}>
                  <Icon size={17} strokeWidth={1.7} aria-hidden="true" />
                  {fact.label}
                </li>
              );
            })}
          </ul>
        </div>

        <div className={styles.media}>
          <PhotoSlot
            photo={heroPhoto}
            kind="facade"
            ratio="portrait"
            className={styles.photo}
            priority
            sizes="(max-width: 900px) 100vw, 45vw"
          />

          <div className={styles.card}>
            <p className={styles.cardLabel}>Cafetería</p>
            <p className={styles.cardValue}>{openingHours.days[0]?.value}</p>
            <p className={styles.cardNote}>Lunes a viernes</p>
            <TrackLink
              className={styles.cardLink}
              href="/cafeteria"
              event="visita_menu"
              params={{ origen: 'hero' }}
            >
              Ver horarios y menú
              <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
            </TrackLink>
          </div>
        </div>
      </div>
    </section>
  );
}
