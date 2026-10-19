import { address, business, openingHours, services } from '@/data/business';
import { faqs } from '@/data/faq';
import { site } from '@/data/site';

/**
 * ============================================================================
 *  DATOS ESTRUCTURADOS (JSON-LD / Schema.org)
 * ============================================================================
 *
 *  Reglas aplicadas:
 *  - Solo se publica lo verificado.
 *  - NO se incluyen `aggregateRating`, `review`, `starRating` ni precios
 *    inventados. Tampoco se marca nada como "opinión favorable".
 *  - Se generan DOS entidades, porque son dos negocios distintos en el mismo
 *    local: el hotel y la cafetería. Eso ayuda a que Google entienda que el
 *    establecimiento sirve tanto hospedaje como alimentación.
 *  - Las coordenadas se marcan como aproximadas (`GeoCoordinates` con la
 *    precisión declarada en `description`).
 * ============================================================================
 */

/** Rango de precios: se omite porque no hay tarifas confirmadas. */
const postalAddress = {
  '@type': 'PostalAddress',
  streetAddress: address.line1,
  addressLocality: address.city,
  addressRegion: address.region,
  addressPostalCode: address.postalCode,
  addressCountry: address.countryCode,
} as const;

const geo = {
  '@type': 'GeoCoordinates',
  latitude: address.coordinates.lat,
  longitude: address.coordinates.lng,
  // Google's guidelines: usar "approximate" cuando la ubicación no es exacta.
  description: 'Ubicación aproximada del establecimiento.',
} as const;

const contactPoint = {
  '@type': 'ContactPoint',
  telephone: business.phoneE164,
  contactType: 'reception',
  areaServed: 'CR',
  availableLanguage: ['es'],
} as const;

/** Entidad principal: el hotel. */
export function hotelSchema() {
  const amenityFeatures = services
    .filter((service) => service.status === 'confirmed')
    .map((service) => ({
      '@type': 'LocationFeatureSpecification',
      name: service.title,
      value: true,
    }));

  return {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    '@id': site.url ? `${site.url}/#hotel` : undefined,
    name: business.fullName,
    description: business.summary,
    url: site.url || undefined,
    telephone: business.phoneE164,
    email: business.email,
    address: postalAddress,
    geo,
    image: site.url ? [`${site.url}/og-image.png`] : undefined,
    logo: site.url ? `${site.url}/icon.svg` : undefined,
    numberOfRooms: 12,
    currenciesAccepted: 'CRC',
    amenityFeature: amenityFeatures.length > 0 ? amenityFeatures : undefined,
    contactPoint,
    sameAs: ['https://www.facebook.com/DonRobertoPZ'],
    // Sin `aggregateRating`, `review` ni `priceRange`: no hay datos
    // confirmados que permitan publicarlos sin inventar.
  };
}

/** Entidad secundaria: la cafetería / restaurante. */
export function cafeSchema() {
  const openingHoursSpecification = openingHours.days
    .filter((day) => day.status === 'confirmed' && day.value)
    .map((day) => {
      if (day.label === 'Lunes a viernes') {
        return {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '06:00',
          closes: '20:30',
        };
      }
      if (day.label === 'Sábado') {
        return {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: 'Saturday',
          opens: '06:30',
          closes: '10:00',
        };
      }
      return null;
    })
    .filter((item) => item !== null);

  return {
    '@context': 'https://schema.org',
    '@type': 'CafeOrCoffeeShop',
    '@id': site.url ? `${site.url}/#cafeteria` : undefined,
    name: `${business.name} - Cafetería`,
    description:
      'Cafetería y restaurante en San Isidro de El General, Pérez Zeledón. Cocina costarricense y café de la zona, con servicio para llevar.',
    url: site.url ? `${site.url}/cafeteria` : undefined,
    telephone: business.phoneE164,
    email: business.email,
    address: postalAddress,
    geo,
    servesCuisine: ['Costa Rican'],
    openingHoursSpecification: openingHoursSpecification.length > 0 ? openingHoursSpecification : undefined,
    contactPoint,
    sameAs: ['https://www.facebook.com/DonRobertoPZ'],
    // Sin `aggregateRating` ni `review`: no se inventan valoraciones.
  };
}

/** Sitio web con su buscador interno (opcional pero recomendado). */
export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': site.url ? `${site.url}/#website` : undefined,
    name: business.fullName,
    url: site.url || undefined,
    inLanguage: 'es-CR',
    publisher: {
      '@type': 'Organization',
      name: business.fullName,
      '@id': site.url ? `${site.url}/#organization` : undefined,
    },
  };
}

/** Preguntas frecuentes de la página dedicada. */
export function faqSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
