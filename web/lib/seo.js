// lib/seo.js
// Constantes centralisées SEO/AEO/GEO — évite de dupliquer les mêmes infos
// (NAP, coordonnées GPS, tarifs) dans layout.tsx, sitemap.ts, robots.ts et
// les schemas JSON-LD de chaque page. Si l'adresse, le téléphone ou les
// tarifs changent, tout se met à jour depuis ce seul fichier.

import { cld } from './cloudinary'
import { PRICE_PER_KG, PRICE_FORMATS, formatFcfa } from './pricing'

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://chez-florence.vercel.app').replace(/\/$/, '')

export const SITE_NAME = 'CHEZ FLORENCE'

export const SITE_DESCRIPTION =
  "Élevage et vente de lapins de race (Hollandais, Angora Français, Rex) à Azaguié Gare, en Côte d'Ivoire. Commande par WhatsApp, retrait sur place ou livraison vers Abidjan, Agboville, Adzopé et le reste du pays."

// ─── Identité de l'entreprise (NAP — Name / Address / Phone) ──────────────────
// Cohérence NAP = signal de confiance majeur pour le SEO local. Ces valeurs
// doivent rester identiques partout (footer, pages légales, JSON-LD).
export const BUSINESS = {
  name: 'Chez Florence',
  telephoneE164: '+2250142507750',   // format schema.org / tel: — pas d'espaces
  telephoneDisplay: '+225 01 42 50 77 50',
  email: 'wthomasss06@gmail.com',
  priceRange: `${formatFcfa(PRICE_PER_KG)} le kilo`,
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

// ─── Tarifs (dérivés de lib/pricing.ts — plus rien n'est saisi à la main) ─────
// Prix du kilo fixe ; chaque format = poids × tarif/kg − remise.
export const PRICING = {
  perKg: PRICE_PER_KG,
  formats: PRICE_FORMATS.map((f) => ({ id: f.id, label: f.label, rabbits: f.rabbits, discount: f.discount })),
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
    image: cld('/IMAGES/affiche-chez-florence-azaguie-portrait.png'),
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
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/rabbits?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function getSiteNavigationJsonLd() {
  const links = [
    ['Accueil', '/'],
    ['Nos Lapins', '/rabbits'],
    ['Tarifs', '/tarifs'],
    ['À propos', '/a-propos'],
    ['Contact', '/contact'],
    ['Centre d’aide', '/aide'],
  ]

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${SITE_URL}/#site-navigation`,
    name: 'Navigation principale — CHEZ FLORENCE',
    itemListElement: links.map(([name, path], index) => ({
      '@type': 'SiteNavigationElement',
      position: index + 1,
      name,
      url: `${SITE_URL}${path}`,
    })),
  }
}

export function getBreadcrumbJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  }
}
