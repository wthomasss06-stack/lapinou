'use client'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'

gsap.registerPlugin(useGSAP)

// Curseur custom + détection .hover-target / .hover-view (délégation sur
// document — couvre aussi les éléments ajoutés dynamiquement, ex. grille
// RabbitCard). .hover-target : grossit, orange, blend normal. .hover-view
// (grille "Nos Lapins") : pareil + libellé "VOIR" (::after en CSS, voir
// home-cinematic.css) — reprend le comportement de chaque maquette HTML,
// en gardant la distorsion skew/scale liée à la vitesse déjà en place.
export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return

    const c = cursorRef.current
    if (!c) return

    let mx = window.innerWidth / 2
    let my = window.innerHeight / 2
    let px = mx
    let py = my

    const onMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
    }
    window.addEventListener('mousemove', onMove)

    // Met à jour l'état du curseur à partir de l'élément réellement sous le pointeur.
    // Important : une RabbitCard contient plusieurs enfants (image, titre, prix...).
    // On ne laisse donc jamais un mouseout d'un enfant réactiver le mix-blend-mode
    // alors que le pointeur est encore dans la même carte.
    const updateCursorMode = (target: EventTarget | null) => {
      const el = target instanceof Element ? target : null
      if (el?.closest('.rabbit-card')) {
        c.classList.add('is-rabbit-card')
        c.classList.remove('is-hovering', 'is-view')
      } else if (el?.closest('.hover-view')) {
        c.classList.remove('is-rabbit-card')
        c.classList.add('is-hovering', 'is-view')
      } else if (el?.closest('.hover-target')) {
        c.classList.remove('is-rabbit-card')
        c.classList.add('is-hovering')
      } else {
        c.classList.remove('is-hovering', 'is-view', 'is-rabbit-card')
      }
    }

    const onOver = (e: MouseEvent) => updateCursorMode(e.target)

    const onOut = (e: MouseEvent) => {
      // Si on passe simplement d'un enfant à un autre enfant de la même
      // RabbitCard, relatedTarget reste dans la carte : on ne change rien.
      const next = e.relatedTarget instanceof Element ? e.relatedTarget : null
      if (next?.closest('.rabbit-card')) {
        updateCursorMode(next)
        return
      }
      updateCursorMode(next)
    }

    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)

    const xTo = gsap.quickTo(c, 'x', { duration: 0.7, ease: 'power4.out' })
    const yTo = gsap.quickTo(c, 'y', { duration: 0.7, ease: 'power4.out' })

    const tick = () => {
      xTo(mx)
      yTo(my)

      const dx = mx - px
      const v = Math.hypot(dx, my - py)

      gsap.to(c, {
        skewX: gsap.utils.clamp(-8, 8, dx * 0.25),
        scaleX: 1 + v * 0.01,
        scaleY: 1 - v * 0.01,
        rotate: dx * 0.15,
        duration: 0.55,
        ease: 'power4.out',
        overwrite: 'auto',
      })

      px = mx
      py = my
    }
    gsap.ticker.add(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
      gsap.ticker.remove(tick)
    }
  }, [])

  return <div id="cursor" ref={cursorRef} aria-hidden="true" />
}
