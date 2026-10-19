import type { Metadata } from 'next';
import { Accordion } from '@/components/ui/Accordion';
import { CtaBand } from '@/components/sections/CtaBand';
import { PageHero } from '@/components/sections/PageHero';
import { SectionHead } from '@/components/ui/SectionHead';
import { JsonLd } from '@/components/seo/JsonLd';
import { faqs } from '@/data/faq';
import { site } from '@/data/site';
import { faqSchema } from '@/lib/schema';
import { buildOpenGraph, buildTwitter } from '@/lib/seo';
import { whatsappUrl } from '@/lib/whatsapp';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Preguntas frecuentes',
  description:
    'Cómo consultar disponibilidad, qué incluye una habitación, cómo ver los precios, dónde está Don Roberto y cuáles son los horarios de la cafetería en Pérez Zeledón.',
  alternates: site.url ? { canonical: '/preguntas-frecuentes' } : undefined,
  openGraph: buildOpenGraph({
    title: 'Preguntas frecuentes | Don Roberto',
    description:
      'Todo lo que suelen preguntarnos sobre el hotel y la cafetería de Don Roberto en San Isidro de El General.',
    path: '/preguntas-frecuentes',
  }),
  twitter: buildTwitter({
    title: 'Preguntas frecuentes | Don Roberto',
    description:
      'Todo lo que suelen preguntarnos sobre el hotel y la cafetería de Don Roberto en San Isidro de El General.',
  }),
};

export default function PreguntasFrecuentesPage() {
  return (
    <>
      <PageHero
        eyebrow="Preguntas frecuentes"
        title="Lo que nos preguntan siempre"
        lead="Reunimos aquí las dudas más habituales sobre el hotel y la cafetería. Si tu pregunta no está, escríbenos y te la respondemos."
      />

      <section className="section" aria-labelledby="lista-faq">
        <div className="container">
          <div className={styles.layout}>
            <div>
              <SectionHead
                id="lista-faq"
                eyebrow="Consultas frecuentes"
                title="Respuestas"
                lead="Solo-publicamos lo que está confirmado. Cuando algo todavía no lo sabemos, te decimos cómo consultarlo."
              />
              <Accordion items={faqs} defaultOpenFirst />
            </div>

            <aside className={styles.aside}>
              <div className={styles.asideCard}>
                <h2 className={styles.asideTitle}>¿No está tu pregunta?</h2>
                <p className={styles.asideText}>
                  Escríbenos por WhatsApp o llamanos. Si es sobre una habitación, indicá tus
                  fechas de entrada y salida para poder responderte con las opciones y las tarifas
                  reales.
                </p>
                <a
                  className="btn btn--terracotta btn--sm"
                  href={whatsappUrl(
                    'Hola, Don Roberto. Me quedó una duda que no vi en las preguntas frecuentes. ¿Me pueden ayudar?',
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Escribir por WhatsApp
                </a>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <CtaBand
        title="Todo listo, entonces"
        text="Pasá tus fechas y te confirmamos disponibilidad y tarifas en el momento."
        href="/habitaciones#consulta"
        ctaLabel="Consultar disponibilidad"
      />

      <JsonLd data={faqSchema()} />
    </>
  );
}
