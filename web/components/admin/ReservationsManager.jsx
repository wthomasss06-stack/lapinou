'use client'
import { useEffect, useState } from 'react'
import { Check, X, PackageCheck, MessageCircle, Eye, EyeOff, ShieldCheck, ShieldAlert, Users, MapPin, Truck } from 'lucide-react'
import { adminApi } from '@/lib/api'
import { formatPrice } from '@/lib/status'
import toast from 'react-hot-toast'
import dynamic from 'next/dynamic'

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false })

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP?.replace(/\D/g, '') || ''

const STATUS_BADGE = {
  pending:   'bg-terracotta/20 text-terracotta',
  confirmed: 'bg-sage/20 text-sage',
  cancelled: 'bg-white/10 text-white/40',
}
const STATUS_LABEL = { pending: 'En attente', confirmed: 'Confirmée', cancelled: 'Annulée' }
const ZONE_LABEL = { abidjan: 'Abidjan', azaguie: 'Azaguié et alentours', pays_profond: 'Pays profond' }

export default function ReservationsManager() {
  const [reservations, setReservations] = useState([])
  const [stats, setStats] = useState({ total: 0, accepted: 0, declined: 0 })
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState(null)
  const [openMaps, setOpenMaps] = useState({})

  function load() {
    setLoading(true)
    Promise.all([
      adminApi.reservations.list(),
      adminApi.analytics.stats().catch(() => null)
    ])
      .then(([resvs, statsData]) => {
        setReservations(resvs.results || resvs || [])
        if (statsData) {
          setStats(statsData)
        }
      })
      .catch(() => toast.error('Impossible de charger les données'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  async function runAction(id, action, label) {
    setBusyId(id)
    try {
      await action(id)
      toast.success(label)
      load()
    } catch (err) {
      toast.error(err.message || 'Erreur')
    } finally {
      setBusyId(null)
    }
  }

  const toggleMap = (resvId) => {
    setOpenMaps(prev => ({ ...prev, [resvId]: !prev[resvId] }))
  }

  return (
    <div className="space-y-6">
      {/* Statistiques cookies & visites */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass p-4 rounded-xl flex items-center gap-3">
          <div className="p-3 rounded-lg bg-white/5 text-caramel">
            <Users size={20} />
          </div>
          <div>
            <div className="text-[10px] text-white/40 uppercase font-bold">Visites Totales</div>
            <div className="text-xl font-bold text-white mt-0.5">{stats.total}</div>
          </div>
        </div>

        <div className="glass p-4 rounded-xl flex items-center gap-3">
          <div className="p-3 rounded-lg bg-[rgba(var(--green-rgb),0.15)] text-[var(--green)]">
            <ShieldCheck size={20} />
          </div>
          <div>
            <div className="text-[10px] text-white/40 uppercase font-bold">Consentements OK</div>
            <div className="text-xl font-bold text-[var(--green)] mt-0.5">{stats.accepted}</div>
          </div>
        </div>

        <div className="glass p-4 rounded-xl flex items-center gap-3">
          <div className="p-3 rounded-lg bg-[rgba(var(--lime-rgb),0.15)] text-[var(--lime)]">
            <ShieldAlert size={20} />
          </div>
          <div>
            <div className="text-[10px] text-white/40 uppercase font-bold">Refus Cookies</div>
            <div className="text-xl font-bold text-[var(--lime)] mt-0.5">{stats.declined}</div>
          </div>
        </div>
      </div>

      <div className="h-px bg-brand-border" />

      <h2 className="font-display text-2xl font-bold text-white">Réservations</h2>

      {loading ? (
        <div className="text-white/40 text-sm py-12 text-center">Chargement…</div>
      ) : reservations.length === 0 ? (
        <div className="text-white/40 text-sm py-12 text-center">
          Aucune réservation pour le moment. Elles apparaîtront ici dès qu'un client réservera un lapin.
        </div>
      ) : (
        <div className="space-y-4">
          {reservations.map(resv => (
            <div key={resv.id} className="glass rounded-xl p-4 flex flex-col gap-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-white font-semibold text-sm">
                      {resv.firstName} {resv.lastName}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE[resv.status]}`}>
                      {STATUS_LABEL[resv.status]}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-caramel/15 text-caramel">
                      ×{resv.quantity ?? 1}
                    </span>
                    {resv.latitude && resv.longitude && (
                      <span className="text-[9px] px-2 py-0.5 rounded-full font-mono bg-caramel/10 text-caramel border border-caramel/20 flex items-center gap-1">
                        <MapPin size={9} /> GPS inclus
                      </span>
                    )}
                  </div>
                  <p className="text-white/40 text-xs">
                    {resv.rabbit?.name} — {resv.rabbit?.breed}
                    {resv.rabbit?.price != null && (
                      <> · {formatPrice(resv.rabbit.price)}/u
                        {(resv.quantity ?? 1) > 1 && <> · total {formatPrice(resv.rabbit.price * (resv.quantity ?? 1))}</>}
                      </>
                    )}
                  </p>
                  {resv.deliveryZone && (
                    <p className="text-caramel/80 text-xs mt-0.5 flex items-center gap-1">
                      <Truck size={11} />
                      Livraison {ZONE_LABEL[resv.deliveryZone] || resv.deliveryZone}
                      {resv.deliveryFee != null && ` · ${formatPrice(resv.deliveryFee)}`}
                      {resv.rabbit?.price != null && resv.deliveryFee != null && (
                        <span className="text-white/30"> · total {formatPrice(resv.rabbit.price * (resv.quantity ?? 1) + resv.deliveryFee)}</span>
                      )}
                    </p>
                  )}
                  <p className="text-white/30 text-xs mt-1">
                    {resv.email} · {resv.phone}
                  </p>
                  {resv.message && (
                    <p className="text-white/50 text-xs mt-1 italic">"{resv.message}"</p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {resv.latitude && resv.longitude && (
                    <button
                      onClick={() => toggleMap(resv.id)}
                      className={`p-2 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-bold ${
                        openMaps[resv.id]
                          ? 'bg-caramel/20 text-caramel'
                          : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                      }`}
                      title="Afficher/Masquer la carte de localisation"
                    >
                      {openMaps[resv.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                      Carte
                    </button>
                  )}

                  {resv.phone && (
                    <a
                      href={`https://wa.me/${resv.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Bonjour ${resv.firstName}, à propos de votre réservation pour ${resv.rabbit?.name || 'le lapin'}…`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-sage hover:bg-sage/10 transition-colors"
                      aria-label="Contacter sur WhatsApp"
                    >
                      <MessageCircle size={16} />
                    </a>
                  )}

                  {resv.status === 'pending' && (
                    <>
                      <button
                        onClick={() => runAction(resv.id, adminApi.reservations.confirm, 'Réservation confirmée')}
                        disabled={busyId === resv.id}
                        className="p-2 rounded-lg text-sage hover:bg-sage/10 transition-colors disabled:opacity-40"
                        aria-label="Confirmer"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() => runAction(resv.id, adminApi.reservations.cancel, 'Réservation annulée')}
                        disabled={busyId === resv.id}
                        className="p-2 rounded-lg text-terracotta hover:bg-terracotta/10 transition-colors disabled:opacity-40"
                        aria-label="Annuler"
                      >
                        <X size={16} />
                      </button>
                    </>
                  )}

                  {resv.status === 'confirmed' && (
                    <button
                      onClick={() => runAction(resv.id, adminApi.reservations.sold, 'Marqué comme vendu')}
                      disabled={busyId === resv.id}
                      className="btn-neon px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 disabled:opacity-40"
                    >
                      <PackageCheck size={14} />
                      Marquer vendu
                    </button>
                  )}
                </div>
              </div>

              {/* Carte pliable si activée */}
              {resv.latitude && resv.longitude && openMaps[resv.id] && (
                <div className="pt-2 border-t border-white/5 animate-fadeIn">
                  <div className="text-[10px] text-white/40 mb-2 font-mono">
                    Coordonnées client : {resv.latitude.toFixed(5)}, {resv.longitude.toFixed(5)}
                  </div>
                  <MapView clientLat={resv.latitude} clientLng={resv.longitude} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
