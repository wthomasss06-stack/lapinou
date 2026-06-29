'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface LogoProps {
  size?: number
  showText?: boolean
  className?: string
}

export default function Logo({ size = 36, showText = true, className = '' }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 ${className}`}>
      {/* Icône — silhouette de lapin minimaliste */}
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        initial={{ rotate: -8, scale: 0.85 }}
        animate={{ rotate: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        whileHover={{ rotate: 4, scale: 1.08 }}
      >
        {/* Fond rond chaud */}
        <circle cx="24" cy="24" r="22" fill="rgba(184, 131, 74, 0.12)" stroke="#B8834A" strokeWidth="1.5" />

        {/* Oreilles */}
        <motion.path
          d="M17 22C15.5 16 16 9 19 6.5C21 8 21.5 15 20.5 21.5"
          stroke="#B8834A" strokeWidth="2.2" strokeLinecap="round" fill="rgba(184,131,74,0.15)"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, ease: 'easeInOut' }}
        />
        <motion.path
          d="M31 22C32.5 16 32 9 29 6.5C27 8 26.5 15 27.5 21.5"
          stroke="#B8834A" strokeWidth="2.2" strokeLinecap="round" fill="rgba(184,131,74,0.15)"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, delay: 0.1, ease: 'easeInOut' }}
        />

        {/* Tête */}
        <motion.ellipse
          cx="24" cy="28" rx="9.5" ry="8.5"
          fill="rgba(184, 131, 74, 0.22)" stroke="#B8834A" strokeWidth="2"
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        />

        {/* Museau */}
        <motion.circle cx="24" cy="32" r="1.4" fill="#B8834A"
          animate={{ scale: [1, 1.25, 1] }} transition={{ duration: 2.2, repeat: Infinity }}
        />
        {/* Yeux */}
        <circle cx="20.5" cy="27" r="1.1" fill="#2A2118" />
        <circle cx="27.5" cy="27" r="1.1" fill="#2A2118" />
      </motion.svg>

      {/* Texte */}
      {showText && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex items-baseline gap-0.5"
        >
          <span className="font-display font-800 text-xl tracking-tight text-white">
            Lapi
          </span>
          <motion.span
            className="font-display font-800 text-xl tracking-tight"
            style={{ color: '#B8834A' }}
            animate={{ textShadow: ['0 0 6px rgba(184,131,74,0.25)', '0 0 14px rgba(184,131,74,0.5)', '0 0 6px rgba(184,131,74,0.25)'] }}
            transition={{ duration: 2.4, repeat: Infinity }}
          >
            nou
          </motion.span>
        </motion.div>
      )}
    </Link>
  )
}
