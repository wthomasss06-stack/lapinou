'use client'
import { motion } from 'framer-motion'
import { Stethoscope, MessageCircle, Star, Truck } from 'lucide-react'

const baseItems = [
  { text: 'LAPINS VACCINÉS', icon: <Stethoscope size={14} /> },
  { text: 'CONTACT WHATSAPP DIRECT', icon: <MessageCircle size={14} /> },
  { text: 'RACES SÉLECTIONNÉES', icon: <Star size={14} /> },
  { text: 'REMISE EN MAIN PROPRE', icon: <Truck size={14} /> },
]
const items = [...baseItems, ...baseItems, ...baseItems, ...baseItems]

export default function MarqueeBanner() {
  return (
    <div className="relative py-4 overflow-hidden border-y border-caramel/15 bg-brand-card/50">
      {/* Left/right fade */}
      <div className="absolute left-0 top-0 w-16 h-full z-10 bg-gradient-to-r from-brand-dark to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 w-16 h-full z-10 bg-gradient-to-l from-brand-dark to-transparent pointer-events-none" />

      <div className="flex overflow-hidden">
        <motion.div
          className="flex gap-8 items-center whitespace-nowrap"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 30, ease: 'linear', repeat: Infinity }}
        >
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-2.5 text-caramel/80">
              <span className="text-caramel/50">{item.icon}</span>
              <span className="font-mono text-xs tracking-[0.2em] font-medium">
                {item.text}
              </span>
              <span className="text-caramel/30 text-lg leading-none">✦</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
