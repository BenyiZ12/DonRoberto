import { ArrowRight, Bath, BedDouble, Tv, Wifi } from 'lucide-react';
import { photoSlot } from '@/data/business';
import { site } from '@/data/site';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PhotoSlot } from '@/components/ui/PhotoSlot';
import { SectionHead } from '@/components/ui/SectionHead';
import styles from './RoomsPreview.module.css';

const roomPhoto = photoSlot('habitacion-principal');

const roomFacts = [
  { icon: BedDouble, label: '12 habitaciones' },
  { icon: Bath, label: 'Baño privado' },
  { icon: Wifi, label: 'Wi-Fi sin costo' },
  { icon: Tv, label: 'TV por cable' },
];

export function RoomsPreview() {
  return (
    <section className={`section ${styles.section}`} aria-labelledby="habitaciones-preview">
      <div className="container">
        <SectionHead
          id="habitaciones-preview"
          eyebrow="Hospedaje"
          title="Doce habitaciones, servicio directo"
          lead="Un hotel familiar de doce habitaciones, atendido por sus propietarios. Todos los huéspedes cenan y desayunan en la misma cocina."
          action={
            <Button
              href="/habitaciones"
              variant="outline"
              icon={<ArrowRight size={16} strokeWidth={2} aria-hidden="true" />}
            >
              Ver habitaciones
            </Button>
          }
        />

        <div className={styles.layout}>
          <PhotoSlot
            photo={roomPhoto}
            kind="room"
            ratio="wide"
            className={styles.photo}
            sizes="(max-width: 900px) 100vw, 48vw"
          />

          <div className={styles.content}>
            <ul className={styles.facts}>
              {roomFacts.map((fact) => {
                const Icon = fact.icon;
                return (
                  <li key={fact.label} className={styles.fact}>
                    <span className={styles.factIcon} aria-hidden="true">
                      <Icon size={18} strokeWidth={1.6} />
                    </span>
                    {fact.label}
                  </li>
                );
              })}
            </ul>

            <p className={styles.note}>
              Estamos publicando el detalle de cada tipo de habitación con sus fotos y tarifas
              reales. Mientras tanto, escribinos con tus fechas y te enviamos las opciones
              disponibles y sus precios.
            </p>

            <div className={styles.actions}>
              <Button
                href="/habitaciones#consulta"
                variant="terracotta"
                icon={<ArrowRight size={16} strokeWidth={2} aria-hidden="true" />}
              >
                Consultar disponibilidad
              </Button>
              {site.showDemoContent ? (
                <Badge tone="demo" className={styles.badge}>
                  Vista de ejemplo
                </Badge>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
