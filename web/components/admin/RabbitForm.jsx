'use client'
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload, Trash2, ImagePlus, CheckCircle2 } from 'lucide-react'
import { rabbitsApi } from '@/lib/api'
import { resolvePhotoUrl } from '@/lib/status'
import toast from 'react-hot-toast'

const BREEDS = ['Bélier nain', 'Rex', 'Angora français', 'Géant des Flandres', 'Hollandais', 'Autre']

function slugify(str) {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// ─── Panneau upload photos (étape 2 après création/édition) ──────────────────
function PhotoUploadPanel({ rabbit, onDone }) {
  const [photos, setPhotos] = useState(rabbit.photos || [])
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef(null)

  async function handleFiles(files) {
    if (!files || files.length === 0) return
    setUploading(true)
    try {
      const result = await rabbitsApi.uploadImages(rabbit.id, files)
      setPhotos(prev => [...prev, ...(result.photos || [])])
      toast.success(`${result.photos?.length || files.length} photo(s) ajoutée(s)`)
    } catch (err) {
      toast.error(err.message || 'Erreur upload')
    } finally {
      setUploading(false)
    }
  }

  async function handleDelete(photo) {
    setDeleting(photo.id)
    try {
      await rabbitsApi.deleteImage(rabbit.id, photo.id)
      setPhotos(prev => prev.filter(p => p.id !== photo.id))
      toast.success('Photo supprimée')
    } catch (err) {
      toast.error(err.message || 'Erreur suppression')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-lg font-bold text-white">Photos de {rabbit.name}</h3>
          <p className="text-white/40 text-xs mt-0.5">{photos.length} photo(s) — 8 max</p>
        </div>
        <button
          onClick={onDone}
          className="btn-neon px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"
        >
          <CheckCircle2 size={15} />
          Terminer
        </button>
      </div>

      {/* Zone de drop */}
      {photos.length < 8 && (
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => {
            e.preventDefault()
            setDragOver(false)
            handleFiles(e.dataTransfer.files)
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
            dragOver
              ? 'border-caramel bg-caramel/10'
              : 'border-brand-border hover:border-caramel/50 hover:bg-caramel/5'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            className="hidden"
            onChange={e => handleFiles(e.target.files)}
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-caramel border-t-transparent rounded-full animate-spin" />
              <p className="text-white/60 text-sm">Téléversement en cours…</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-caramel/10 flex items-center justify-center">
                <ImagePlus size={22} className="text-caramel" />
              </div>
              <div>
                <p className="text-white/70 text-sm font-medium">Glissez vos photos ici</p>
                <p className="text-white/30 text-xs mt-1">ou cliquez pour choisir — JPEG, PNG, WebP · 10 MB max</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Grille des photos */}
      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <AnimatePresence>
            {photos.map((photo, i) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative group rounded-xl overflow-hidden aspect-square bg-brand-card"
              >
                <img
                  src={resolvePhotoUrl(photo.url)}
                  alt={`Photo ${i + 1}`}
                  className="w-full h-full object-cover"
                />
                {i === 0 && (
                  <span className="absolute top-1.5 left-1.5 text-[10px] bg-caramel text-espresso font-bold px-1.5 py-0.5 rounded-md">
                    Principale
                  </span>
                )}
                <button
                  onClick={() => handleDelete(photo)}
                  disabled={deleting === photo.id}
                  className="absolute top-1.5 right-1.5 w-7 h-7 rounded-lg bg-black/60 text-white/70 hover:text-red-400 hover:bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all disabled:opacity-40"
                >
                  {deleting === photo.id
                    ? <div className="w-3 h-3 border border-white/50 border-t-transparent rounded-full animate-spin" />
                    : <Trash2 size={12} />
                  }
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {photos.length === 0 && !uploading && (
        <p className="text-white/25 text-xs text-center">Aucune photo pour l'instant.</p>
      )}
    </div>
  )
}

// ─── Formulaire principal ─────────────────────────────────────────────────────
export default function RabbitForm({ rabbit, onSaved, onCancel }) {
  const isEdit = !!rabbit
  const [form, setForm] = useState({
    name:        rabbit?.name || '',
    breed:       rabbit?.breed || BREEDS[0],
    color:       rabbit?.color || '',
    gender:      rabbit?.gender || 'male',
    weight:      rabbit?.weight || '',
    price:       rabbit?.price || '',
    priceNote:   rabbit?.priceNote || '',
    description: rabbit?.description || '',
    stock:       rabbit?.stock ?? '',
  })
  const [loading, setLoading] = useState(false)
  const [savedRabbit, setSavedRabbit] = useState(isEdit ? rabbit : null)
  const [step, setStep] = useState('form') // 'form' | 'photos'

  function update(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        ...form,
        weight: form.weight ? parseFloat(form.weight) : null,
        price:  parseFloat(form.price),
        stock:  form.stock === '' ? 0 : parseInt(form.stock, 10),
      }

      let result
      if (isEdit) {
        result = await rabbitsApi.update(rabbit.id, payload)
        toast.success('Race mise à jour')
      } else {
        payload.slug = slugify(`${form.name}-${form.breed}-${Date.now().toString(36)}`)
        result = await rabbitsApi.create(payload)
        toast.success('Race ajoutée')
      }
      setSavedRabbit(result)
      setStep('photos')
    } catch (err) {
      toast.error(err.message || 'Erreur lors de l\'enregistrement')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4 py-8"
      onClick={step === 'form' ? onCancel : undefined}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        onClick={e => e.stopPropagation()}
        className="glass rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-bold text-white">
            {step === 'photos'
              ? '📷 Ajouter des photos'
              : isEdit ? 'Modifier la race' : 'Ajouter une race'}
          </h2>
          <button onClick={step === 'photos' ? onSaved : onCancel} className="text-white/40 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {step === 'form' ? (
            <motion.form
              key="form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/40 uppercase tracking-widest font-mono mb-1.5 block">Nom *</label>
                  <input
                    required
                    value={form.name}
                    onChange={e => update('name', e.target.value)}
                    className="input-dark w-full px-3 py-2.5 rounded-lg text-sm"
                    placeholder="Bélier nain Fauve"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/40 uppercase tracking-widest font-mono mb-1.5 block">Race *</label>
                  <select
                    value={form.breed}
                    onChange={e => update('breed', e.target.value)}
                    className="input-dark w-full px-3 py-2.5 rounded-lg text-sm"
                  >
                    {BREEDS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-white/40 uppercase tracking-widest font-mono mb-1.5 block">Genre</label>
                  <select
                    value={form.gender}
                    onChange={e => update('gender', e.target.value)}
                    className="input-dark w-full px-3 py-2.5 rounded-lg text-sm"
                  >
                    <option value="male">Mâle</option>
                    <option value="female">Femelle</option>
                    <option value="mixed">Lot mixte</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-white/40 uppercase tracking-widest font-mono mb-1.5 block">Couleur</label>
                  <input
                    value={form.color}
                    onChange={e => update('color', e.target.value)}
                    className="input-dark w-full px-3 py-2.5 rounded-lg text-sm"
                    placeholder="Blanc"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/40 uppercase tracking-widest font-mono mb-1.5 block">Poids (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={form.weight}
                    onChange={e => update('weight', e.target.value)}
                    className="input-dark w-full px-3 py-2.5 rounded-lg text-sm"
                    placeholder="1.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/40 uppercase tracking-widest font-mono mb-1.5 block">Prix (FCFA) *</label>
                  <input
                    required
                    type="number"
                    value={form.price}
                    onChange={e => update('price', e.target.value)}
                    className="input-dark w-full px-3 py-2.5 rounded-lg text-sm"
                    placeholder="35000"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/40 uppercase tracking-widest font-mono mb-1.5 block">Stock disponible *</label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={e => update('stock', e.target.value)}
                    className="input-dark w-full px-3 py-2.5 rounded-lg text-sm"
                    placeholder="12"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-white/40 uppercase tracking-widest font-mono mb-1.5 block">Note de prix (optionnel)</label>
                <input
                  value={form.priceNote}
                  onChange={e => update('priceNote', e.target.value)}
                  className="input-dark w-full px-3 py-2.5 rounded-lg text-sm"
                  placeholder="Négociable, vaccins inclus…"
                />
              </div>

              <div>
                <label className="text-xs text-white/40 uppercase tracking-widest font-mono mb-1.5 block">Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={e => update('description', e.target.value)}
                  className="input-dark w-full px-3 py-2.5 rounded-lg text-sm resize-none"
                  placeholder="Caractère, particularités…"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onCancel}
                  className="btn-outline flex-1 py-3 rounded-xl text-sm"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-neon flex-1 py-3 rounded-xl text-sm font-bold disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <><div className="w-4 h-4 border-2 border-espresso/60 border-t-espresso rounded-full animate-spin" /> Enregistrement…</>
                  ) : (
                    <><Upload size={14} /> {isEdit ? 'Mettre à jour & Gérer photos' : 'Créer & Ajouter photos'}</>
                  )}
                </button>
              </div>
            </motion.form>
          ) : (
            <motion.div
              key="photos"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <PhotoUploadPanel
                rabbit={savedRabbit}
                onDone={onSaved}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}
