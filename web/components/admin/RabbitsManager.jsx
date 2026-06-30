'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, PackageCheck, PackageX } from 'lucide-react'
import { rabbitsApi } from '@/lib/api'
import { GENDER_LABEL, formatPrice } from '@/lib/status'
import RabbitForm from './RabbitForm'
import toast from 'react-hot-toast'

export default function RabbitsManager() {
  const [rabbits, setRabbits] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)   // null | rabbit | 'new'
  const [deletingId, setDeletingId] = useState(null)
  const [summary, setSummary] = useState(null)

  function load() {
    setLoading(true)
    rabbitsApi.list()
      .then(r => setRabbits(r.results || []))
      .catch(() => toast.error('Impossible de charger les lapins'))
      .finally(() => setLoading(false))

    rabbitsApi.stockSummary()
      .then(setSummary)
      .catch(() => {}) // non bloquant — le tableau reste utilisable sans le résumé
  }

  useEffect(() => { load() }, [])

  async function handleDelete(rabbit) {
    if (!confirm(`Supprimer ${rabbit.name} définitivement ?`)) return
    setDeletingId(rabbit.id)
    try {
      await rabbitsApi.remove(rabbit.id)
      toast.success('Lapin supprimé')
      load()
    } catch (err) {
      toast.error(err.message || 'Erreur lors de la suppression')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold text-white">Lapins</h2>
        <button
          onClick={() => setEditing('new')}
          className="btn-neon px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2"
        >
          <Plus size={16} />
          Ajouter une race
        </button>
      </div>

      {/* Suivi de stock global */}
      {summary && (
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-brand-card border border-brand-border rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sage/15 flex items-center justify-center shrink-0">
              <PackageCheck size={18} className="text-sage" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/35">Stock restant</div>
              <div className="font-display text-xl font-extrabold text-white">{summary.totals.stockRemaining}</div>
            </div>
          </div>
          <div className="bg-brand-card border border-brand-border rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-caramel/15 flex items-center justify-center shrink-0">
              <PackageX size={18} className="text-caramel" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/35">Déjà réservé/vendu</div>
              <div className="font-display text-xl font-extrabold text-white">{summary.totals.sold}</div>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-white/40 text-sm py-12 text-center">Chargement…</div>
      ) : rabbits.length === 0 ? (
        <div className="text-white/40 text-sm py-12 text-center">
          Aucune race enregistrée. Cliquez sur "Ajouter une race" pour commencer.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-brand-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-brand-card text-white/40 text-xs uppercase tracking-wider">
                <th className="text-left px-4 py-3 font-medium">Nom</th>
                <th className="text-left px-4 py-3 font-medium">Race</th>
                <th className="text-left px-4 py-3 font-medium">Genre</th>
                <th className="text-left px-4 py-3 font-medium">Prix</th>
                <th className="text-left px-4 py-3 font-medium">Stock</th>
                <th className="text-left px-4 py-3 font-medium">Statut</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rabbits.map(rabbit => (
                <tr key={rabbit.id} className="border-t border-brand-border/50 hover:bg-brand-card/40 transition-colors">
                  <td className="px-4 py-3 text-white font-medium">{rabbit.name}</td>
                  <td className="px-4 py-3 text-white/60">{rabbit.breed}</td>
                  <td className="px-4 py-3 text-white/60">{GENDER_LABEL[rabbit.gender]}</td>
                  <td className="px-4 py-3 text-caramel font-medium">{formatPrice(rabbit.price)}</td>
                  <td className="px-4 py-3">
                    <span className={`font-mono font-bold ${rabbit.stock > 0 ? 'text-white/80' : 'text-white/30'}`}>
                      {rabbit.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                      rabbit.status === 'available' ? 'bg-sage/20 text-sage' : 'bg-white/10 text-white/40'
                    }`}>
                      {rabbit.status === 'available' ? 'Disponible' : 'Épuisé'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditing(rabbit)}
                        className="p-2 rounded-lg text-white/40 hover:text-caramel hover:bg-caramel/10 transition-colors"
                        aria-label="Modifier"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(rabbit)}
                        disabled={deletingId === rabbit.id}
                        className="p-2 rounded-lg text-white/40 hover:text-terracotta hover:bg-terracotta/10 transition-colors disabled:opacity-40"
                        aria-label="Supprimer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {editing && (
          <RabbitForm
            rabbit={editing === 'new' ? null : editing}
            onCancel={() => setEditing(null)}
            onSaved={() => { setEditing(null); load() }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
