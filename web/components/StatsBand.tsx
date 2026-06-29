'use client'
import { useEffect, useRef, useState } from 'react'

function Counter({ target, suffix = '' }) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let s = 0
        const step = () => {
          s += Math.ceil(target / 38) || 1
          if (s >= target) { setVal(target); return }
          setVal(s)
          requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
        obs.disconnect()
      }
    }, { threshold: 0.5 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [target])

  return <span ref={ref}>{val}{suffix}</span>
}

const ITEMS = [
  { n: 120, suf: '+', label: 'Lapins élevés' },
  { n: 4, suf: '', label: 'Races disponibles' },
  { n: 98, suf: '%', label: 'Clients satisfaits' },
  { n: 1, suf: ' min', label: 'Pour réserver' },
]

export default function StatsBand() {
  return (
    <div className="bg-brand-card/40 border-y border-brand-border">
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-brand-border/60">
        {ITEMS.map((item, i) => (
          <div key={i} className="px-6 py-8 sm:py-10 text-center">
            <div className="font-display text-3xl sm:text-4xl font-extrabold text-caramel tracking-tight">
              <Counter target={item.n} suffix={item.suf} />
            </div>
            <div className="text-white/40 text-xs sm:text-sm mt-1.5 font-medium">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
