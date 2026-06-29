// web/app/rabbits/[slug]/page.jsx
// Page détail — inspirée de la mise en page AnnonceDetailClient de Nexura
// (breadcrumb, galerie+lightbox, colonne sticky CTA, partage, similaires)
// adaptée à la vente de lapins : pas de KYC/vendeur tiers/caution/carte —
// remplacé par le formulaire de réservation direct + contact WhatsApp.

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Sparkles, MessageCircleHeart, ShieldCheck, Stethoscope, Lock, BadgeCheck } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ReservationForm from '@/components/ReservationForm'
import RabbitGallery from '@/components/RabbitGallery'
import SharePanel from '@/components/SharePanel'
import SimilarRabbits from '@/components/SimilarRabbits'
import { STATUS_LABEL, isUnavailable, formatPrice, GENDER_LABEL } from '@/lib/status'
import dynamic from 'next/dynamic'

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false })

const API_URL  = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
const MEDIA    = API_URL.replace('/api', '')
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
    title:       `${rabbit.name} — ${rabbit.breed} | Lapinou`,
    description: rabbit.description || `${rabbit.name}, ${rabbit.breed} à ${formatPrice(rabbit.price)}`,
  }
}

export default async function RabbitDetailPage({ params }) {
  const rabbit = await getRabbit(params.slug)
  if (!rabbit) notFound()

  const unavailable = isUnavailable(rabbit)
  const photos = [...(rabbit.photos || [])]
    .sort((a, b) => a.position - b.position)
    .map(p => `${MEDIA}${p.url}`)

  const specs = [
    { label: 'Race',   value: rabbit.breed },
    { label: 'Genre',  value: GENDER_LABEL[rabbit.gender] },
    rabbit.color  && { label: 'Couleur',   value: rabbit.color },
    rabbit.weight && { label: 'Poids',     value: `${rabbit.weight} kg` },
    rabbit.birthDate && { label: 'Naissance', value: new Date(rabbit.birthDate).toLocaleDateString('fr-FR') },
  ].filter(Boolean)

  return (
    <main className="min-h-screen overflow-x-clip">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-10">

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-[11px] text-white/35 mb-6 flex-wrap">
          <Link href="/" className="hover:text-white/60 transition-colors">Accueil</Link>
          <ChevronRight size={12} className="text-white/20" />
          <Link href="/rabbits" className="hover:text-white/60 transition-colors">Lapins</Link>
          <ChevronRight size={12} className="text-white/20" />
          <span className="text-white/65 font-semibold truncate max-w-[160px]">{rabbit.name}</span>
        </div>

        {/* Hero grid — galerie / infos+CTA */}
        <div className="grid lg:grid-cols-2 gap-10 items-start">

          {/* Colonne gauche — Galerie */}
          <div className="flex flex-col gap-2">
            <RabbitGallery photos={photos} title={rabbit.name} unavailable={unavailable} status={rabbit.status} />
          </div>

          {/* Colonne droite — Infos + CTA (sticky desktop) */}
          <div className="lg:sticky lg:top-24 flex flex-col">

            {/* Badges */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-card border border-brand-border text-xs font-semibold text-white/55">
                <span className="w-1.5 h-1.5 rounded-full bg-caramel" />
                {rabbit.breed}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-card border border-brand-border text-xs font-semibold text-white/55">
                <span className={`w-2 h-2 rounded-full ${rabbit.gender === 'male' ? 'bg-sky-400' : 'bg-pink-400'}`} />
                {GENDER_LABEL[rabbit.gender]}
              </span>
              {!unavailable && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sage/15 border border-sage/25 text-xs font-bold text-sage">
                  <span className="w-1.5 h-1.5 rounded-full bg-sage animate-pulse" />
                  Disponible
                </span>
              )}
            </div>

            {/* Titre */}
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-2">
              {rabbit.name}
            </h1>
            <p className="text-white/40 text-sm mb-5">Azaguié Gare, Côte d'Ivoire</p>

            <div className="h-px bg-brand-border mb-5" />

            {/* Prix */}
            <div className="mb-5">
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/35 mb-1.5">Prix de vente</div>
              <div className={`font-display text-3xl sm:text-4xl font-extrabold ${unavailable ? 'text-white/30' : 'text-caramel'}`}>
                {formatPrice(rabbit.price)}
              </div>
              {rabbit.priceNote && (
                <p className="text-white/35 text-xs italic mt-1.5">{rabbit.priceNote}</p>
              )}
            </div>

            {/* Garanties (équivalent simplifié du bandeau Nexura) */}
            <div className="flex gap-2 flex-wrap mb-5">
              {[
                { icon: <Stethoscope size={12} />, txt: 'Suivi vétérinaire' },
                { icon: <MessageCircleHeart size={12} />, txt: 'Contact direct' },
                { icon: <ShieldCheck size={12} />, txt: 'Rendez-vous sécurisé' },
              ].map((g, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 text-[11px] text-white/40 bg-brand-card border border-brand-border rounded-full px-3 py-1.5">
                  <span className="text-caramel">{g.icon}</span>
                  {g.txt}
                </span>
              ))}
            </div>

            {/* Zone réservation */}
            {unavailable ? (
              <div className="bg-brand-card border border-brand-border rounded-2xl p-6 opacity-75 select-none mb-5">
                <p className="font-semibold text-white/50 text-center mb-4 text-sm flex items-center justify-center gap-2">
                  {rabbit.status === 'reserved'
                    ? <><Lock size={14} /> Ce lapin est déjà réservé</>
                    : <><BadgeCheck size={14} /> Ce lapin a été vendu</>}
                </p>
                <div className="space-y-3 pointer-events-none">
                  {['Prénom', 'Nom', 'Email', 'Téléphone'].map(f => (
                    <div key={f}>
                      <label className="block text-xs text-white/30 mb-1">{f}</label>
                      <div className="h-9 rounded-lg bg-brand-darker" />
                    </div>
                  ))}
                  <div className="h-10 rounded-xl bg-brand-border mt-4" />
                </div>
              </div>
            ) : (
              <div className="bg-brand-card border border-brand-border rounded-2xl p-6 mb-5">
                <ReservationForm slug={rabbit.slug} rabbitName={rabbit.name} />
              </div>
            )}

            {/* Localisation du Coin Lapin */}
            <div className="mb-5">
              <h3 className="text-xs font-bold text-white/50 mb-3 uppercase tracking-wider">Localisation du Coin Lapin</h3>
              <MapView />
            </div>

            {/* Partage */}
            <SharePanel rabbit={rabbit} siteUrl={SITE_URL} />
          </div>
        </div>

        {/* Section bas — description / specs / similaires */}
        <div className="mt-14">
          <div className="flex items-center gap-4 mb-10">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-brand-border" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/35 px-4 py-1.5 rounded-full border border-brand-border bg-brand-card">
              Informations détaillées
            </span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-brand-border" />
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Description */}
            {rabbit.description && (
              <div>
                <h2 className="font-display font-bold text-white text-sm uppercase tracking-wide mb-3 flex items-center gap-2">
                  <Sparkles size={14} className="text-caramel" /> À propos
                </h2>
                <p className="text-white/55 text-sm leading-relaxed whitespace-pre-line">{rabbit.description}</p>
              </div>
            )}

            {/* Caractéristiques */}
            <div>
              <h2 className="font-display font-bold text-white text-sm uppercase tracking-wide mb-3 flex items-center gap-2">
                <Sparkles size={14} className="text-caramel" /> Caractéristiques
              </h2>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
                {specs.map(({ label, value }) => (
                  <div key={label} className="bg-brand-card border border-brand-border rounded-xl px-3.5 py-2.5">
                    <dt className="text-[10px] text-white/30 uppercase tracking-wide mb-0.5">{label}</dt>
                    <dd className="text-sm font-semibold text-white/85">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* Lapins similaires */}
          <SimilarRabbits currentSlug={rabbit.slug} breed={rabbit.breed} />
        </div>
      </div>

      <Footer />
    </main>
  )
}
