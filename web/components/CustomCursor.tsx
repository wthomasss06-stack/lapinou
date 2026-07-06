'use client'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'

gsap.registerPlugin(useGSAP)

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // Le curseur custom est de toute façon masqué en CSS sur tactile —
    // on évite juste de faire tourner la boucle pour rien sur mobile.
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
      gsap.ticker.remove(tick)
    }
  }, [])

  return <div id="cursor" ref={cursorRef} aria-hidden="true" />
}
