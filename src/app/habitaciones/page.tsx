import type { Metadata } from 'next';
import { Bath, BedDouble, Tv, Wifi } from 'lucide-react';
import { StayInquiryForm } from '@/components/booking/StayInquiryForm';
import { CtaBand } from '@/components/sections/CtaBand';
import { FaqSection } from '@/components/sections/FaqSection';
import { PageHero } from '@/components/sections/PageHero';
import { RoomCard } from '@/components/sections/RoomCard';
import { photoSlot } from '@/data/business';
import { demoRooms } from '@/data/rooms.demo';
import { rooms } from '@/data/rooms';
import { site } from '@/data/site';
import { buildOpenGraph, buildTwitter } from '@/lib/seo';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Habitaciones',
  description:
    'Doce habitaciones con baño privado en Don Roberto, hotel y cafetería en San Isidro de El General, Pérez Zeledón. Consultá disponibilidad y tarifas por WhatsApp.',
  alternates: site.url ? { canonical: '/habitaciones' } : undefined,
  openGraph: buildOpenGraph({
    title: 'Habitaciones | Don Roberto',
    description:
      'Doce habitaciones con baño privado, Wi-Fi sin costo y estacionamiento, en el centro de San Isidro de El General.',
    path: '/habitaciones',
  }),
  twitter: buildTwitter({
    title: 'Habitaciones | Don Roberto',
    description:
      'Doce habitaciones con baño privado, Wi-Fi sin costo y estacionamiento, en el centro de San Isidro de El General.',
  }),
};

const facts = [
  { icon: BedDouble, label: '12 habitaciones' },
  { icon: Bath, label: 'Baño privado' },
  { icon: Wifi, label: 'Wi-Fi sin costo' },
  { icon: Tv, label: 'TV por cable' },
];

export default function HabitacionesPage() {
  const published = rooms.length > 0;
  const visibleRooms = published ? rooms : site.showDemoContent ? demoRooms : [];
  const showingDemo = !published && visibleRooms.length > 0;

  return (
    <>
      <PageHero
        eyebrow="Hospedaje"
        title="Doce habitaciones en el centro de San Isidro"
        lead="Un hotel familiar de doce habitaciones, administrado por sus propietarios. Todos los huéspedes desayunan y cenan en la misma cocina, a metros de su puerta."
      >
        <ul className={styles.heroFacts}>
          {facts.map((fact) => {
            const Icon = fact.icon;
            return (
              <li key={fact.label} className={styles.heroFact}>
                <Icon size={16} strokeWidth={1.7} aria-hidden="true" />
                {fact.label}
              </li>
            );
          })}
        </ul>
      </PageHero>

      <section className="section" aria-labelledby="tipos-title">
        <div className="container">
          <div className={styles.intro}>
            <div>
              <p className="eyebrow">Tipos de habitación</p>
              <h2 className={styles.introTitle} id="tipos-title">
                {published
                  ? 'Elegí la que necesitás'
                  : showingDemo
                    ? 'Así se verá el detalle de cada habitación'
                    : 'Estamos preparando el detalle de cada habitación'}
              </h2>
            </div>
            <p className={styles.introText}>
              {published
                ? 'Cada tipo de habitación tiene su propia ficha con fotos, capacidad y tarifa. Consultá la disponibilidad con tus fechas: el equipo te confirma lo que haya libre ese día.'
                : showingDemo
                  ? 'Esta es una vista de ejemplo del diseño. Los nombres, capacidades, camas y tarifas reales se cargan cuando el negocio los confirme: hasta entonces, escribinos y te enviamos las fotos y los precios de verdad.'
                  : 'No queríamos mostrar precios ni características a medias. Estamos levantando la ficha de cada tipo de habitación con fotos reales y las tarifas vigentes. Mientras tanto, escribinos con tus fechas y te enviamos las opciones disponibles con sus precios.'}
            </p>
          </div>

          {visibleRooms.length > 0 ? (
            <div className={styles.rooms}>
              {visibleRooms.map((room, index) => (
                <RoomCard key={room.slug} room={room} reversed={index % 2 === 1} />
              ))}
            </div>
          ) : (
            <div className={styles.pending}>
              <div className={styles.pendingMedia}>
                <div className={styles.pendingFrame}>
                  <span className={styles.pendingLabel}>Espacio reservado</span>
                  <span className={styles.pendingAlt}>
                    {photoSlot('habitacion-principal').alt}
                  </span>
                </div>
              </div>
              <div className={styles.pendingBody}>
                <h3 className={styles.pendingTitle}>Lo que sí está confirmado</h3>
                <ul className={styles.pendingList}>
                  <li>Doce habitaciones en total.</li>
                  <li>Baño privado en cada habitación.</li>
                  <li>Wi-Fi sin costo y estacionamiento para huéspedes.</li>
                  <li>TV por cable.</li>
                  <li>Un proyecto familiar que atiende directamente sus propietarios.</li>
                </ul>
                <p className={styles.pendingNote}>
                  El aire acondicionado y el resto de amenidades dependen de la habitación
                  asignada, así que te lo confirmamos con detalle en la respuesta.
                </p>
                <a className="btn btn--terracotta" href="#consulta">
                  Consultar disponibilidad
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      <StayInquiryForm id="consulta" />

      <FaqSection
        eyebrow="Sobre el hospedaje"
        title="Lo que suelen preguntarnos"
        limit={5}
        showAllLink
      />

      <CtaBand
        title="¿Te quedan dudas sobre las habitaciones?"
        text="Si prefieres escuchar la respuesta, llámanos. Si prefieres escribir, te contestamos por WhatsApp en el momento."
        href="/contacto"
        ctaLabel="Ver opciones de contacto"
      />
    </>
  );
}
