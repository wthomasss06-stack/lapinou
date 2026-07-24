// web/app/page.tsx
// ═══════════════════════════════════════════════════════════════════
//  CHEZ FLORENCE — Page d'accueil
//
//  • Navbar — CardNav (desktop) + StaggeredMenu (mobile). Porte toute la
//    navigation du site (Nos Lapins/Tarifs/Notre Histoire/FAQ/Contact +
//    Aide/Conditions/Confidentialité + WhatsApp).
//  • HeroSection — plein écran, épuré (vidéo + titre + sous-titre
//    seulement). Stats et cartes tarifs retirées d'ici pour que le hero
//    tienne dans le premier écran et convertisse mieux.
//  • TrustMarquee — 3 bandes défilantes juste après le hero (donc
//    visibles dès le premier scroll) : disponibilité (No.02 marquee
//    déplacé ici), tarifs (id="tarifs", remplace l'ancienne grille),
//    livraison par zone.
//  • MissionSection (id="histoire") — Notre Histoire.
//  • GarantiesSection (id="garanties") — grille 4 items.
//  • LapinsFeaturedSection (id="lapins") — vraies fiches API.
//  • TestimonialsSection (id="temoignages") — 3 avis.
//  • FaqSection (id="faq") — 6 questions ; version complète sur /aide.
//  • Footer (id="contact") — identité + contact (toute la nav vit dans
//    <Navbar />).
//
//  Fond marron unique (--maroon) sur toute la home.
// ═══════════════════════════════════════════════════════════════════

import 'lenis/dist/lenis.css'
import '@/app/home-cinematic.css'

import Navbar                from '@/components/Navbar'
import GrainOverlay          from '@/components/GrainOverlay'
import Loader                from '@/components/Loader'
import CustomCursor          from '@/components/CustomCursor'
import ScrollFX               from '@/components/ScrollFX'
import HeroSection           from '@/components/HeroSection'
import TrustMarquee          from '@/components/TrustMarquee'
import MissionSection        from '@/components/MissionSection'
import GarantiesSection      from '@/components/GarantiesSection'
import TarifsSection         from '@/components/TarifsSection'
import LapinsFeaturedSection from '@/components/LapinsFeaturedSection'
import TestimonialsSection   from '@/components/TestimonialsSection'
import PosterSection         from '@/components/PosterSection'
import FaqSection            from '@/components/FaqSection'
import Footer                from '@/components/Footer'
import { HOME_FAQS } from '@/lib/faq-data'
import { SITE_URL, jsonLdScript } from '@/lib/seo'
import { isUnavailable, resolvePhotoUrl } from '@/lib/status'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

// Server-side, en plus du carousel client (LapinsFeaturedSection) qui a
// besoin du fetch client pour ses flèches précédent/suivant. Le carousel
// reste tel quel (pas de risque sur son animation GSAP) ; ce fetch sert
// uniquement à rendre les mêmes lapins visibles dans le HTML brut, pour
// les crawlers qui n'exécutent pas le JS (cf. checklist SEO technique —
// une section stratégique ne doit pas dépendre uniquement du client-side).
async function getFeaturedRabbitsJsonLd() {
  try {
    const res = await fetch(`${API_URL}/rabbits`, { next: { revalidate: 300 } })
    if (!res.ok) return null
    const data = await res.json()
    const rabbits = (data.results || data || []).slice(0, 8)
    if (!rabbits.length) return null

    return {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: rabbits.map((rabbit: any, i: number) => {
        const mainPhoto = rabbit.photos?.find((p: any) => p.isMain) || rabbit.photos?.[0]
        const photoUrl = mainPhoto ? resolvePhotoUrl(mainPhoto.url) : undefined
        return {
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'Product',
            name: rabbit.name,
            url: `${SITE_URL}/rabbits/${rabbit.slug}`,
            ...(photoUrl ? { image: photoUrl } : {}),
            ...(rabbit.breed ? { category: rabbit.breed } : {}),
            offers: {
              '@type': 'Offer',
              url: `${SITE_URL}/rabbits/${rabbit.slug}`,
              priceCurrency: 'XOF',
              price: rabbit.price,
              availability: isUnavailable(rabbit) ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
            },
          },
        }
      }),
    }
  } catch {
    // API backend injoignable au build — on ne casse pas la page pour autant.
    return null
  }
}

function getFaqPageJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: HOME_FAQS.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }
}

export default async function HomePage() {
  const rabbitsJsonLd = await getFeaturedRabbitsJsonLd()

  return (
    <main className="overflow-x-hidden">

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: jsonLdScript(getFaqPageJsonLd()) }}
      />
      {rabbitsJsonLd && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: jsonLdScript(rabbitsJsonLd) }}
        />
      )}

      <Navbar />

      <div className="home-cinema">
        <GrainOverlay />
        <Loader />
        <CustomCursor />
        <ScrollFX />

        <HeroSection />
        <TrustMarquee />
        <MissionSection />
        <GarantiesSection />
        <TarifsSection />
        <LapinsFeaturedSection />
        <TestimonialsSection />
        <PosterSection />
        <FaqSection />
      </div>

      <Footer />

    </main>
  )
}
