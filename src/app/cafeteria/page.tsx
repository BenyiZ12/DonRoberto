import type { Metadata } from 'next';
import { Coffee, MessageCircle, ShoppingBag } from 'lucide-react';
import { ContactActions } from '@/components/sections/ContactActions';
import { CtaBand } from '@/components/sections/CtaBand';
import { HoursList } from '@/components/sections/HoursList';
import { MapPanel } from '@/components/sections/MapPanel';
import { MenuList } from '@/components/sections/MenuList';
import { PageHero } from '@/components/sections/PageHero';
import { PhotoSlot } from '@/components/ui/PhotoSlot';
import { SectionHead } from '@/components/ui/SectionHead';
import { openingHours, photoSlot } from '@/data/business';
import { demoMenuCategories } from '@/data/menu.demo';
import { menuCategories, menuPublished } from '@/data/menu';
import { site } from '@/data/site';
import { buildMenuMessage, whatsappUrl } from '@/lib/whatsapp';
import { buildOpenGraph, buildTwitter } from '@/lib/seo';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Cafetería y menú',
  description:
    'La cafetería de Don Roberto en San Isidro de El General: cocina costarricense, café de la zona y servicio para llevar. Consulta el menú vigente y los horarios de atención.',
  alternates: site.url ? { canonical: '/cafeteria' } : undefined,
  openGraph: buildOpenGraph({
    title: 'Cafetería | Don Roberto',
    description:
      'Cocina costarricense y café de la zona en el mismo local que el hotel, en San Isidro de El General.',
    path: '/cafeteria',
  }),
  twitter: buildTwitter({
    title: 'Cafetería | Don Roberto',
    description:
      'Cocina costarricense y café de la zona en el mismo local que el hotel, en San Isidro de El General.',
  }),
};

export default function CafeteriaPage() {
  const visibleCategories = menuPublished
    ? menuCategories
    : site.showDemoContent
      ? demoMenuCategories
      : [];
  const showingDemo = !menuPublished && visibleCategories.length > 0;

  return (
    <>
      <PageHero
        eyebrow="La cafetería"
        title="La otra mitad del negocio"
        lead="No es un servicio extra del hotel: es una soda que funciona con su propio ritmo. Desayuno costarricense, café de la zona y comida hecha con ingredientes de primera calidad, con precios que no sorprenden."
      />

      <section className="section" aria-labelledby="galeria-cafe">
        <div className="container">
          <SectionHead
            id="galeria-cafe"
            eyebrow="El local"
            title="Una soda con carácter"
            lead="Ambiente tranquilo, servicio cercano y una cocina que se prepara en el momento. Ahí desayunan los huéspedes del hotel, y ahí almuerzan también los vecinos de San Isidro."
          />

          <div className={styles.gallery}>
            <PhotoSlot
              photo={photoSlot('cafeteria-interior')}
              kind="cafe"
              ratio="wide"
              className={styles.mainPhoto}
              priority
              sizes="(max-width: 900px) 100vw, 62vw"
            />
            <div className={styles.sideColumn}>
              <PhotoSlot
                photo={photoSlot('plato-cocina')}
                kind="dish"
                ratio="square"
                className={styles.sidePhoto}
                sizes="(max-width: 900px) 45vw, 26vw"
              />
              <div className={styles.callout}>
                <Coffee size={19} strokeWidth={1.6} aria-hidden="true" />
                <p className={styles.calloutTitle}>Café de la zona</p>
                <p className={styles.calloutText}>
                  En Don Roberto se recomienda el café de San Isidro, preparado en el momento y con
                  la misma maña de siempre.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--cream" aria-labelledby="menu-title">
        <div className="container">
          <SectionHead
            id="menu-title"
            eyebrow="La carta"
            title={menuPublished ? 'Menú' : showingDemo ? 'Menú (vista de ejemplo)' : 'El menú vigente'}
            lead={
              menuPublished
                ? 'Los precios pueden variar según el día. Si tenés alguna restricción o alergia, decínoslo al pedir.'
                : showingDemo
                  ? 'Así se verá la carta una vez que el negocio la cargue. Los platos y precios de abajo son marcadores de posición, no productos reales.'
                  : 'La carta cambia según el día y lo que hay en el mercado, así que preferimos no publicar precios que pueden quedar desactualizados. Te la enviamos al instante.'
            }
          />

          {visibleCategories.length > 0 ? (
            <MenuList categories={visibleCategories} />
          ) : (
            <div className={styles.menuPending}>
              <div className={styles.menuPendingText}>
                <h3 className={styles.menuPendingTitle}>
                  Consultá el menú y los precios del día
                </h3>
                <p className={styles.menuPendingBody}>
                  Escribinos por WhatsApp y te mandamos la carta vigente con sus precios. También
                  podés pasar por el local durante el horario de atención: el menú está en la pizarra
                  y el equipo te atiende.
                </p>
                <ul className={styles.menuPendingList}>
                  <li>
                    <ShoppingBag size={16} strokeWidth={1.7} aria-hidden="true" />
                    Pedidos para llevar
                  </li>
                  <li>
                    <Coffee size={16} strokeWidth={1.7} aria-hidden="true" />
                    Café de la zona, preparado al momento
                  </li>
                </ul>
                <div className={styles.menuPendingActions}>
                  <a
                    className="btn btn--terracotta"
                    href={whatsappUrl(buildMenuMessage())}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle size={17} strokeWidth={2} aria-hidden="true" />
                    <span>Pedir el menú por WhatsApp</span>
                  </a>
                  <a className="btn btn--outline" href="#horarios">
                    Ver horarios
                  </a>
                </div>
              </div>
              <div className={styles.menuPendingAside}>
                <div className={styles.hoursCard}>
                  <h4 className={styles.hoursCardTitle}>{openingHours.title}</h4>
                  <HoursList hours={openingHours} />
                  <p className={styles.hoursNote}>
                    El horario de la cafetería es el único publicado. El de recepción del hotel se
                    confirma al reservar.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="section" id="horarios" aria-labelledby="horarios-title">
        <div className="container">
          <div className={styles.hoursLayout}>
            <div>
              <SectionHead
                id="horarios-title"
                eyebrow="Horarios y ubicación"
                title="Cuándo y dónde"
                lead="La cafetería atiende con el horario publicado abajo. El local está en el centro de San Isidro, con parqueo para quienes llegan en vehículo."
              />
              <ContactActions
                message={buildMenuMessage()}
                className={styles.hoursActions}
              />
            </div>
            <MapPanel />
          </div>
        </div>
      </section>

      <CtaBand
        title="¿Vienes a comer o a dormir?"
        text="Las dos cosas caben en la misma visita. Escribinos y te confirmamos mesa, horario o habitación, según lo que necesites."
        href="/contacto"
        ctaLabel="Elegir entre cafetería y hotel"
      />
    </>
  );
}
