'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Facebook, Instagram, MessageCircle, Mail, Phone, MapPin } from 'lucide-react'
import Logo from './Logo'

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP?.replace(/\D/g, '') || ''

const footerLinks = {
  'Lapinou': [
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
  { icon: <Instagram size={16} />, href: '#', label: 'Instagram' },
]

export default function Footer() {
  return (
    <footer className="border-t border-brand-border pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
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
              {WHATSAPP && (
                <motion.a
                  href={`https://wa.me/${WHATSAPP}`}
                  target="_blank" rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="w-8 h-8 rounded-lg border border-brand-border flex items-center justify-center text-white/40 hover:text-sage hover:border-sage/30 transition-all"
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <MessageCircle size={16} />
                </motion.a>
              )}
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
                <span>contact@lapinou.ci</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={12} className="text-caramel/70 shrink-0" />
                <span>+225 {WHATSAPP || '07 00 00 00 00'}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={12} className="text-caramel/70 shrink-0 mt-0.5" />
                <span>Abidjan, Côte d'Ivoire</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-brand-border pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-xs font-mono">
            © {new Date().getFullYear()} Lapinou. Tous droits réservés.
          </p>
          <div className="flex items-center gap-1 text-white/30 text-xs">
            <span>Élevé avec</span>
            <motion.span
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-caramel/60"
            >
              🐇
            </motion.span>
            <span>en Côte d'Ivoire</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
