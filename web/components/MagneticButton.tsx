'use client'
import { useRef, type ReactNode } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'

gsap.registerPlugin(useGSAP)

interface MagneticButtonProps {
  children: ReactNode
  className?: string
  /** 0–1, force de suivi du curseur (magifique.html utilise 0.5). */
  strength?: number
}

// Repris de magifique.html (.magnetic-btn-wrapper / .magnetic-btn) : le
// bouton suit le curseur dans la zone du wrapper, ressort en élastique à
// la sortie. Enveloppe l'élément existant (peut être <a>, <button>...)
// sans le cloner : ses handlers/href/aria restent intacts, seul un
// transform GSAP est appliqué sur le div interne.
// Ajoute automatiquement .hover-target pour profiter du curseur custom
// (CustomCursor.tsx) sans avoir à le poser en plus à l'appel.
export default function MagneticButton({ children, className = '', strength = 0.45 }: MagneticButtonProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    const wrapper = wrapperRef.current
    const btn = btnRef.current
    if (!wrapper || !btn) return

    const onMove = (e: MouseEvent) => {
      const r = wrapper.getBoundingClientRect()
      const relX = (e.clientX - (r.left + r.width / 2)) * strength
      const relY = (e.clientY - (r.top + r.height / 2)) * strength
      gsap.to(btn, { x: relX, y: relY, duration: 0.3, ease: 'power2.out', overwrite: 'auto' })
    }
    const onLeave = () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.3)', overwrite: 'auto' })
    }

    wrapper.addEventListener('mousemove', onMove)
    wrapper.addEventListener('mouseleave', onLeave)
    return () => {
      wrapper.removeEventListener('mousemove', onMove)
      wrapper.removeEventListener('mouseleave', onLeave)
    }
  }, [strength])

  return (
    <div ref={wrapperRef} className={`inline-flex items-center justify-center ${className}`}>
      <div ref={btnRef} className="hover-target inline-flex">
        {children}
      </div>
    </div>
  )
}
