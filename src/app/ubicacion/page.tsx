import type { Metadata } from 'next';
import { Clock, Mail, MapPin, MessageCircle, Navigation, Phone } from 'lucide-react';
import { CtaBand } from '@/components/sections/CtaBand';
import { HoursList } from '@/components/sections/HoursList';
import { MapPanel } from '@/components/sections/MapPanel';
import { PageHero } from '@/components/sections/PageHero';
import { SectionHead } from '@/components/ui/SectionHead';
import { TrackLink } from '@/components/ui/TrackLink';
import { address, contact, hotelHours, openingHours } from '@/data/business';
import { site } from '@/data/site';
import { whatsappUrl } from '@/lib/whatsapp';
import { buildOpenGraph, buildTwitter } from '@/lib/seo';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Ubicación y cómo llegar',
  description:
    'Don Roberto - Hotel y Cafetería: Barrio La Cooperativa, San Isidro de El General, Pérez Zeledón. 150 metros al sur de la Escuela Rafael Ángel Calderón Guardia. Teléfono +506 2772-3348.',
  alternates: site.url ? { canonical: '/ubicacion' } : undefined,
  openGraph: buildOpenGraph({
    title: 'Ubicación | Don Roberto',
    description:
      'En el centro de San Isidro de El General, Pérez Zeledón, a 150 metros al sur de la Escuela Rafael Ángel Calderón Guardia.',
    path: '/ubicacion',
  }),
  twitter: buildTwitter({
    title: 'Ubicación | Don Roberto',
    description:
      'En el centro de San Isidro de El General, Pérez Zeledón, a 150 metros al sur de la Escuela Rafael Ángel Calderón Guardia.',
  }),
};

const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  address.mapsSearchQuery,
)}`;

export default function UbicacionPage() {
  return (
    <>
      <PageHero
        eyebrow="Dónde estamos"
        title="En el centro de San Isidro de El General"
        lead="Barrio La Cooperativa, a 150 metros al sur de la Escuela Rafael Ángel Calderón Guardia. A unos pasos de la plaza, con comercios, transporte y parqueo en el mismo sector."
      />

      <section className="section" aria-labelledby="mapa-title">
        <div className="container">
          <SectionHead
            id="mapa-title"
            eyebrow="Mapa"
            title="Llegar es sencillo"
            lead="El local queda a pocas cuadras de la plaza de San Isidro, sobre una calle céntrica con parqueo disponible en el frente."
          />

          <div className={styles.mapLayout}>
            <MapPanel />

            <div className={styles.data}>
              <div className={styles.block}>
                <h2 className={styles.blockTitle}>
                  <MapPin size={17} strokeWidth={1.7} aria-hidden="true" />
                  Dirección
                </h2>
                <address className={styles.address}>
                  {address.streetLine}
                  <br />
                  {address.landmark}
                  <br />
                  {address.city}, {address.region}
                  <br />
                  {address.province}, {address.country}
                </address>
                <TrackLink
                  className="btn btn--outline btn--sm"
                  href={mapsUrl}
                  external
                  event="clic_mapa"
                  params={{ ubicacion: 'pagina_ubicacion' }}
                >
                  <Navigation size={15} strokeWidth={2} aria-hidden="true" />
                  <span>Abrir en Google Maps</span>
                </TrackLink>
              </div>

              <div className={styles.block}>
                <h2 className={styles.blockTitle}>
                  <Phone size={17} strokeWidth={1.7} aria-hidden="true" />
                  Teléfono
                </h2>
                <p className={styles.phone}>
                  <a href={`tel:${contact.phoneE164}`}>{contact.phoneDisplay}</a>
                </p>
                <p className={styles.blockNote}>
                  También podés escribir por WhatsApp al mismo número.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--cream" aria-labelledby="indicaciones-title">
        <div className="container">
          <div className={styles.infoLayout}>
            <div>
              <SectionHead
                id="indicaciones-title"
                eyebrow="Cómo llegar"
                title="Indicaciones"
                lead="Zona céntrica y de fácil acceso, tanto si llegás en vehículo como si venís en transporte público."
              />
              <ul className={styles.directions}>
                {address.directions.map((direction) => (
                  <li key={direction} className={styles.direction}>
                    {direction}
                  </li>
                ))}
              </ul>
              <p className={styles.coords}>
                Coordenadas aproximadas del establecimiento: {address.coordinates.lat},{' '}
                {address.coordinates.lng}. Para llegar, usá el botón de Google Maps: apunta al
                negocio verificado.
              </p>
            </div>

            <div className={styles.hoursColumn}>
              <div className={styles.hoursCard}>
                <h3 className={styles.hoursTitle}>
                  <Clock size={17} strokeWidth={1.7} aria-hidden="true" />
                  {openingHours.title}
                </h3>
                <HoursList hours={openingHours} />
                <p className={styles.hoursNote}>{openingHours.description}</p>
              </div>

              <div className={styles.hoursCard}>
                <h3 className={styles.hoursTitle}>
                  <Clock size={17} strokeWidth={1.7} aria-hidden="true" />
                  {hotelHours.title}
                </h3>
                <HoursList hours={hotelHours} />
                <p className={styles.hoursNote}>{hotelHours.description}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="contacto-directo-title">
        <div className="container">
          <SectionHead
            id="contacto-directo-title"
            eyebrow="Contacto directo"
            title="Elegí cómo te prefers que te atendamos"
            lead="Atendemos por WhatsApp y por teléfono. Si querés pasar por el local, aquí están el dirección y el horario de la cafetería."
          />
          <div className={styles.channels}>
            <a
              className={styles.channel}
              href={whatsappUrl('Hola, Don Roberto. Quisiera hacer una consulta.')}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className={styles.channelIcon} aria-hidden="true">
                <MessageCircle size={20} strokeWidth={1.7} />
              </span>
              <span className={styles.channelBody}>
                <span className={styles.channelTitle}>WhatsApp</span>
                <span className={styles.channelText}>
                  Te respondemos en el momento. Es la vía más rápida para reservar.
                </span>
              </span>
            </a>

            <a className={styles.channel} href={`tel:${contact.phoneE164}`}>
              <span className={styles.channelIcon} aria-hidden="true">
                <Phone size={20} strokeWidth={1.7} />
              </span>
              <span className={styles.channelBody}>
                <span className={styles.channelTitle}>{contact.phoneDisplay}</span>
                <span className={styles.channelText}>
                  Llamanos y te atendemos una persona del equipo.
                </span>
              </span>
            </a>

            <a className={styles.channel} href={`mailto:${contact.email}`}>
              <span className={styles.channelIcon} aria-hidden="true">
                <Mail size={20} strokeWidth={1.7} />
              </span>
              <span className={styles.channelBody}>
                <span className={styles.channelTitle}>{contact.email}</span>
                <span className={styles.channelText}>
                  Para consultas que no son urgentes, grupos o facturación.
                </span>
              </span>
            </a>
          </div>
        </div>
      </section>

      <CtaBand
        title="¿Ya sabés las fechas?"
        text="Pasá tus datos de estadía y abrimos WhatsApp con la consulta lista para enviar."
        href="/habitaciones#consulta"
        ctaLabel="Consultar disponibilidad"
      />
    </>
  );
}
