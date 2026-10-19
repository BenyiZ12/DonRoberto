import {
  BedDouble,
  Car,
  ConciergeBell,
  SquareParking,
  UtensilsCrossed,
  Wifi,
} from 'lucide-react';
import { services } from '@/data/business';
import { SectionHead } from '@/components/ui/SectionHead';
import styles from './ServicesGrid.module.css';

const ICONS = {
  bed: BedDouble,
  wifi: Wifi,
  parking: SquareParking,
  coffee: UtensilsCrossed,
  utensils: UtensilsCrossed,
  concierge: ConciergeBell,
  leaf: BedDouble,
  car: Car,
} as const;

export function ServicesGrid() {
  const published = services.filter((service) => service.status === 'confirmed');

  return (
    <section className="section" aria-labelledby="servicios-title">
      <div className="container">
        <SectionHead
          id="servicios-title"
          eyebrow="Lo que ofrece el hotel"
          title="Lo esencial, resuelto"
          lead="Un hotel pequeño se sostiene en detalles sencillos: un lugar limpio, wifi que funciona, parqueo cerca de la puerta y alguien que conteste el teléfono. Eso es lo que ofrecemos en Don Roberto."
        />

        <ul className={styles.grid}>
          {published.map((service) => {
            const Icon = ICONS[service.icon];
            return (
              <li key={service.id} className={styles.item}>
                <span className={styles.icon} aria-hidden="true">
                  <Icon size={22} strokeWidth={1.6} />
                </span>
                <h3 className={styles.title}>{service.title}</h3>
                <p className={styles.description}>{service.description}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
