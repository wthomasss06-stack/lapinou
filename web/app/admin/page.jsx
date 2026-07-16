'use client'
import { useState } from 'react'
import { LayoutDashboard, Rabbit, ClipboardList } from 'lucide-react'
import AdminGate from '@/components/admin/AdminGate'
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
      <main
        className="min-h-screen px-4 sm:px-6 py-8 max-w-6xl mx-auto overflow-x-hidden"
        style={{ backgroundColor: 'var(--maroon)' }}
      >
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
