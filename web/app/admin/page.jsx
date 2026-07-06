'use client'
import { useState } from 'react'
import { LayoutDashboard, Rabbit, ClipboardList } from 'lucide-react'
import AdminGate from '@/components/admin/AdminGate'
import DashboardOverview from '@/components/admin/DashboardOverview'
import RabbitsManager from '@/components/admin/RabbitsManager'
import ReservationsManager from '@/components/admin/ReservationsManager'

export default function AdminPage() {
  const [tab, setTab] = useState('dashboard') // 'dashboard' | 'rabbits' | 'reservations'

  return (
    <AdminGate>
      <main className="min-h-screen px-4 sm:px-6 py-8 max-w-6xl mx-auto overflow-x-hidden">
        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <button
            onClick={() => setTab('dashboard')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              tab === 'dashboard'
                ? 'bg-caramel text-espresso font-bold'
                : 'glass text-white/60 hover:text-white border border-brand-border'
            }`}
          >
            <LayoutDashboard size={16} />
            Dashboard
          </button>
          <button
            onClick={() => setTab('rabbits')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              tab === 'rabbits'
                ? 'bg-caramel text-espresso font-bold'
                : 'glass text-white/60 hover:text-white border border-brand-border'
            }`}
          >
            <Rabbit size={16} />
            Lapins
          </button>
          <button
            onClick={() => setTab('reservations')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              tab === 'reservations'
                ? 'bg-caramel text-espresso font-bold'
                : 'glass text-white/60 hover:text-white border border-brand-border'
            }`}
          >
            <ClipboardList size={16} />
            Réservations
          </button>
        </div>

        {tab === 'dashboard' && <DashboardOverview />}
        {tab === 'rabbits' && <RabbitsManager />}
        {tab === 'reservations' && <ReservationsManager />}
      </main>
    </AdminGate>
  )
}
