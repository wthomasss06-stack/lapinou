'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, ChevronDown } from 'lucide-react'

const BREEDS = ['Toutes les races', 'Bélier nain', 'Rex', 'Angora français', 'Hollandais']

export default function SearchBar() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [breed, setBreed] = useState(BREEDS[0])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    if (breed !== BREEDS[0]) params.set('breed', breed)
    router.push(`/rabbits${params.toString() ? `?${params}` : ''}`)
  }

  return (
    <div className="relative z-30 px-6 -mt-7">
      <form
        onSubmit={handleSearch}
        className="max-w-3xl mx-auto glass rounded-2xl shadow-2xl shadow-black/40 flex flex-col sm:flex-row items-stretch overflow-hidden"
      >
        {/* Recherche texte */}
        <div className="flex-1 px-5 py-3.5 flex items-center gap-3 border-b sm:border-b-0 sm:border-r border-white/10">
          <Search size={16} className="text-white/30 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Chercher un lapin par nom, couleur…"
            className="bg-transparent outline-none text-sm text-white placeholder:text-white/30 w-full"
          />
        </div>

        {/* Sélecteur race */}
        <div className="relative flex-1 sm:flex-none sm:w-48 px-5 py-3.5 flex items-center gap-2">
          <select
            value={breed}
            onChange={e => setBreed(e.target.value)}
            className="bg-transparent outline-none text-sm text-white w-full appearance-none cursor-pointer"
          >
            {BREEDS.map(b => (
              <option key={b} value={b} className="bg-brand-card text-white">{b}</option>
            ))}
          </select>
          <ChevronDown size={14} className="text-white/30 absolute right-5 pointer-events-none" />
        </div>

        {/* Bouton */}
        <button
          type="submit"
          className="btn-neon px-7 py-3.5 text-sm flex items-center justify-center gap-2 shrink-0"
        >
          <Search size={15} />
          <span className="sm:hidden">Chercher</span>
          <span className="hidden sm:inline">Chercher</span>
        </button>
      </form>
    </div>
  )
}
