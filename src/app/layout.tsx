import type { Metadata, Viewport } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat';
import { JsonLd } from '@/components/seo/JsonLd';
import { business } from '@/data/business';
import { site } from '@/data/site';
import { cafeSchema, hotelSchema, websiteSchema } from '@/lib/schema';
import { buildOpenGraph, buildTwitter } from '@/lib/seo';
import './globals.css';

const displayFont = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  weight: ['400', '500', '600', '700'],
});

const bodyFont = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFDF8' },
    { media: '(prefers-color-scheme: dark)', color: '#243D32' },
  ],
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: site.url ? new URL(site.url) : undefined,
  title: {
    default: site.defaultTitle,
    template: site.titleTemplate,
  },
  description: site.defaultDescription,
  applicationName: business.fullName,
  authors: [{ name: business.fullName }],
  creator: business.fullName,
  publisher: business.fullName,
  category: 'hotel',
  keywords: [
    'hotel en Pérez Zeledón',
    'hospedaje en San Isidro de El General',
    'hotel en San Isidro de Pérez Zeledón',
    'cafetería en Pérez Zeledón',
    'restaurante en San Isidro de El General',
    'Don Roberto Hotel y Cafetería',
  ],
  alternates: site.url ? { canonical: '/' } : undefined,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: buildOpenGraph({
    title: site.defaultTitle,
    description: site.defaultDescription,
    path: '/',
  }),
  twitter: buildTwitter({
    title: site.defaultTitle,
    description: site.defaultDescription,
  }),
  formatDetection: { telephone: true, address: true, email: true },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es-CR" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body>
        <a className="skip-link" href="#contenido">
          Saltar al contenido principal
        </a>
        <Header />
        <main id="contenido">{children}</main>
        <Footer />
        <WhatsAppFloat />

        <JsonLd data={[hotelSchema(), cafeSchema(), websiteSchema()]} />
      </body>
    </html>
  );
}
