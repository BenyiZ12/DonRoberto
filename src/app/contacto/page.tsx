import type { Metadata } from 'next';
import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { StayInquiryForm } from '@/components/booking/StayInquiryForm';
import { CtaBand } from '@/components/sections/CtaBand';
import { FaqSection } from '@/components/sections/FaqSection';
import { HoursList } from '@/components/sections/HoursList';
import { PageHero } from '@/components/sections/PageHero';
import { SectionHead } from '@/components/ui/SectionHead';
import { address, contact, openingHours } from '@/data/business';
import { site } from '@/data/site';
import { whatsappUrl } from '@/lib/whatsapp';
import { buildOpenGraph, buildTwitter } from '@/lib/seo';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Contacto',
  description:
    'Contactá a Don Roberto - Hotel y Cafetería: WhatsApp y teléfono +506 2772-3348, correo donrobertopz@gmail.com y dirección en San Isidro de El General, Pérez Zeledón.',
  alternates: site.url ? { canonical: '/contacto' } : undefined,
  openGraph: buildOpenGraph({
    title: 'Contacto | Don Roberto',
    description: 'Escríbenos por WhatsApp o llámanos. San Isidro de El General, Pérez Zeledón.',
    path: '/contacto',
  }),
  twitter: buildTwitter({
    title: 'Contacto | Don Roberto',
    description: 'Escríbenos por WhatsApp o llámanos. San Isidro de El General, Pérez Zeledón.',
  }),
};

export default function ContactoPage() {
  return (
    <>
      <PageHero
        eyebrow="Contacto"
        title="Escríbenos o llámanos"
        lead="Atendemos desde el local, con el mismo equipo que lleva el hotel y la cafetería. Contestamos rápido y en español, sin intermediarios."
      />

      <section className="section" aria-labelledby="canales-title">
        <div className="container">
          <SectionHead
            id="canales-title"
            eyebrow="Canales"
            title="Como prefieras"
            lead="Para reservar, lo más rápido es WhatsApp: te queda el historial de la conversación. Para cualquier otra cosa, el teléfono o el correo."
          />

          <div className={styles.channels}>
            <div className={styles.channel}>
              <span className={styles.channelIcon} aria-hidden="true">
                <MessageCircle size={20} strokeWidth={1.7} />
              </span>
              <h3 className={styles.channelTitle}>WhatsApp</h3>
              <p className={styles.channelText}>
                Escribinos y te contestamos con disponibilidad y tarifas. Es el canal más rápido
                para reservar.
              </p>
              <a
                className="btn btn--terracotta btn--sm"
                href={whatsappUrl('Hola, Don Roberto. Quisiera hacer una consulta.')}
                target="_blank"
                rel="noopener noreferrer"
              >
                Abrir WhatsApp
              </a>
            </div>

            <div className={styles.channel}>
              <span className={styles.channelIcon} aria-hidden="true">
                <Phone size={20} strokeWidth={1.7} />
              </span>
              <h3 className={styles.channelTitle}>Teléfono</h3>
              <p className={styles.channelText}>
                Atendemos el teléfono durante el horario de la cafetería. Si no contestamos,
                dejá un mensaje por WhatsApp.
              </p>
              <a className="btn btn--outline btn--sm" href={`tel:${contact.phoneE164}`}>
                {contact.phoneDisplay}
              </a>
            </div>

            <div className={styles.channel}>
              <span className={styles.channelIcon} aria-hidden="true">
                <Mail size={20} strokeWidth={1.7} />
              </span>
              <h3 className={styles.channelTitle}>Correo</h3>
              <p className={styles.channelText}>
                Para consultas que no son urgentes: grupos, facturación o información para
                terceros o para documentación del hotel.
              </p>
              <a className="btn btn--outline btn--sm" href={`mailto:${contact.email}`}>
                {contact.email}
              </a>
            </div>
          </div>
        </div>
      </section>

      <StayInquiryForm
        id="consulta"
        title="Consultar disponibilidad"
        description="Si lo que querés es reservar, completá estos datos: preparamos el mensaje de WhatsApp con tu consulta y solo tenés que enviarlo."
      />

      <section className="section section--cream" aria-labelledby="datos-title">
        <div className="container">
          <div className={styles.dataLayout}>
            <div>
              <SectionHead
                id="datos-title"
                eyebrow="Datos"
                title="Información del negocio"
                lead="Estos son los datos verificados de Don Roberto. Si necesitás algo más, escríbenos."
              />
              <dl className={styles.definitions}>
                <div className={styles.definition}>
                  <dt className={styles.definitionLabel}>
                    <MapPin size={16} strokeWidth={1.7} aria-hidden="true" />
                    Dirección
                  </dt>
                  <dd className={styles.definitionValue}>
                    {address.streetLine}, {address.landmark}
                    <br />
                    {address.city}, {address.region}, {address.province}, {address.country}
                  </dd>
                </div>
                <div className={styles.definition}>
                  <dt className={styles.definitionLabel}>
                    <Phone size={16} strokeWidth={1.7} aria-hidden="true" />
                    Teléfono
                  </dt>
                  <dd className={styles.definitionValue}>
                    <a href={`tel:${contact.phoneE164}`}>{contact.phoneDisplay}</a>
                  </dd>
                </div>
                <div className={styles.definition}>
                  <dt className={styles.definitionLabel}>
                    <Mail size={16} strokeWidth={1.7} aria-hidden="true" />
                    Correo
                  </dt>
                  <dd className={styles.definitionValue}>
                    <a href={`mailto:${contact.email}`}>{contact.email}</a>
                  </dd>
                </div>
                <div className={styles.definition}>
                  <dt className={styles.definitionLabel}>
                    <Clock size={16} strokeWidth={1.7} aria-hidden="true" />
                    Cafetería
                  </dt>
                  <dd className={styles.definitionValue}>
                    <HoursList hours={openingHours} />
                  </dd>
                </div>
              </dl>
            </div>

            <div className={styles.aside}>
              <div className={styles.asideCard}>
                <h3 className={styles.asideTitle}>Sobre este sitio</h3>
                <p className={styles.asideText}>
                  El sitio no procesa reservas, pagos ni datos personales. El formulario prepara un
                  mensaje de WhatsApp y lo abrís vos: la disponibilidad y las tarifas siempre las
                  confirma el equipo de Don Roberto.
                </p>
                <p className={styles.asideText}>
                  Si encontrás un dato desactualizado, escríbenos y lo corregimos. Nos ayuda a
                  mantener la información al día para la gente del cantón.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FaqSection
        eyebrow="Antes de escribir"
        title="Preguntas frecuentes"
        limit={6}
        showAllLink
      />

      <CtaBand
        title="¿Nos vemos pronto?"
        text="Contanos las fechas y cuántos son, y te confirmamos lo que haya disponible. También podés llamarnos si lo preferís."
        href="/habitaciones#consulta"
        ctaLabel="Consultar habitación"
      />
    </>
  );
}
