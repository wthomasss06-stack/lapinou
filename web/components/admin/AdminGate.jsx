'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, LogOut } from 'lucide-react'
import { adminApi, getAdminToken, setAdminToken, clearAdminToken } from '@/lib/api'
import Logo from '@/components/Logo'
import toast from 'react-hot-toast'

export default function AdminGate({ children }) {
  const [checking, setChecking] = useState(true)
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // On considère qu'un token présent en local est valide — il sera rejeté
    // par l'API au premier appel si ce n'est pas le cas (401 → on déconnecte).
    setAuthed(!!getAdminToken())
    setChecking(false)
  }, [])

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const { token } = await adminApi.login(password)
      setAdminToken(token)
      setAuthed(true)
      toast.success('Connecté')
    } catch (err) {
      toast.error(err.message || 'Mot de passe incorrect')
    } finally {
      setLoading(false)
    }
  }

  function handleLogout() {
    clearAdminToken()
    setAuthed(false)
  }

  if (checking) return null

  if (!authed) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-8 w-full max-w-sm"
        >
          <div className="flex flex-col items-center mb-8">
            <Logo showText={false} size={48} />
            <h1 className="font-display text-xl font-bold text-white mt-4">Espace Admin</h1>
            <p className="text-white/40 text-xs mt-1">CHEZ FLORENCE — gestion des lapins</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="password"
                required
                autoFocus
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Mot de passe admin"
                className="input-dark w-full pl-10 pr-4 py-3 rounded-xl text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-neon w-full py-3 rounded-xl text-sm font-bold disabled:opacity-60"
            >
              {loading ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>
        </motion.div>
      </main>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between px-6 py-4 border-b border-brand-border">
        <Logo size={28} />
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-white/40 hover:text-white text-xs transition-colors"
        >
          <LogOut size={14} />
          Déconnexion
        </button>
      </div>
      {children}
    </div>
  )
}
