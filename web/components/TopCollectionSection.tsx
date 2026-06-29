'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { TrendingUp, MapPin } from 'lucide-react'
import { rabbitsApi } from '@/lib/api'
import { formatPrice, resolvePhotoUrl } from '@/lib/status'

export default function TopCollectionSection() {
  const [rabbits, setRabbits] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    rabbitsApi.list({ status: 'available' })
      .then(r => setRabbits((r.results || []).slice(0, 9)))
      .catch(() => setRabbits([]))
      .finally(() => setLoading(false))
  }, [])

  if (!loading && rabbits.length === 0) return null

  return (
    <section className="py-24 px-6 relative">
      <div className="absolute inset-0 bg-gradient-radial from-caramel/5 via-transparent to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-caramel font-mono text-xs tracking-widest uppercase mb-3">Disponibilités</p>
          <h2 className="font-display text-4xl lg:text-5xl font-extrabold text-white">
            Les Lapins <span className="text-gradient">Disponibles</span>
          </h2>
          <p className="text-white/40 mt-4 max-w-lg mx-auto text-sm">
            Liste actualisée de nos lapins prêts à rejoindre un nouveau foyer.
          </p>
        </motion.div>

        {/* 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {rabbits.map((rabbit, i) => {
            const rank = i + 1
            const rankColors = ['text-yellow-400', 'text-slate-300', 'text-amber-600']
            const rankColor = rank <= 3 ? rankColors[rank - 1] : 'text-white/20'
            const mainPhoto = rabbit.photos?.find(p => p.isMain) || rabbit.photos?.[0]
            const photoSrc = mainPhoto ? resolvePhotoUrl(mainPhoto.url) : null

            return (
              <motion.div
                key={rabbit.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
              >
                <Link href={`/rabbits/${rabbit.slug}`}>
                  <motion.div
                    className="glass rounded-xl p-4 flex items-center gap-4 cursor-pointer group hover:border-caramel/25 transition-all duration-300"
                    whileHover={{ x: 4 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  >
                    {/* Rank */}
                    <span className={`font-display font-extrabold text-2xl w-8 shrink-0 ${rankColor}`}>
                      {String(rank).padStart(2, '0')}
                    </span>

                    {/* Thumbnail */}
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-brand-darker shrink-0 border-2 border-brand-border group-hover:border-caramel/40 transition-colors">
                      {photoSrc ? (
                        <Image src={photoSrc} alt={rabbit.name} width={48} height={48} className="object-cover w-full h-full" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-brand-card to-brand-darker flex items-center justify-center text-lg">
                          🐇
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-semibold truncate group-hover:text-caramel transition-colors">
                        {rabbit.name}
                      </p>
                      <p className="text-white/35 text-xs flex items-center gap-1 mt-0.5">
                        <MapPin size={9} /> {rabbit.breed}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="text-right shrink-0">
                      <p className="text-caramel font-bold text-sm font-display">
                        {formatPrice(rabbit.price)}
                      </p>
                      {rank <= 3 && (
                        <motion.div
                          className="flex items-center gap-0.5 text-[10px] text-caramel/60 mt-0.5 justify-end"
                          animate={{ opacity: [0.6, 1, 0.6] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <TrendingUp size={9} />
                          <span>Populaire</span>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
