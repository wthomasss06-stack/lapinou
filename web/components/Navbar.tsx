'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import Logo from './Logo'

const navLinks = [
  { label: 'Accueil', href: '/' },
  { label: 'Nos Lapins', href: '/#lapins' },
  { label: 'À Propos', href: '/#a-propos' },
  { label: 'Contact', href: '/#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-brand-dark/90 backdrop-blur-xl border-b border-brand-border shadow-lg shadow-black/30'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Logo />

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i + 0.3 }}
              >
                <Link
                  href={link.href}
                  className="text-sm text-white/70 hover:text-caramel transition-colors duration-300 relative group font-body"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-caramel transition-all duration-300 group-hover:w-full" />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* CTA */}
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link href="/#lapins" className="btn-neon hidden md:block px-5 py-2 rounded-full text-sm">
                Voir les lapins
              </Link>
            </motion.div>

            {/* Mobile burger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-white/70"
              aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-40 bg-brand-darker flex flex-col"
          >
            <div className="px-6 py-4 border-b border-brand-border flex justify-between items-center">
              <Logo />
              <button onClick={() => setMobileOpen(false)} aria-label="Fermer le menu">
                <X size={24} className="text-white/70" />
              </button>
            </div>
            <div className="flex flex-col gap-1 p-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-4 text-xl font-display font-semibold text-white/80 hover:text-caramel transition-colors border-b border-brand-border/50"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="px-6 mt-auto pb-8">
              <Link href="/#lapins" onClick={() => setMobileOpen(false)} className="btn-neon w-full py-4 rounded-xl text-center block text-base">
                Voir les lapins
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
