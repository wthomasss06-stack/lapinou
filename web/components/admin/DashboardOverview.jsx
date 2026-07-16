'use client'
import { useEffect, useState } from 'react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { adminApi } from '@/lib/api'
import { formatPrice } from '@/lib/status'
import toast from 'react-hot-toast'

const ZONE_COLORS = {
  abidjan:      'var(--admin-green)',
  azaguie:      'var(--lime)',
  pays_profond: 'var(--muted)',
  inconnue:     'var(--card)',
}

const RANGE_OPTIONS = [
  { label: '7j',  value: 7 },
  { label: '30j', value: 30 },
  { label: '90j', value: 90 },
]

function KpiCard({ label, value, accent }) {
  return (
    <div className="bg-[var(--panel)] border border-white/[0.08] rounded-2xl p-5 transition-all hover:border-[var(--rust)]/40 hover:-translate-y-0.5">
      <div className="text-[0.68rem] uppercase font-bold tracking-wide text-white/40 mb-3">{label}</div>
      <div className={`font-pixel text-2xl ${accent || 'text-white'}`} style={{ fontFamily: 'var(--font-pixel)' }}>{value}</div>
    </div>
  )
}

function formatDateShort(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
}

export default function DashboardOverview() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [range, setRange] = useState(30)

  useEffect(() => {
    setLoading(true)
    adminApi.dashboard(range)
      .then(setData)
      .catch(() => toast.error('Impossible de charger le dashboard'))
      .finally(() => setLoading(false))
  }, [range])

  if (loading && !data) {
    return <div className="text-white/40 text-sm py-12 text-center">Chargement du dashboard…</div>
  }
  if (!data) return null

  const { kpis, timeline, zoneBreakdown, topBreeds } = data
  const chartTimeline = timeline.map(t => ({ ...t, label: formatDateShort(t.date) }))
  const pieData = zoneBreakdown.filter(z => z.count > 0)

  return (
    <div className="space-y-6">
      {/* Sélecteur de période */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-2xl font-bold text-white uppercase" style={{ fontFamily: 'var(--font-pixel)' }}>Tableau de bord</h2>
        <div className="flex gap-1.5 bg-[var(--panel)] rounded-xl p-1 border border-white/[0.08]">
          {RANGE_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setRange(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                range === opt.value ? 'bg-[var(--rust)] text-[var(--ink)]' : 'text-white/50 hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        <KpiCard label="Revenu confirmé" value={formatPrice(kpis.revenueConfirmed)} accent="text-[var(--admin-green)]" />
        <KpiCard label="Revenu livraison" value={formatPrice(kpis.deliveryRevenue)} />
        <KpiCard label="En attente" value={kpis.pendingCount} accent="text-[var(--rust)]" />
        <KpiCard label="Confirmées" value={kpis.confirmedCount} accent="text-[var(--admin-green)]" />
        <KpiCard label="Annulées" value={kpis.cancelledCount} />
        <KpiCard label="Races dispo." value={`${kpis.rabbitsAvailable}/${kpis.totalRabbits}`} />
        <KpiCard label="Stock restant" value={kpis.stockRemaining} accent="text-[var(--rust)]" />
      </div>

      {/* Courbe revenu + réservations */}
      <div className="bg-[var(--panel)] border border-white/[0.08] rounded-2xl p-4">
        <h3 className="text-sm font-bold text-white/70 mb-4">Réservations &amp; revenu confirmé ({range}j)</h3>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={chartTimeline} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--admin-green)" stopOpacity={0.45} />
                <stop offset="100%" stopColor="var(--admin-green)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="resaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--lime)" stopOpacity={0.4} />
                <stop offset="100%" stopColor="var(--lime)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" stroke="#ffffff60" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis yAxisId="left" stroke="#ffffff60" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis yAxisId="right" orientation="right" stroke="#ffffff40" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ background: 'var(--dark)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: '#fff' }}
              formatter={(value, name) => name === 'revenue' ? [formatPrice(value), 'Revenu'] : [value, 'Réservations']}
            />
            <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="var(--admin-green)" fill="url(#revenueGrad)" strokeWidth={2} name="revenue" />
            <Area yAxisId="right" type="monotone" dataKey="reservations" stroke="var(--lime)" fill="url(#resaGrad)" strokeWidth={2} name="reservations" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Répartition zones de livraison */}
        <div className="bg-[var(--panel)] border border-white/[0.08] rounded-2xl p-4">
          <h3 className="text-sm font-bold text-white/70 mb-4">Zones de livraison</h3>
          {pieData.length === 0 ? (
            <div className="text-white/30 text-xs text-center py-12">Aucune donnée encore</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} dataKey="count" nameKey="label" innerRadius={55} outerRadius={85} paddingAngle={2}>
                  {pieData.map((entry) => (
                    <Cell key={entry.zone} fill={ZONE_COLORS[entry.zone] || 'var(--card)'} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: 'var(--dark)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                  formatter={(value, name) => [`${value} réservation(s)`, name]}
                />
                <Legend wrapperStyle={{ fontSize: 11, color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Top races */}
        <div className="bg-[var(--panel)] border border-white/[0.08] rounded-2xl p-4">
          <h3 className="text-sm font-bold text-white/70 mb-4">Races les plus vendues (en unités)</h3>
          {topBreeds.length === 0 ? (
            <div className="text-white/30 text-xs text-center py-12">Aucune donnée encore</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topBreeds} layout="vertical" margin={{ left: 16 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" stroke="#ffffff60" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                <YAxis type="category" dataKey="breed" stroke="#ffffff80" fontSize={11} tickLine={false} axisLine={false} width={110} />
                <Tooltip
                  contentStyle={{ background: 'var(--dark)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                  formatter={(value) => [`${value} unité(s)`, '']}
                />
                <Bar dataKey="count" fill="var(--admin-green)" radius={[0, 6, 6, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  )
}
