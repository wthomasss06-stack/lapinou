'use client'
import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal, LayoutGrid, List, SearchX, Search, X } from 'lucide-react'
import RabbitCard from './RabbitCard'
import { rabbitsApi } from '@/lib/api'

const BREED_TABS = [
  { id: 'all', name: 'Tous' },
  { id: 'Bélier nain', name: 'Béliers nains' },
  { id: 'Rex', name: 'Rex' },
  { id: 'Angora français', name: 'Angoras' },
  { id: 'Géant des Flandres', name: 'Géants' },
  { id: 'Hollandais', name: 'Hollandais' },
]

export default function RabbitsSection() {
  const [rabbits, setRabbits] = useState([])
  const [activeBreed, setActiveBreed] = useState('all')
  const [query, setQuery] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'list'
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const debounceRef = useRef(null)

  useEffect(() => {
    setLoading(true)
    setError(false)
    const params: Record<string, string> = {}
    if (activeBreed !== 'all') params.breed = activeBreed
    if (query.trim()) params.search = query.trim()

    rabbitsApi.list(params)
      .then(r => setRabbits(r.results || []))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [activeBreed, query])

  function handleSearchInput(val) {
    setInputValue(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => setQuery(val), 400)
  }

  function clearSearch() {
    setInputValue('')
    setQuery('')
  }

  return (
    <section id="lapins" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-caramel font-mono text-xs tracking-widest uppercase mb-3">
              Nos Lapins
            </p>
            <h2 className="font-display text-4xl lg:text-5xl font-extrabold text-white leading-tight">
              Une famille de
              <br />
              <span className="text-gradient">Lapins de Race</span>
            </h2>
            <p className="text-white/40 mt-4 max-w-md text-sm leading-relaxed">
              Chaque lapin est élevé avec soin, suivi par notre équipe, et prêt à
              rejoindre votre foyer dans les meilleures conditions.
            </p>
          </motion.div>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative w-full max-w-xs"
          >
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              value={inputValue}
              onChange={e => handleSearchInput(e.target.value)}
              placeholder="Rechercher un lapin…"
              className="input-dark w-full pl-9 pr-9 py-2.5 rounded-xl text-sm"
            />
            {inputValue && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70"
              >
                <X size={13} />
              </button>
            )}
          </motion.div>
        </div>

        {/* Filtres + vue */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          {/* Race tabs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 flex-wrap"
          >
            {BREED_TABS.map(tab => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveBreed(tab.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeBreed === tab.id
                    ? 'bg-caramel text-espresso font-bold'
                    : 'glass text-white/60 hover:text-white border border-brand-border hover:border-caramel/30'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tab.name}
              </motion.button>
            ))}
          </motion.div>

          {/* Vue grille/liste */}
          <div className="flex items-center gap-1 glass rounded-xl p-1 border border-brand-border shrink-0">
            {[
              { mode: 'grid', icon: LayoutGrid },
              { mode: 'list', icon: List },
            ].map(({ mode, icon: Icon }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                aria-label={mode === 'grid' ? 'Vue grille' : 'Vue liste'}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  viewMode === mode ? 'bg-caramel/15 text-caramel' : 'text-white/35 hover:text-white/60'
                }`}
              >
                <Icon size={15} />
              </button>
            ))}
          </div>
        </div>

        {/* Compteur résultats */}
        {!loading && !error && (
          <p className="text-white/35 text-xs mb-6">
            <strong className="text-caramel font-semibold">{rabbits.length}</strong>{' '}
            lapin{rabbits.length !== 1 ? 's' : ''} trouvé{rabbits.length !== 1 ? 's' : ''}
            {query && <> pour « {query} »</>}
          </p>
        )}

        {/* Grid / List */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-brand-card rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-52 bg-brand-border/30" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-brand-border/30 rounded w-2/3" />
                    <div className="h-3 bg-brand-border/30 rounded w-1/2" />
                    <div className="h-3 bg-brand-border/30 rounded w-3/4" />
                  </div>
                </div>
              ))}
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 text-white/40 text-sm"
            >
              Impossible de charger les lapins pour le moment. Réessayez plus tard.
            </motion.div>
          ) : rabbits.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 glass rounded-2xl"
            >
              <SearchX size={36} className="text-white/15 mx-auto mb-4" />
              <h3 className="font-display font-bold text-white mb-1">Aucun lapin trouvé</h3>
              <p className="text-white/35 text-sm">Modifiez vos filtres ou revenez plus tard.</p>
            </motion.div>
          ) : (
            <motion.div
              key={`${activeBreed}-${viewMode}-${query}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className={viewMode === 'list'
                ? 'flex flex-col gap-4'
                : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              }
            >
              {rabbits.map((rabbit, i) => (
                <RabbitCard key={rabbit.id} rabbit={rabbit} index={i} layout={viewMode} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
