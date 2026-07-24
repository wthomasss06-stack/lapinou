'use client'
import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import Navbar from '@/components/Navbar'
import CustomCursor from '@/components/CustomCursor'
import Footer from '@/components/Footer'
import HoverFadeText from '@/components/HoverFadeText'
import RainbowText from '@/components/RainbowText'
import { CATEGORIES, AIDE_FAQS as FAQS } from '@/lib/aide-faq-data'
import '@/app/aide/aide.css'

// Logique interactive de /aide (recherche + filtres par catégorie + accordéon).
// Séparé de app/aide/page.tsx pour que la page redevienne un server component
// capable d'exporter `metadata` et le schema JSON-LD FAQPage — un composant
// 'use client' ne peut pas exporter `metadata` en App Router.
export default function AideContent() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('Tout')
  const [openKey, setOpenKey] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return FAQS.filter((f) => {
      const matchesCategory = category === 'Tout' || f.category === category
      const matchesQuery = !q || f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q)
      return matchesCategory && matchesQuery
    })
  }, [query, category])

  const grouped = useMemo(() => {
    const map = new Map<string, typeof FAQS>()
    for (const item of filtered) {
      if (!map.has(item.category)) map.set(item.category, [])
      map.get(item.category)!.push(item)
    }
    return Array.from(map.entries())
  }, [filtered])

  return (
    <div className="aide-page">
      <Navbar />
      <CustomCursor />
      <main>
        <section className="page-hero">
          <div className="eyebrow">Centre d&apos;Aide</div>
          <h1 className="page-title">Comment Pouvons-Nous Vous Aider ?</h1>
          <RainbowText
            text="Trouvez rapidement les réponses à vos questions sur l'achat, la livraison et l'élevage de lapins à Abidjan."
            variant="white"
            className="page-sub"
          />

          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Rechercher une question..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="faq-categories">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`cat-pill${category === cat ? ' active' : ''}`}
                onClick={() => setCategory(cat)}
              >
                <HoverFadeText>{cat}</HoverFadeText>
              </button>
            ))}
          </div>
        </section>

        <section className="faq-section">
          {grouped.length === 0 ? (
            <p className="no-results">Aucune question ne correspond à votre recherche.</p>
          ) : (
            grouped.map(([cat, items]) => (
              <div className="faq-category" key={cat}>
                <h2 className="cat-title">{cat}</h2>
                {items.map((item) => {
                  const key = `${item.category}-${item.q}`
                  const isOpen = openKey === key
                  return (
                    <div className="faq-item" key={key}>
                      <button
                        type="button"
                        className={`faq-question${isOpen ? ' active' : ''}`}
                        onClick={() => setOpenKey(isOpen ? null : key)}
                        aria-expanded={isOpen}
                      >
                        <HoverFadeText>{item.q}</HoverFadeText>
                        <span className="faq-icon">{isOpen ? '\u2212' : '+'}</span>
                      </button>
                      <div className={`faq-answer${isOpen ? ' open' : ''}`}>{item.a}</div>
                    </div>
                  )
                })}
              </div>
            ))
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}
