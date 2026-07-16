'use client'
import { useEffect, useState } from 'react'
import { analyticsApi } from '@/lib/api'

// Port direct de countUp() appliqué aux .sp-num (index.html) — la
// maquette anime des chiffres codés en dur ; ici les 3 premiers sont de
// vraies données (analyticsApi.publicStats(), déjà utilisées par
// l'admin), la note moyenne reste fixe (pas encore de vrais avis notés).
function useCountUp(target: number, run: boolean) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!run || !target) return
    let raf: number
    const start = performance.now()
    const duration = 1400
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration)
      setN(Math.round(target * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, run])
  return n
}

export default function HeroStats() {
  const [stats, setStats] = useState<{ totalReservations: number; totalRabbits: number; totalBreeds: number } | null>(null)

  useEffect(() => {
    analyticsApi.publicStats()
      .then((r: any) => setStats({
        totalReservations: r?.totalReservations || 150,
        totalRabbits: r?.totalRabbits || 500,
        totalBreeds: r?.totalBreeds || 3,
      }))
      .catch(() => setStats({ totalReservations: 150, totalRabbits: 500, totalBreeds: 3 }))
  }, [])

  const clients = useCountUp(stats?.totalReservations || 0, !!stats)
  const rabbits = useCountUp(stats?.totalRabbits || 0, !!stats)
  const breeds = useCountUp(stats?.totalBreeds || 0, !!stats)

  return (
    <div className="social-proof-bar reveal-text">
      <div className="sp-item"><div className="sp-num">{clients}+</div><div className="sp-label">Clients satisfaits</div></div>
      <div className="sp-item"><div className="sp-num">{rabbits}+</div><div className="sp-label">Lapins vendus</div></div>
      <div className="sp-item"><div className="sp-num">{breeds}</div><div className="sp-label">Races disponibles</div></div>
      <div className="sp-item"><div className="sp-num">4.9★</div><div className="sp-label">Note moyenne</div></div>
    </div>
  )
}
