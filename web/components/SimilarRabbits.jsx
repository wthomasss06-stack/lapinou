'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Sparkles, ArrowRight } from 'lucide-react'
import RabbitCard from './RabbitCard'
import { rabbitsApi } from '@/lib/api'

function SimCardSkeleton() {
  return (
    <div className="bg-brand-card rounded-2xl overflow-hidden animate-pulse">
      <div className="h-52 bg-brand-border/30" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-brand-border/30 rounded w-2/3" />
        <div className="h-3 bg-brand-border/30 rounded w-1/2" />
      </div>
    </div>
  )
}

export default function SimilarRabbits({ currentSlug, breed }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!breed) { setLoading(false); return }

    rabbitsApi.list({ breed })
      .then(r => {
        const list = (r.results || []).filter(a => a.slug !== currentSlug)
        // mélange léger pour varier l'affichage
        for (let i = list.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[list[i], list[j]] = [list[j], list[i]]
        }
        setItems(list.slice(0, 3))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [currentSlug, breed])

  if (!loading && items.length === 0) return null

  return (
    <div className="mt-16">
      <div className="flex items-end justify-between gap-4 flex-wrap mb-7">
        <div>
          <div className="inline-flex items-center gap-1.5 text-white/35 text-[10px] font-bold uppercase tracking-widest mb-2">
            <Sparkles size={12} className="text-caramel" />
            Vous pourriez aimer
          </div>
          <h2 className="font-display text-2xl font-extrabold text-white">
            Lapins similaires
            <span className="ml-2.5 text-[10px] font-bold uppercase tracking-wider bg-caramel/10 border border-caramel/20 text-caramel px-2.5 py-1 rounded-full align-middle">
              {breed}
            </span>
          </h2>
        </div>
        <Link href="/rabbits" className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/50 hover:text-white border border-brand-border rounded-full px-4 py-2 transition-colors">
          Voir tout <ArrowRight size={12} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading
          ? [1, 2, 3].map(i => <SimCardSkeleton key={i} />)
          : items.map((rabbit, i) => <RabbitCard key={rabbit.id} rabbit={rabbit} index={i} />)
        }
      </div>
    </div>
  )
}
