// lib/seo.js
// Constantes centralisées SEO/AEO/GEO — évite de dupliquer les mêmes infos
// (NAP, coordonnées GPS, tarifs) dans layout.tsx, sitemap.ts, robots.ts et
// les schemas JSON-LD de chaque page. Si l'adresse, le téléphone ou les
// tarifs changent, tout se met à jour depuis ce seul fichier.

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://chez-florence.vercel.app').replace(/\/$/, '')

export const SITE_NAME = 'CHEZ FLORENCE'

export const SITE_DESCRIPTION =
  "Élevage et vente de lapins de race (Hollandais, Angora Français, Rex) à Azaguié Gare, à 30 minutes d'Abidjan. Commande par WhatsApp, retrait sur place ou livraison en Côte d'Ivoire."

// ─── Identité de l'entreprise (NAP — Name / Address / Phone) ──────────────────
// Cohérence NAP = signal de confiance majeur pour le SEO local. Ces valeurs
// doivent rester identiques partout (footer, pages légales, JSON-LD).
export const BUSINESS = {
  name: 'Chez Florence',
  telephoneE164: '+2250142507750',   // format schema.org / tel: — pas d'espaces
  telephoneDisplay: '+225 01 42 50 77 50',
  email: 'wthomasss06@gmail.com',
  priceRange: '8 500 FCFA – 80 000 FCFA',
  currenciesAccepted: 'XOF',
  paymentAccepted: 'Cash, Orange Money, MTN Mobile Money, Wave',
  address: {
    streetAddress: 'Azaguié Gare',
    addressLocality: 'Azaguié',
    addressCountry: 'CI',
  },
  // Coordonnées de l'élevage — identiques à FARM_COORDS dans lib/delivery.js
  geo: { latitude: 5.6315, longitude: -4.0805 },
  areaServed: ['Abidjan', 'Azaguié', 'Agboville', 'Adzopé', "Côte d'Ivoire"],
  // Reflète les horaires affichés dans Footer.tsx. La page /conditions
  // (art. 5.1) mentionne "8h-18h" le samedi pour le retrait — à harmoniser
  // avec le footer si l'un des deux textes est erroné.
  openingHours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '18:00' },
    { days: ['Saturday'], opens: '09:00', closes: '14:00' },
  ],
}

// ─── Tarifs (miroir de TarifsSection.tsx / FaqSection.tsx / CGV) ──────────────
export const PRICING = {
  unite: { label: "À l'Unité", amount: 15000, desc: '1 lapin, environ 2 kg' },
  duo: { label: 'Le Duo', amount: 25000, desc: '2 lapins, environ 1,6 kg chacun' },
  resto: { label: 'Format Restaurateur', amount: 80000, desc: 'Lot de 6 lapins — restaurants & mini-restos' },
}

// ─── Helper JSON-LD ────────────────────────────────────────────────────────────
// Échappe les "<" pour empêcher qu'une valeur ne puisse jamais casser hors du
// tag <script> (défense en profondeur — les données ici sont déjà de confiance,
// mais autant ne rien laisser au hasard).
export function jsonLdScript(data) {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

// ─── JSON-LD sitewide (Organization/Store + WebSite) ──────────────────────────
// Utilisé dans app/layout.tsx — une seule fois pour tout le site.
export function getOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Store',
    '@id': `${SITE_URL}/#organization`,
    name: BUSINESS.name,
    url: SITE_URL,
    image: `${SITE_URL}/IMAGES/vente-lapins-affiche.jpg`,
    description: SITE_DESCRIPTION,
    telephone: BUSINESS.telephoneE164,
    email: BUSINESS.email,
    priceRange: BUSINESS.priceRange,
    currenciesAccepted: BUSINESS.currenciesAccepted,
    paymentAccepted: BUSINESS.paymentAccepted,
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS.address.streetAddress,
      addressLocality: BUSINESS.address.addressLocality,
      addressCountry: BUSINESS.address.addressCountry,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: BUSINESS.geo.latitude,
      longitude: BUSINESS.geo.longitude,
    },
    areaServed: BUSINESS.areaServed.map((name) => ({ '@type': 'AdministrativeArea', name })),
    openingHoursSpecification: BUSINESS.openingHours.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    })),
  }
}

export function getWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    publisher: { '@id': `${SITE_URL}/#organization` },
    inLanguage: 'fr-CI',
  }
}
