'use client'
import { useEffect } from 'react'
import { gsap } from 'gsap'

// Port direct du parallax souris sur .jellyfish-bg (index.html) — ne
// rend rien, juste l'effet (même logique que <ScrollFX />).
export default function HeroParallax() {
  useEffect(() => {
    const hero = document.getElementById('hero')
    const bg = hero?.querySelector<HTMLElement>('.jellyfish-bg')
    if (!hero || !bg) return

    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 40
      const y = (e.clientY / window.innerHeight - 0.5) * 40
      gsap.to(bg, { x, y, duration: 1, ease: 'power2.out' })
    }
    hero.addEventListener('mousemove', onMove)
    return () => hero.removeEventListener('mousemove', onMove)
  }, [])

  return null
}
