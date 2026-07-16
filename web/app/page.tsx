// web/app/page.tsx
// ═══════════════════════════════════════════════════════════════════
//  CHEZ FLORENCE — Page d'accueil
//
//  • Navbar — CardNav (desktop) + StaggeredMenu (mobile), restaurée telle
//    qu'à l'origine du projet. Porte maintenant TOUTE la navigation du
//    site (Nos Lapins/Tarifs/Notre Histoire/FAQ/Contact + Aide/Conditions/
//    Confidentialité + WhatsApp) — ces liens ne sont plus dans le footer.
//  • HeroSection — vidéo webm en fond (3 slides), voile marron, titre
//    pixel, compteur de preuve sociale (HeroStats, données réelles),
//    cartes tarifs tiltées.
//  • MissionSection (id="histoire") — Notre Histoire + marquee.
//  • GarantiesSection (id="garanties") — grille 4 items.
//  • TarifsSection (id="tarifs") — 3 formules, tilt 3D.
//  • LapinsFeaturedSection (id="lapins") — vraies fiches API.
//  • TestimonialsSection (id="temoignages") — 3 avis.
//  • FaqSection (id="faq") — 6 questions ; version complète sur /aide.
//  • Footer (id="contact") — identité + contact seulement (plus de
//    liste de liens : toute la nav vit dans <Navbar />).
//
//  Fond marron unique (--maroon) sur toute la home, plus d'alternance
//  clair/sombre par section.
// ═══════════════════════════════════════════════════════════════════

import 'lenis/dist/lenis.css'
import '@/app/home-cinematic.css'

import Navbar                from '@/components/Navbar'
import GrainOverlay          from '@/components/GrainOverlay'
import Loader                from '@/components/Loader'
import CustomCursor          from '@/components/CustomCursor'
import ScrollFX              from '@/components/ScrollFX'
import HeroSection           from '@/components/HeroSection'
import MissionSection        from '@/components/MissionSection'
import GarantiesSection      from '@/components/GarantiesSection'
import TarifsSection         from '@/components/TarifsSection'
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
        <MissionSection />
        <GarantiesSection />
        <TarifsSection />
        <LapinsFeaturedSection />
        <TestimonialsSection />
        <FaqSection />
      </div>

      <Footer />

    </main>
  )
}
