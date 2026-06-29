'use client'
import { useState } from 'react'
import { Rabbit, ClipboardList } from 'lucide-react'
import AdminGate from '@/components/admin/AdminGate'
import RabbitsManager from '@/components/admin/RabbitsManager'
import ReservationsManager from '@/components/admin/ReservationsManager'

export default function AdminPage() {
  const [tab, setTab] = useState('rabbits') // 'rabbits' | 'reservations'

  return (
    <AdminGate>
      <main className="min-h-screen px-6 py-8 max-w-6xl mx-auto">
        {/* Tabs */}
        <div className="flex items-center gap-2 mb-8">
          <button
            onClick={() => setTab('rabbits')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
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
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              tab === 'reservations'
                ? 'bg-caramel text-espresso font-bold'
                : 'glass text-white/60 hover:text-white border border-brand-border'
            }`}
          >
            <ClipboardList size={16} />
            Réservations
          </button>
        </div>

        {tab === 'rabbits' ? <RabbitsManager /> : <ReservationsManager />}
      </main>
    </AdminGate>
  )
}
