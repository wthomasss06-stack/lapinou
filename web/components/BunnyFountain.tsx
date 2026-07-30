'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

// Port de footer_animated_bunnies.html : des lapins (images du loader)
// sont projetés depuis le bas du footer en arc parabolique, tournent sur
// eux-mêmes, puis retombent en s'estompant — relance en boucle, décalage
// aléatoire par particule. Couche de fond pure décoration (pointer-events
// none), le contenu réel du footer reste au-dessus (z-index).
//
// Nombre de particules volontairement plus modeste que la démo d'origine
// (35) — 16 suffisent à l'effet "fontaine" sans faire tourner 35 tweens
// GSAP en continu derrière un footer qui a déjà pas mal de contenu.

interface BunnyFountainProps {
  images: string[]
  count?: number
}

export default function BunnyFountain({ images, count = 16 }: BunnyFountainProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container || !images.length) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const particles: HTMLDivElement[] = []
    const delayedCalls: gsap.core.Tween[] = []

    function animateRabbit(particle: HTMLDivElement) {
      if (!container.isConnected) return
      gsap.set(particle, {
        x: 0,
        y: 50,
        opacity: 1,
        scale: Math.random() * 0.5 + 0.5,
        rotation: (Math.random() - 0.5) * 45,
      })

      const launchDuration = Math.random() * 0.3 + 0.2
      const fallDuration = 1.0
      const containerHeight = container.offsetHeight
      const containerWidth = container.offsetWidth
      const topY = -(Math.random() * (containerHeight * 0.7) + containerHeight * 0.2)
      const randomX = (Math.random() - 0.5) * (containerWidth * 1.2)

      gsap.to(particle, {
        x: randomX,
        rotation: (Math.random() - 0.5) * 360,
        duration: launchDuration + fallDuration,
        ease: 'power1.out',
      })

      const tl = gsap.timeline({
        onComplete: () => {
          delayedCalls.push(gsap.delayedCall(Math.random() * 0.5, () => animateRabbit(particle)))
        },
      })
      tl.to(particle, { y: topY, duration: launchDuration, ease: 'power4.out' })
        .to(particle, { y: topY + containerHeight * 0.2, opacity: 0, duration: fallDuration, ease: 'power2.in' })
    }

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div')
      particle.className = 'bunny-particle'
      const randomImg = images[Math.floor(Math.random() * images.length)]
      particle.style.backgroundImage = `url('${randomImg}')`
      container.appendChild(particle)
      particles.push(particle)
      delayedCalls.push(gsap.delayedCall(Math.random() * 2, () => animateRabbit(particle)))
    }

    return () => {
      delayedCalls.forEach((dc) => dc.kill())
      particles.forEach((p) => {
        gsap.killTweensOf(p)
        p.remove()
      })
    }
  }, [images, count])

  return <div className="fountain-container" ref={containerRef} aria-hidden="true" />
}
