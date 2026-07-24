// web/app/aide/page.tsx
// Server component — permet d'exporter `metadata` (SEO) et le schema
// JSON-LD FAQPage (AEO/GEO). La recherche/filtres interactifs vivent dans
// components/AideContent.tsx ('use client'), qui consomme les mêmes
// données (lib/aide-faq-data.ts) que le JSON-LD ci-dessous — impossible
// que le schema et l'affichage se désynchronisent.
import type { Metadata } from 'next'
import AideContent from '@/components/AideContent'
import { AIDE_FAQS } from '@/lib/aide-faq-data'
import { SITE_URL, jsonLdScript } from '@/lib/seo'

export const metadata: Metadata = {
  title: "Centre d'Aide — Commande, Livraison, Paiement, Élevage | Chez Florence",
  description:
    "Toutes les réponses sur l'achat de lapins à Abidjan : commande via WhatsApp, zones et délais de livraison, moyens de paiement, garantie et conseils d'élevage.",
  alternates: { canonical: '/aide' },
  openGraph: {
    title: "Centre d'Aide — Chez Florence",
    description: "Réponses sur la commande, la livraison, le paiement et l'élevage de lapins à Abidjan.",
    url: `${SITE_URL}/aide`,
    type: 'website',
  },
}

function getFaqPageJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${SITE_URL}/aide#faqpage`,
    mainEntity: AIDE_FAQS.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }
}

export default function AidePage() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: jsonLdScript(getFaqPageJsonLd()) }}
      />
      <AideContent />
    </>
  )
}
