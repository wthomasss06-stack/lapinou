'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Facebook, Mail, Phone, MapPin } from 'lucide-react'
import Logo from './Logo'
import { formatWhatsappDisplay } from '@/lib/whatsapp'

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP?.replace(/\D/g, '') || ''
const WHATSAPP_URL = WHATSAPP
  ? `https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Bonjour, j'aimerais commander un lapin.")}`
  : '#'

const footerLinks = {
  'CHEZ FLORENCE': [
    { label: 'Accueil', href: '/' },
    { label: 'Nos Lapins', href: '/#lapins' },
    { label: 'À Propos', href: '/#a-propos' },
    { label: 'Contact', href: '/#contact' },
  ],
  'Informations': [
    { label: 'Aide', href: '/aide' },
    { label: 'Conditions', href: '/conditions' },
    { label: 'Confidentialité', href: '/confidentialite' },
  ],
}

const socials = [
  { icon: <Facebook size={16} />, href: '#', label: 'Facebook' },
]

// Footer unique du site — repris de la clôture cinématique de la home
// (sticker WhatsApp incliné, gros email en mono, ton "on vous répond vite")
// mais en version compacte et responsive : contrairement à la section
// #page5 (120vh, réservée à la home), ce composant s'affiche sur TOUTES
// les pages (/aide, /admin, /rabbits/[slug]…) donc pas de unités vw
// verrouillées ni de scope .home-cinema.
export default function Footer() {
  return (
    <footer className="bg-[var(--dark)] border-t border-brand-border">
      {/* ── Bloc "Commandez" — sticker WhatsApp + email ────────────── */}
      <div className="text-center px-6 pt-16 pb-14 border-b border-white/10">
        <p className="font-label text-xs sm:text-sm uppercase tracking-[0.3em] text-[var(--lime)]/70 mb-6">
          Commandez
        </p>
        <p className="font-label text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[var(--lime)] mb-3">
          Une question sur nos lapins ?
        </p>
        <h2 className="font-display italic font-bold text-2xl sm:text-4xl text-white mb-8">
          Écrivez-nous directement
        </h2>

        <motion.a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ rotate: -3 }}
          whileHover={{ rotate: 0, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block bg-[var(--muted)] text-[var(--dark)] font-label font-bold text-sm uppercase tracking-[0.1em] px-9 py-4 rounded-lg shadow-lg shadow-black/30"
        >
          WhatsApp
        </motion.a>

        <p className="font-mono text-lg sm:text-2xl text-[var(--muted)] mt-8 break-all sm:break-normal">
          wthomasss06@gmail.com
        </p>
      </div>

      {/* ── Colonnes utilitaires ─────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 pt-14 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Logo className="mb-4" />
            <p className="text-white/40 text-xs leading-relaxed mb-6 max-w-xs">
              L'élevage qui vous connecte directement aux plus beaux lapins,
              en toute confiance, partout en Côte d'Ivoire.
            </p>
            <div className="flex gap-2">
              {socials.map(social => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-8 h-8 rounded-lg border border-brand-border flex items-center justify-center text-white/40 hover:text-caramel hover:border-caramel/30 transition-all"
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-display font-bold text-white text-sm mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/40 text-xs hover:text-caramel transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold text-white mb-4">Nous joindre</h4>
            <ul className="space-y-2.5 text-xs text-white/40">
              <li className="flex items-center gap-2">
                <Mail size={12} className="text-caramel/70 shrink-0" />
                <span>wthomasss06@gmail.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={12} className="text-caramel/70 shrink-0" />
                <span>{WHATSAPP ? formatWhatsappDisplay(WHATSAPP) : '+225 01 42 50 77 50'}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={12} className="text-caramel/70 shrink-0 mt-0.5" />
                <span>Abidjan, Côte d'Ivoire</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-brand-border pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="font-label text-[10px] uppercase tracking-[0.15em] text-white/30">
            © {new Date().getFullYear()} CHEZ FLORENCE — Tous droits réservés
          </p>
          <p className="font-label text-[10px] uppercase tracking-[0.15em] text-white/30">
            On vous répond vite
          </p>
        </div>
      </div>
    </footer>
  )
}