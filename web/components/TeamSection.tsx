'use client'
import { motion } from 'framer-motion'
import { Stethoscope, HeartHandshake, MessageCircle, Truck } from 'lucide-react'

const FEATURES = [
  { num: '01', title: 'Suivi vétérinaire', desc: 'Chaque lapin est vacciné et contrôlé avant son adoption.', icon: <Stethoscope size={18} /> },
  { num: '02', title: 'Élevage à taille humaine', desc: 'Nous connaissons chaque lapin par son nom, pas par un numéro.', icon: <HeartHandshake size={18} /> },
  { num: '03', title: 'Contact direct', desc: 'Vous échangez avec l\u2019éleveur sur WhatsApp, sans intermédiaire.', icon: <MessageCircle size={18} /> },
  { num: '04', title: 'Remise en main propre', desc: 'Rendez-vous fixé ensemble à Abidjan, en toute confiance.', icon: <Truck size={18} /> },
]

const GALLERY = [
  'https://images.unsplash.com/photo-1452857297128-d9c29adba80b?w=500&q=80',
  'https://images.unsplash.com/photo-1535241749838-299277b6305f?w=500&q=80',
  'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500&q=80',
  'https://images.unsplash.com/photo-1591561582301-7ce6588cc286?w=500&q=80',
]

export default function TeamSection() {
  return (
    <section id="confiance" className="py-24 px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Colonne gauche — header + grille 2x2 */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <p className="text-caramel font-mono text-xs tracking-widest uppercase mb-3">Pourquoi Lapinou</p>
            <h2 className="font-display text-4xl lg:text-5xl font-extrabold text-white leading-tight">
              Une <span className="text-gradient">relation de confiance</span>
            </h2>
            <p className="text-white/40 mt-4 text-sm leading-relaxed max-w-md">
              Pas de plateforme anonyme : un échange direct avec l'éleveur, du premier
              message jusqu'à l'arrivée de votre lapin chez vous.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass rounded-2xl p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-display text-xl font-extrabold text-caramel/40">{f.num}</span>
                  <span className="text-caramel">{f.icon}</span>
                </div>
                <h3 className="font-display font-bold text-white text-sm mb-1.5">{f.title}</h3>
                <p className="text-white/35 text-xs leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Colonne droite — mosaïque photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 gap-3 h-[420px]"
        >
          <div className="relative rounded-2xl overflow-hidden row-span-2">
            <img src={GALLERY[0]} alt="Lapin Lapinou" className="absolute inset-0 w-full h-full object-cover" />
          </div>
          <div className="relative rounded-2xl overflow-hidden">
            <img src={GALLERY[1]} alt="Lapin Lapinou" className="absolute inset-0 w-full h-full object-cover" />
          </div>
          <div className="relative rounded-2xl overflow-hidden">
            <img src={GALLERY[2]} alt="Lapin Lapinou" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-espresso/70 to-transparent flex items-end p-4">
              <span className="text-white text-xs font-semibold">+ de photos sur chaque fiche</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
