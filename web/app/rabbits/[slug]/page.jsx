// web/app/rabbits/[slug]/page.jsx
// Page détail — inspirée de la mise en page AnnonceDetailClient de Nexura
// (breadcrumb, galerie+lightbox, colonne sticky CTA, partage, similaires)
// adaptée à la vente de lapins : pas de KYC/vendeur tiers/caution/carte —
// fusionné avec les détails et la carte GPS interactive.

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Sparkles, MessageCircleHeart, ShieldCheck, Stethoscope } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import RabbitGallery from '@/components/RabbitGallery'
import SharePanel from '@/components/SharePanel'
import SimilarRabbits from '@/components/SimilarRabbits'
import ReserveButton from '@/components/ReserveButton'
import { isUnavailable, formatPrice, GENDER_LABEL, resolvePhotoUrl } from '@/lib/status'
import dynamic from 'next/dynamic'

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false })

const API_URL  = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || ''

// SSR — revalidation toutes les 60s pour avoir le statut frais
export const revalidate = 60

async function getRabbit(slug) {
  const res = await fetch(`${API_URL}/rabbits/${slug}`, { next: { revalidate: 60 } })
  if (res.status === 404) return null
  if (!res.ok) throw new Error('Erreur API')
  return res.json()
}

export async function generateMetadata({ params }) {
  const rabbit = await getRabbit(params.slug)
  if (!rabbit) return { title: 'Introuvable' }
  return {
    title:       `${rabbit.name} — ${rabbit.breed} | CHEZ FLORENCE`,
    description: rabbit.description || `${rabbit.name}, ${rabbit.breed} à ${formatPrice(rabbit.price)}`,
  }
}

export default async function RabbitDetailPage({ params }) {
  const rabbit = await getRabbit(params.slug)
  if (!rabbit) notFound()

  const unavailable = isUnavailable(rabbit)
  // resolvePhotoUrl gère les 2 cas :
  //  - URL Cloudinary absolue (https://res.cloudinary.com/...) → retournée telle quelle
  //  - Ancien chemin relatif local (/uploads/xxx.jpg) → préfixé par l'API
  const photos = [...(rabbit.photos || [])]
    .sort((a, b) => a.position - b.position)
    .map(p => resolvePhotoUrl(p.url))
    .filter(Boolean)

  const specs = [
    { label: 'Nom',       value: rabbit.name },
    { label: 'Race',      value: rabbit.breed },
    { label: 'Genre',     value: GENDER_LABEL[rabbit.gender] },
    {
      label: 'Stock',
      value: unavailable ? 'Épuisé' : `${rabbit.stock} disponible${rabbit.stock > 1 ? 's' : ''}`,
      isStatus: true
    },
    { label: 'Localisation', value: "Azaguié Gare, Côte d'Ivoire", isFull: true },
    rabbit.color  && { label: 'Couleur',   value: rabbit.color },
    rabbit.weight && { label: 'Poids',     value: `${rabbit.weight} kg` },
    rabbit.birthDate && { label: 'Naissance', value: new Date(rabbit.birthDate).toLocaleDateString('fr-FR') },
  ].filter(Boolean)

  return (
    <main className="min-h-screen overflow-x-clip" style={{ backgroundColor: 'var(--maroon)', color: 'var(--paper)' }}>
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-10">

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-[11px] text-white/35 mb-6 flex-wrap">
          <Link href="/" className="hover:text-white/60 transition-colors">Accueil</Link>
          <ChevronRight size={12} className="text-white/20" />
          <Link href="/#lapins" className="hover:text-white/60 transition-colors">Lapins</Link>
          <ChevronRight size={12} className="text-white/20" />
          <span className="text-white/65 font-semibold truncate max-w-[160px]">{rabbit.name}</span>
        </div>

        {/* Hero grid — galerie / infos+CTA. Desktop : split-pane, la
            galerie reste fixe pendant que la colonne infos défile toute
            seule dans son propre conteneur (comme Nexura). Mobile :
            inchangé, les deux colonnes s'empilent et défilent avec la page. */}
        <div className="grid lg:grid-cols-2 gap-10 items-start lg:h-[calc(100vh-7rem)]">

          {/* Colonne gauche — Galerie (fixe sur desktop) */}
          <div className="flex flex-col gap-2 lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)]">
            <RabbitGallery photos={photos} title={rabbit.name} unavailable={unavailable} stock={rabbit.stock} />
          </div>

          {/* Colonne droite — Infos + CTA (défile seule sur desktop) */}
          <div className="flex flex-col lg:h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pr-2">

            {/* Titre */}
            <h1 className="uppercase text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-2" style={{ fontFamily: 'var(--font-pixel)' }}>
              {rabbit.name}
            </h1>
            <p className="text-white/40 text-sm mb-5">Azaguié Gare, Côte d'Ivoire</p>

            <div className="h-px bg-brand-border mb-5" />

            {/* Grille Prix & Réservation */}
            <div className="bg-[rgba(243,233,218,0.06)] border border-[rgba(243,233,218,0.14)] rounded-2xl p-5 mb-5">
              <div className="grid grid-cols-2 gap-4 items-center">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-white/35 mb-1">Prix de vente</div>
                  <div className={`font-display text-2xl sm:text-3xl font-extrabold ${unavailable ? 'text-white/30' : 'text-caramel'}`}>
                    {formatPrice(rabbit.price)}
                  </div>
                  {rabbit.priceNote && (
                    <p className="text-white/35 text-[10px] italic mt-1">{rabbit.priceNote}</p>
                  )}
                </div>
                <div>
                  {!unavailable ? (
                    <ReserveButton
                      slug={rabbit.slug}
                      rabbitName={rabbit.name}
                      rabbitPrice={rabbit.price}
                      breed={rabbit.breed}
                      stock={rabbit.stock}
                    />
                  ) : (
                    <button
                      disabled
                      className="w-full py-3 px-4 rounded-xl bg-[rgba(243,233,218,0.08)] text-[rgba(243,233,218,0.35)] font-bold text-xs cursor-not-allowed text-center"
                    >
                      Stock épuisé
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Garanties */}
            <div className="flex gap-2 flex-wrap mb-5">
              {[
                { icon: <Stethoscope size={12} />, txt: 'Suivi vétérinaire' },
                { icon: <MessageCircleHeart size={12} />, txt: 'Contact direct' },
                { icon: <ShieldCheck size={12} />, txt: 'Rendez-vous sécurisé' },
              ].map((g, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 text-[11px] text-white/40 bg-[rgba(243,233,218,0.06)] border border-[rgba(243,233,218,0.14)] rounded-full px-3 py-1.5">
                  <span className="text-caramel">{g.icon}</span>
                  {g.txt}
                </span>
              ))}
            </div>

            {/* Informations Détaillées (Fusionnées ici) */}
            <div className="bg-[rgba(243,233,218,0.06)] border border-[rgba(243,233,218,0.14)] rounded-2xl p-6 mb-5 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-brand-border/55">
                <span className="text-[11px] font-bold uppercase tracking-widest text-white/45">
                  Informations détaillées
                </span>
              </div>
              
              {rabbit.description && (
                <div className="space-y-2">
                  <h2 className="font-display font-bold text-white text-sm uppercase tracking-wide flex items-center gap-2">
                    <Sparkles size={14} className="text-caramel" /> À propos
                  </h2>
                  <p className="text-white/55 text-sm leading-relaxed whitespace-pre-line">{rabbit.description}</p>
                </div>
              )}

              <div className="space-y-3">
                <h2 className="font-display font-bold text-white text-sm uppercase tracking-wide flex items-center gap-2">
                  <Sparkles size={14} className="text-caramel" /> Caractéristiques
                </h2>
                <dl className="grid grid-cols-2 gap-3">
                  {specs.map(({ label, value, isStatus, isFull }) => (
                    <div 
                      key={label} 
                      className={`bg-[rgba(243,233,218,0.04)] border border-[rgba(243,233,218,0.1)] rounded-xl px-3.5 py-2.5 ${isFull ? 'col-span-2' : ''}`}
                    >
                      <dt className="text-[10px] text-white/35 uppercase tracking-wide mb-0.5">{label}</dt>
                      <dd className={`text-xs font-semibold ${isStatus ? (unavailable ? 'text-terracotta' : 'text-sage') : 'text-white/85'}`}>
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {/* Localisation du Coin Lapin & GPS */}
            <div className="mb-5">
              <MapView />
            </div>

            {/* Partage */}
            <SharePanel rabbit={rabbit} siteUrl={SITE_URL} />
          </div>
        </div>

        {/* Section bas — similaires */}
        <div className="mt-14">
          <div className="h-px bg-gradient-to-r from-transparent via-[rgba(243,233,218,0.15)] to-transparent mb-10" />
          <SimilarRabbits currentSlug={rabbit.slug} breed={rabbit.breed} />
        </div>
      </div>

      <Footer />
    </main>
  )
}
