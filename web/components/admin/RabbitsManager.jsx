'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { rabbitsApi } from '@/lib/api'
import { STATUS_LABEL, GENDER_LABEL, formatPrice } from '@/lib/status'
import RabbitForm from './RabbitForm'
import toast from 'react-hot-toast'

export default function RabbitsManager() {
  const [rabbits, setRabbits] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)   // null | rabbit | 'new'
  const [deletingId, setDeletingId] = useState(null)

  function load() {
    setLoading(true)
    rabbitsApi.list()
      .then(r => setRabbits(r.results || []))
      .catch(() => toast.error('Impossible de charger les lapins'))
      .finally(() => setLoading(false))
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
          Ajouter un lapin
        </button>
      </div>

      {loading ? (
        <div className="text-white/40 text-sm py-12 text-center">Chargement…</div>
      ) : rabbits.length === 0 ? (
        <div className="text-white/40 text-sm py-12 text-center">
          Aucun lapin enregistré. Cliquez sur "Ajouter un lapin" pour commencer.
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
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                      rabbit.status === 'available' ? 'bg-sage/20 text-sage' :
                      rabbit.status === 'reserved'  ? 'bg-terracotta/20 text-terracotta' :
                      'bg-white/10 text-white/40'
                    }`}>
                      {STATUS_LABEL[rabbit.status]}
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
