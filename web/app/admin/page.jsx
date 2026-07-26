'use client'
import { useState } from 'react'
import Link from 'next/link'
import { LayoutDashboard, Rabbit, ClipboardList, ChevronRight } from 'lucide-react'
import AdminGate from '@/components/admin/AdminGate'
import CustomCursor from '@/components/CustomCursor'
import DashboardOverview from '@/components/admin/DashboardOverview'
import RabbitsManager from '@/components/admin/RabbitsManager'
import ReservationsManager from '@/components/admin/ReservationsManager'

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'rabbits', label: 'Lapins', icon: Rabbit },
  { id: 'reservations', label: 'Réservations', icon: ClipboardList },
]

export default function AdminPage() {
  const [tab, setTab] = useState('dashboard')

  return (
    <AdminGate>
      <CustomCursor />
      <main
        className="min-h-screen px-4 sm:px-6 py-8 max-w-6xl mx-auto overflow-x-hidden"
        style={{ backgroundColor: 'var(--maroon)' }}
      >
        {/* Fil d'ariane — retour rapide au site, orientation dans l'espace admin */}
        <div className="flex items-center gap-1.5 text-xs text-white/35 mb-6">
          <Link href="/" className="hover:text-white/70 transition-colors">Accueil</Link>
          <ChevronRight size={12} />
          <span className="text-white/60">Admin</span>
        </div>

        {/* Tabs — port direct de .tabs/.tab-btn (admin.html) */}
        <div className="flex flex-wrap items-center gap-2 mb-8 pb-5 border-b border-white/[0.08]">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all border ${
                tab === id
                  ? 'bg-[var(--rust)] text-[var(--ink)] border-[var(--rust)]'
                  : 'bg-white/[0.03] text-white/55 border-white/10 hover:text-white hover:border-[var(--rust)]/40'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        {tab === 'dashboard' && <DashboardOverview />}
        {tab === 'rabbits' && <RabbitsManager />}
        {tab === 'reservations' && <ReservationsManager />}
      </main>
    </AdminGate>
  )
}
