'use client'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

const TESTIMONIALS = [
  { name: 'Adjoua K.', role: 'Cocody', av: 'A', color: '#B8834A', text: "Mon Bélier nain est arrivé en pleine forme. L'échange WhatsApp avec l'éleveur a tout simplifié." },
  { name: 'Kouamé D.', role: 'Marcory', av: 'K', color: '#C2693D', text: "Réservation faite en deux minutes, rendez-vous fixé le lendemain. Très sérieux." },
  { name: 'Fatou B.', role: 'Yopougon', av: 'F', color: '#7C8B6F', text: "Le suivi vétérinaire m'a rassurée. Mon Rex est en pleine santé depuis 6 mois." },
  { name: 'Yao T.', role: 'Cocody', av: 'Y', color: '#B8834A', text: "Photos fidèles à la réalité, prix annoncé respecté. Exactement ce qu'il fallait." },
  { name: 'Mariam S.', role: 'Bingerville', av: 'M', color: '#C2693D', text: "Mon Angora français est magnifique. L'éleveur a même donné des conseils d'entretien." },
  { name: 'Issa K.', role: 'Treichville', av: 'I', color: '#7C8B6F', text: "Premier achat de lapin et tout s'est très bien passé. Je recommande Lapinou." },
]

export default function TestimonialsSection() {
  const track = [...TESTIMONIALS, ...TESTIMONIALS]

  return (
    <section className="py-24 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-caramel font-mono text-xs tracking-widest uppercase mb-3">Avis clients</p>
          <h2 className="font-display text-4xl lg:text-5xl font-extrabold text-white">
            Ils ont <span className="text-gradient">adopté chez nous</span>
          </h2>
          <p className="text-white/40 mt-4 max-w-md mx-auto text-sm">
            À Abidjan, en toute confiance.
          </p>
        </motion.div>
      </div>

      {/* Carrousel défilant infini */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-r from-brand-dark to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-l from-brand-dark to-transparent pointer-events-none" />

        <div className="flex gap-4 w-max py-2 px-6 testi-track">
          {track.map((t, i) => (
            <div
              key={i}
              className="shrink-0 w-[280px] sm:w-[320px] bg-brand-card border border-brand-border rounded-2xl p-5 flex flex-col"
            >
              <div className="flex gap-0.5 mb-3">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} size={12} fill="#B8834A" stroke="none" />
                ))}
              </div>
              <p className="text-white/70 text-sm leading-relaxed italic mb-4 flex-1">
                "{t.text}"
              </p>
              <div className="flex items-center gap-2.5 border-t border-brand-border pt-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center font-display font-bold text-sm shrink-0"
                  style={{ background: `${t.color}22`, border: `2px solid ${t.color}44`, color: t.color }}
                >
                  {t.av}
                </div>
                <div className="min-w-0">
                  <div className="font-display font-bold text-white text-xs">{t.name}</div>
                  <div className="text-white/35 text-[11px] mt-0.5">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .testi-track {
          animation: testi-scroll 30s linear infinite;
        }
        .testi-track:hover {
          animation-play-state: paused;
        }
        @keyframes testi-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  )
}
