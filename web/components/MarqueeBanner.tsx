'use client'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const TEXT = 'DISPONIBLE · RETRAIT RAPIDE · QUALITÉ CONTRÔLÉE · PRÊT À LA VENTE · EN STOCK · ENVIRON 2 KG · LAPIN FRAIS · SÉLECTIONNÉ · PESÉ AVEC SOIN ·'

// Port direct de .marquee-container (index.html) : vitesse de base
// constante, dont le timeScale s'accélère/s'inverse avec la vélocité du
// scroll sur #histoire (reprend le comportement exact de la maquette).
export default function MarqueeBanner() {
  const innerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!innerRef.current) return
    const tween = gsap.to(innerRef.current, { xPercent: -50, repeat: -1, duration: 15, ease: 'none' })

    const st = ScrollTrigger.create({
      trigger: '#histoire',
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        gsap.to(tween, { timeScale: self.getVelocity() / 150 + 1, duration: 0.2 })
      },
    })

    return () => {
      st.kill()
      tween.kill()
    }
  }, [])

  return (
    <div className="marquee-container">
      <div className="marquee-inner" ref={innerRef}>
        <span>{TEXT}</span>
        <span>{TEXT}</span>
      </div>
    </div>
  )
}
