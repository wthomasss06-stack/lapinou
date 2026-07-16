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
import ScrollFX              from '@/components/ScrollFX'
import HeroSection           from '@/components/HeroSection'
import TrustMarquee          from '@/components/TrustMarquee'
import MissionSection        from '@/components/MissionSection'
import GarantiesSection      from '@/components/GarantiesSection'
import LapinsFeaturedSection from '@/components/LapinsFeaturedSection'
import TestimonialsSection   from '@/components/TestimonialsSection'
import FaqSection            from '@/components/FaqSection'
import Footer                from '@/components/Footer'

export default function HomePage() {
  return (
    <main className="overflow-x-hidden">

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
        <LapinsFeaturedSection />
        <TestimonialsSection />
        <FaqSection />
      </div>

      <Footer />

    </main>
  )
}
