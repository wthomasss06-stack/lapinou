// web/components/RabbitCard.jsx
// Carte fiche-race — grisée (overlay + opacité) quand le stock est épuisé

'use client'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { MapPin, PawPrint } from 'lucide-react'
import { isUnavailable, formatPrice, GENDER_LABEL, resolvePhotoUrl } from '@/lib/status'

function RabbitImage({ rabbit, unavailable }) {
  const mainPhoto = rabbit.photos?.find(p => p.isMain) || rabbit.photos?.[0]
  const src = mainPhoto ? resolvePhotoUrl(mainPhoto.url) : null

  return (
    <div className="relative h-52 overflow-hidden bg-brand-darker">
      {src ? (
        <Image
          src={src}
          alt={rabbit.name}
          fill
          className={`object-cover transition-all duration-700 ${
            unavailable ? 'grayscale opacity-50' : 'group-hover:scale-110'
          }`}
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-card to-brand-darker">
          <PawPrint size={40} className="text-white/20" />
        </div>
      )}

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-card via-transparent to-transparent opacity-60" />

      {/* Badge stock */}
      {unavailable ? (
        <div className="absolute top-3 left-3">
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider bg-white/10 backdrop-blur-sm text-white border border-white/20">
            Stock épuisé
          </span>
        </div>
      ) : (
        <div className="absolute top-3 left-3">
          <span className="bg-sage text-espresso text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            {rabbit.stock} en stock
          </span>
        </div>
      )}

      {/* Prix */}
      <div className="absolute bottom-3 right-3 glass px-3 py-1.5 rounded-full">
        <span className={`font-display font-bold text-sm ${unavailable ? 'text-white/40' : 'text-caramel'}`}>
          {formatPrice(rabbit.price)}
        </span>
      </div>
    </div>
  )
}

export default function RabbitCard({ rabbit, index = 0, layout = 'grid' }) {
  const unavailable = isUnavailable(rabbit)

  if (layout === 'list') {
    const mainPhoto = rabbit.photos?.find(p => p.isMain) || rabbit.photos?.[0]
    const src = mainPhoto ? resolvePhotoUrl(mainPhoto.url) : null

    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-30px' }}
        transition={{ duration: 0.5, delay: index * 0.05 }}
      >
        <Link href={`/rabbits/${rabbit.slug}`} className={unavailable ? 'pointer-events-none' : ''} aria-disabled={unavailable}>
          <div className="card-glow bg-brand-card rounded-2xl overflow-hidden group flex items-center gap-4 p-3">
            {/* Thumbnail */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-brand-darker shrink-0">
              {src ? (
                <Image
                  src={src}
                  alt={rabbit.name}
                  fill
                  className={`object-cover ${unavailable ? 'grayscale opacity-50' : ''}`}
                  sizes="96px"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <PawPrint size={24} className="text-white/20" />
                </div>
              )}
            </div>

            {/* Infos */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[9px] font-mono uppercase tracking-widest text-caramel/70 bg-caramel/10 px-2 py-0.5 rounded-full shrink-0">
                  {rabbit.breed}
                </span>
                {unavailable ? (
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-white/10 text-white/40">
                    Stock épuisé
                  </span>
                ) : (
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-sage/20 text-sage">
                    {rabbit.stock} en stock
                  </span>
                )}
              </div>
              <h3 className={`font-display font-bold text-sm truncate ${unavailable ? 'text-white/40' : 'text-white group-hover:text-caramel'} transition-colors`}>
                {rabbit.name}
              </h3>
              <div className="flex items-center gap-2 text-white/35 text-[11px] mt-1">
                <span>{GENDER_LABEL[rabbit.gender]}</span>
                {rabbit.color && <span>· {rabbit.color}</span>}
              </div>
            </div>

            {/* Prix */}
            <div className="text-right shrink-0">
              <div className={`font-display font-bold text-sm ${unavailable ? 'text-white/30' : 'text-caramel'}`}>
                {formatPrice(rabbit.price)}
              </div>
              <div className="text-[10px] text-white/25 mt-0.5 hidden sm:block">{rabbit.priceNote || 'Prix net'}</div>
            </div>
          </div>
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href={`/rabbits/${rabbit.slug}`}
        className={unavailable ? 'pointer-events-none' : ''}
        aria-disabled={unavailable}
      >
        <motion.div
          className="card-glow bg-brand-card rounded-2xl overflow-hidden group cursor-pointer"
          whileHover={unavailable ? {} : { y: -8 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <RabbitImage rabbit={rabbit} unavailable={unavailable} />

          <div className="p-4">
            {/* Race + genre */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-caramel/70 bg-caramel/10 px-2 py-0.5 rounded-full">
                {rabbit.breed}
              </span>
              <span className="text-[11px] text-white/40 flex items-center gap-1">
                <MapPin size={10} />
                Azaguié Gare
              </span>
            </div>

            {/* Nom */}
            <h3 className={`font-display font-bold text-base mb-2 line-clamp-1 transition-colors ${
              unavailable ? 'text-white/40' : 'text-white group-hover:text-caramel'
            }`}>
              {rabbit.name}
            </h3>

            {/* Specs */}
            <div className="flex items-center gap-3 text-white/40 text-xs mb-3">
              <span>{GENDER_LABEL[rabbit.gender]}</span>
              {rabbit.weight && <span>· {rabbit.weight} kg</span>}
              {rabbit.color && <span>· {rabbit.color}</span>}
            </div>

            {/* CTA */}
            <div className="flex items-center justify-between pt-3 border-t border-brand-border">
              <span className="text-[11px] text-white/30">
                {rabbit.priceNote || 'Prix net'}
              </span>
              <motion.span
                className="text-xs text-caramel font-medium opacity-0 group-hover:opacity-100 flex items-center gap-1"
                transition={{ duration: 0.2 }}
              >
                Voir détails →
              </motion.span>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}
