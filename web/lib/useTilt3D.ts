'use client'
import { useEffect, type RefObject } from 'react'
import { gsap } from 'gsap'

// Repris de magifique.html ([data-tilt] + mousemove → rotateX/rotateY,
// voir la section <script> du fichier de référence). Délégation sur
// containerRef plutôt que querySelectorAll(selector) direct sur les
// éléments au montage : couvre aussi les cartes ajoutées après coup
// (contrairement au HTML statique de référence, ici les .price-card
// existent dès le rendu mais d'autres usages futurs pourraient être
// dynamiques — même logique que la délégation dans CustomCursor.tsx).
//
// Usage : const gridRef = useRef<HTMLDivElement>(null)
//         useTilt3D(gridRef)
//         <div ref={gridRef}><div className="price-card" data-tilt>...</div></div>
export function useTilt3D(containerRef: RefObject<HTMLElement | null>, selector = '[data-tilt]') {
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia('(pointer: fine)').matches) return
    const container = containerRef.current
    if (!container) return

    let active: HTMLElement | null = null

    // Certaines cartes ont déjà un scale statique en CSS (ex: .price-card
    // --featured → scale(1.05) dans home-cinematic.css). gsap.to() écrit le
    // transform en inline style et écraserait définitivement ce scale au
    // premier survol (le reset retomberait à 1, pas 1.05) — chaque carte
    // porte donc son propre scale de base via data-base-scale (défaut 1),
    // et on l'utilise comme point de repos ET comme base du hover.
    const baseScaleOf = (el: HTMLElement) => parseFloat(el.dataset.baseScale || '1')

    const reset = (el: HTMLElement) => {
      gsap.to(el, { rotateX: 0, rotateY: 0, scale: baseScaleOf(el), duration: 0.6, ease: 'power3.out', overwrite: 'auto' })
    }

    const onMove = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest(selector) as HTMLElement | null

      if (target !== active) {
        if (active) reset(active)
        active = target
      }
      if (!target) return

      const r = target.getBoundingClientRect()
      const angleX = (r.height / 2 - (e.clientY - r.top)) / 10
      const angleY = (e.clientX - r.left - r.width / 2) / 10
      gsap.to(target, {
        rotateX: angleX,
        rotateY: angleY,
        scale: baseScaleOf(target) + 0.03,
        transformPerspective: 800,
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    }

    const onLeave = () => {
      if (active) reset(active)
      active = null
    }

    container.addEventListener('mousemove', onMove)
    container.addEventListener('mouseleave', onLeave)
    return () => {
      container.removeEventListener('mousemove', onMove)
      container.removeEventListener('mouseleave', onLeave)
      if (active) reset(active)
    }
  }, [containerRef, selector])
}
