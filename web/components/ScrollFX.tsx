'use client'
import useGsapLenis from '@/lib/useGsapLenis'

// Composant "invisible" : ne fait que démarrer Lenis + tous les
// ScrollTrigger de la home cinématique (voir lib/useGsapLenis.ts).
export default function ScrollFX() {
  useGsapLenis()
  return null
}
