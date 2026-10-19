import type { Metadata } from 'next';
import { CafePreview } from '@/components/sections/CafePreview';
import { CtaBand } from '@/components/sections/CtaBand';
import { FaqSection } from '@/components/sections/FaqSection';
import { Hero } from '@/components/sections/Hero';
import { LocationPreview } from '@/components/sections/LocationPreview';
import { RoomsPreview } from '@/components/sections/RoomsPreview';
import { ServicesGrid } from '@/components/sections/ServicesGrid';
import { business } from '@/data/business';
import { site } from '@/data/site';
import { buildOpenGraph, buildTwitter } from '@/lib/seo';

export const metadata: Metadata = {
  title: {
    absolute: `${business.fullName} en Pérez Zeledón`,
  },
  description:
    'Hotel y cafetería en San Isidro de El General, Pérez Zeledón. Doce habitaciones con baño privado, Wi-Fi y parqueo, y una cafetería con cocina costarricense. Consultá disponibilidad por WhatsApp.',
  alternates: site.url ? { canonical: '/' } : undefined,
  openGraph: buildOpenGraph({
    title: `${business.fullName} en Pérez Zeledón`,
    description:
      'Doce habitaciones con baño privado y una cafetería con cocina costarricense, en el centro de San Isidro de El General.',
    path: '/',
  }),
  twitter: buildTwitter({
    title: `${business.fullName} en Pérez Zeledón`,
    description:
      'Doce habitaciones con baño privado y una cafetería con cocina costarricense, en el centro de San Isidro de El General.',
  }),
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesGrid />
      <RoomsPreview />
      <CafePreview />
      <LocationPreview />
      <FaqSection limit={6} />
      <CtaBand />
    </>
  );
}
