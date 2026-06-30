'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface LogoProps {
  size?: number
  showText?: boolean
  className?: string
}

export default function Logo({ size = 44, showText = true, className = '' }: LogoProps) {
  // showText=true  → logo complet (tête + bandeau "LAPINOU" intégré au visuel)
  //                  ratio réel ≈ 0.82:1 (plus haut que large)
  // showText=false → icône compacte (tête de lapin seule), carrée (1:1)
  const src = showText ? '/logo.png' : '/logo-icon.png'
  const width = showText ? Math.round(size * 0.82) : size

  return (
    <Link href="/" className={`flex items-center gap-2 shrink-0 ${className}`}>
      <motion.div
        initial={{ rotate: -8, scale: 0.85, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        whileHover={{ rotate: 4, scale: 1.06 }}
        style={{ width, height: size }}
        className="relative shrink-0"
      >
        <Image
          src={src}
          alt="Lapinou — Vente de lapins à Abidjan"
          fill
          sizes={`${size}px`}
          className="object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]"
          priority
        />
      </motion.div>
    </Link>
  )
}
