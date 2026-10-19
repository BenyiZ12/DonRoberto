import { ArrowRight, Coffee, UtensilsCrossed } from 'lucide-react';
import { openingHours, photoSlot } from '@/data/business';
import { Button } from '@/components/ui/Button';
import { PhotoSlot } from '@/components/ui/PhotoSlot';
import { SectionHead } from '@/components/ui/SectionHead';
import { HoursList } from './HoursList';
import styles from './CafePreview.module.css';

const cafePhoto = photoSlot('cafeteria-interior');
const dishPhoto = photoSlot('plato-cocina');

export function CafePreview() {
  return (
    <section className="section" aria-labelledby="cafeteria-preview">
      <div className="container">
        <SectionHead
          id="cafeteria-preview"
          eyebrow="La cafetería"
          title="Comer bien, sin salir del hotel"
          lead="La soda funciona con el mismo local y el mismo equipo que el hotel. Desayuno, almuerzo y café de la zona, con ingredientes de primera calidad y precios que no sorprenden."
          action={
            <Button
              href="/cafeteria"
              variant="outline"
              icon={<ArrowRight size={16} strokeWidth={2} aria-hidden="true" />}
            >
              Ir a la cafetería
            </Button>
          }
        />

        <div className={styles.layout}>
          <div className={styles.media}>
            <PhotoSlot
              photo={cafePhoto}
              kind="cafe"
              ratio="wide"
              className={styles.mainPhoto}
              sizes="(max-width: 900px) 100vw, 52vw"
            />
            <PhotoSlot
              photo={dishPhoto}
              kind="dish"
              ratio="square"
              className={styles.sidePhoto}
              sizes="(max-width: 900px) 45vw, 22vw"
            />
          </div>

          <div className={styles.content}>
            <div className={styles.pill}>
              <Coffee size={15} strokeWidth={1.8} aria-hidden="true" />
              <span>Cocina costarricense</span>
            </div>

            <p className={styles.text}>
              En Don Roberto la comida no es un extra del hospedaje: es la otra mitad del negocio.
              Los huéspedes desayunan acá, los locales de la zona almuerzan acá y la soda atiende
              con el mismo trato cercano, de la propiedad.
            </p>

            <div className={styles.hours}>
              <h3 className={styles.hoursTitle}>
                <UtensilsCrossed size={17} strokeWidth={1.7} aria-hidden="true" />
                {openingHours.title}
              </h3>
              <HoursList hours={openingHours} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
