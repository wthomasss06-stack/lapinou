// web/app/page.tsx
// ═══════════════════════════════════════════════════════════════════
//  CHEZ FLORENCE — Page d'accueil
//
//  • Navbar + HeroSection  — ancien slider vidéo (3 slides, wipe diagonal).
//  • GarantiesSection (page2, id="a-propos") — fusionne l'ancienne
//    AboutSection : une seule section "Notre Histoire".
//  • IrisSection — pin + reveal (No. 04), juste après "Nos engagements".
//  • PricingSection (sec-pricing) — vrais tarifs, indexc.html (No. 05).
//  • RabbitsPreviewSection (page4) — carousel "Nos Lapins" 1x3, vraies
//    fiches (RabbitCard + rabbitsApi, même source que RabbitsSection)
//    (No. 06).
//  • RacesSection (page3) — parallax + fond ink→paper, repoussée après
//    "Nos Lapins".
//  • HorizontalCta — bandeau pinné horizontal.
//
//  Triptyque (Galerie, No. 04) et Blob (En Mouvement, No. 06) ont été
//  entièrement retirés (composants, CSS et logique GSAP) — pas seulement
//  leur animation. GalerieSection.tsx et BlobSection.tsx ne sont plus
//  importés nulle part ; tu peux les supprimer du projet si tu veux.
//
//  GARDÉS (routes /rabbits, /#contact en dépendent), harmonisés avec un
//  seul fond marron (--ink) et les mêmes 3 polices (.home-kept-sections
//  dans home-cinematic.css) :
//    • RabbitsSection — catalogue API complet, filtrable
//    • ContactSection — formulaire contact
//    • AdoptSection — footer unique du site
//
//  AdoptSection (ex page5 "Commandez") est maintenant le SEUL composant
//  footer du site : fusion complète de l'ancienne clôture cinématique
//  (bouton WhatsApp, gros email, "on vous répond vite") et de l'ancien
//  Footer.tsx (marque, nav, colonne contact, barre copyright). Affiché
//  sur TOUTES les pages, pas seulement la home. Footer.tsx redirige
//  maintenant vers AdoptSection.tsx pour ne rien casser ailleurs dans
//  le projet.
//
//  AboutSection n'est plus rendue séparément (fusionnée dans page2) — le
//  fichier reste dans le projet, juste plus importé.
// ═══════════════════════════════════════════════════════════════════

import 'lenis/dist/lenis.css'
import '@/app/home-cinematic.css'

import Navbar                from '@/components/Navbar'
import GrainOverlay          from '@/components/GrainOverlay'
import Loader                from '@/components/Loader'
import CustomCursor          from '@/components/CustomCursor'
import ScrollFX              from '@/components/ScrollFX'
import HeroSection           from '@/components/HeroSection'
import GarantiesSection      from '@/components/GarantiesSection'
import RacesSection          from '@/components/RacesSection'
import IrisSection           from '@/components/IrisSection'
import PricingSection        from '@/components/PricingSection'
import RabbitsPreviewSection from '@/components/RabbitsPreviewSection'
import HorizontalCta         from '@/components/HorizontalCta'
import ContactSection        from '@/components/ContactSection'
import AdoptSection          from '@/components/AdoptSection'

export default function HomePage() {
  return (
    <main className="overflow-x-hidden">

      <Navbar />

      {/* ── Home cinématique ──────────────────────────────────── */}
      <div className="home-cinema">
        <GrainOverlay />
        <Loader />
        <CustomCursor />
        <ScrollFX />

        {/* 01 — Hero (slider vidéo) */}
        <HeroSection />

        {/* 02 — Notre Histoire / Nos Garanties (fusion avec À propos) */}
        <GarantiesSection />

        {/* 04 — Portrait iris (sec-iris) */}
        <IrisSection />

        {/* 05 — Tarifs (sec-pricing) */}
        <PricingSection />

        {/* 06 — Nos Lapins (carousel 1x3, page4) */}
        <RabbitsPreviewSection />

        {/* 03 — Nos Races */}
        <RacesSection />

        {/* Bandeau CTA pinné horizontal */}
        <HorizontalCta />
      </div>

      {/* ── Contact only (GARDÉS) ─────────────────────────────── */}
      <div className="home-kept-sections">
        <ContactSection />
      </div>

      <div className="home-kept-sections">
        <AdoptSection />
      </div>

    </main>
  )
}