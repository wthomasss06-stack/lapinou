'use client'
import { motion } from 'framer-motion'
import { Stethoscope, HeartHandshake, MessageCircle, Home } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const values = [
  { icon: <Stethoscope size={24} />, title: 'Santé', desc: 'Chaque lapin est suivi par un vétérinaire avant son adoption.' },
  { icon: <HeartHandshake size={24} />, title: 'Confiance', desc: 'Un échange direct avec l\'éleveur, sans intermédiaire anonyme.' },
  { icon: <MessageCircle size={24} />, title: 'Disponibilité', desc: 'Nous répondons à vos questions sur WhatsApp, avant et après l\'adoption.' },
  { icon: <Home size={24} />, title: 'Confort', desc: 'Des lapins élevés dans un environnement calme et adapté.' },
]

export default function AboutPage() {
  return (
    <main>
      <Navbar />
      <div className="min-h-screen pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <p className="text-caramel font-mono text-xs tracking-widest uppercase mb-3">Notre Histoire</p>
            <h1 className="font-display text-5xl font-extrabold text-white mb-6">
              À Propos de <span className="text-gradient">Lapinou</span>
            </h1>
            <p className="text-white/50 leading-relaxed max-w-2xl mx-auto">
              Lapinou est né d'une passion pour l'élevage de lapins de race à Abidjan.
              Notre objectif : rendre l'adoption simple, transparente, et accompagnée
              du début à la fin — du premier message WhatsApp jusqu'à l'arrivée de
              votre lapin chez vous.
            </p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div key={v.title} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass rounded-2xl p-6 text-center">
                <div className="text-caramel mb-3 flex justify-center">{v.icon}</div>
                <h3 className="font-display font-bold text-white mb-2">{v.title}</h3>
                <p className="text-white/40 text-xs">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
