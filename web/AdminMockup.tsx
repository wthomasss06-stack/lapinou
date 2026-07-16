/**
 * AdminMockup.tsx
 * ─────────────────────────────────────────────────────────────
 * ⚠️ MAQUETTE STATIQUE — PAS le vrai admin.
 *
 * Ton vrai app/admin/page.tsx est fonctionnel (login réel, données
 * live via API, DashboardOverview / RabbitsManager / ReservationsManager
 * connectés à ta base). ATTENTION à NE PAS écraser ce fichier avec ceci.
 *
 * Ce composant sert uniquement de référence visuelle (même design
 * system que le reste du site). Si tu veux le consulter, monte-le sur
 * une route à part, ex. app/admin-preview/page.tsx :
 *
 *   import AdminMockup from '@/AdminMockup'
 *   export default function Page() { return <AdminMockup /> }
 *
 * Toutes les données affichées ici (KPI, lignes de tableau) sont des
 * exemples statiques, pas des vraies données.
 * ─────────────────────────────────────────────────────────────
 */

'use client'

import { useEffect, useState } from 'react'

export default function AdminMockup() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [activeTab, setActiveTab] = useState<'dash' | 'rabbits' | 'resa'>('dash')

  useEffect(() => {
    const cursor = document.getElementById('admin-cursor')
    const onMove = (e: MouseEvent) => {
      if (cursor) {
        cursor.style.left = e.clientX + 'px'
        cursor.style.top = e.clientY + 'px'
      }
    }
    document.addEventListener('mousemove', onMove)

    const hoverTargets = document.querySelectorAll('.hover-target')
    const onEnter = () => cursor?.classList.add('hovered')
    const onLeave = () => cursor?.classList.remove('hovered')
    hoverTargets.forEach((t) => {
      t.addEventListener('mouseenter', onEnter)
      t.addEventListener('mouseleave', onLeave)
    })

    return () => {
      document.removeEventListener('mousemove', onMove)
      hoverTargets.forEach((t) => {
        t.removeEventListener('mouseenter', onEnter)
        t.removeEventListener('mouseleave', onLeave)
      })
    }
  }, [loggedIn, activeTab])

  return (
    <>
      <div className="noise-overlay" />
      <div className="custom-cursor" id="admin-cursor" />
      <div className="mock-banner">Maquette statique — visuel uniquement, aucune connexion réelle ni donnée en direct</div>

      <header>
        <a href="/" className="logo-area hover-target">
          <div className="logo-blob" />
          <span>Chez Florence</span>
          <span className="admin-pill">Admin</span>
        </a>
        <div className="header-right">
          {loggedIn && (
            <button className="logout-btn hover-target" onClick={() => setLoggedIn(false)}>
              Déconnexion
            </button>
          )}
        </div>
      </header>
      <div className="breadcrumb"><a href="/" className="hover-target">Accueil</a> / <span>Admin</span></div>

      {!loggedIn && (
        <div id="gate">
          <div className="gate-box">
            <div className="gate-eyebrow">Accès restreint</div>
            <div className="gate-lock">🔒</div>
            <h1>Espace Admin</h1>
            <p>Entrez le mot de passe pour continuer.</p>
            <input type="password" className="gate-input hover-target" placeholder="Mot de passe" />
            <button className="gate-btn hover-target" onClick={() => setLoggedIn(true)}>Se connecter</button>
          </div>
        </div>
      )}

      {loggedIn && (
        <div id="dashboard">
          <div className="page-head">
            <div className="eyebrow">Vue d&apos;ensemble</div>
            <h1 className="page-title">Tableau de Bord</h1>
          </div>

          <div className="tabs">
            <button className={`tab-btn hover-target ${activeTab === 'dash' ? 'active' : ''}`} onClick={() => setActiveTab('dash')}>Dashboard</button>
            <button className={`tab-btn hover-target ${activeTab === 'rabbits' ? 'active' : ''}`} onClick={() => setActiveTab('rabbits')}>Lapins</button>
            <button className={`tab-btn hover-target ${activeTab === 'resa' ? 'active' : ''}`} onClick={() => setActiveTab('resa')}>Réservations</button>
          </div>

          {activeTab === 'dash' && (
            <div className="tab-panel active">
              <div className="kpi-grid">
                <div className="kpi-card"><div className="kpi-label">Revenu confirmé</div><div className="kpi-value green">142 500 F</div></div>
                <div className="kpi-card"><div className="kpi-label">Revenu livraison</div><div className="kpi-value">8 000 F</div></div>
                <div className="kpi-card"><div className="kpi-label">En attente</div><div className="kpi-value orange">3</div></div>
                <div className="kpi-card"><div className="kpi-label">Confirmées</div><div className="kpi-value green">17</div></div>
                <div className="kpi-card"><div className="kpi-label">Annulées</div><div className="kpi-value">2</div></div>
                <div className="kpi-card"><div className="kpi-label">Races dispo.</div><div className="kpi-value">3/3</div></div>
                <div className="kpi-card"><div className="kpi-label">Stock restant</div><div className="kpi-value orange">12</div></div>
              </div>
              <div className="table-wrap">
                <div className="empty-note">Graphiques (revenu, zones de livraison, races les plus vendues) — branchés sur l&apos;API réelle côté Next.js, non reproduits dans cette maquette.</div>
              </div>
            </div>
          )}

          {activeTab === 'rabbits' && (
            <div className="tab-panel active">
              <div className="section-label"><h2>Races en catalogue</h2><button className="add-btn hover-target">+ Ajouter</button></div>
              <div className="table-wrap"><div className="table-scroll">
                <table>
                  <thead><tr><th>Nom</th><th>Race</th><th>Genre</th><th>Prix</th><th>Stock</th><th>Statut</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
                  <tbody>
                    <tr><td>Hollandais</td><td>Hollandais</td><td>Lot mixte</td><td>8 500 F</td><td>5</td><td><span className="badge stock">En stock</span></td><td><div className="row-actions"><button className="hover-target">Modifier</button><button className="hover-target">Suppr.</button></div></td></tr>
                    <tr><td>Angora Français</td><td>Angora</td><td>Femelle</td><td>9 000 F</td><td>4</td><td><span className="badge stock">En stock</span></td><td><div className="row-actions"><button className="hover-target">Modifier</button><button className="hover-target">Suppr.</button></div></td></tr>
                    <tr><td>Rex</td><td>Rex</td><td>Mâle</td><td>10 000 F</td><td>3</td><td><span className="badge stock">En stock</span></td><td><div className="row-actions"><button className="hover-target">Modifier</button><button className="hover-target">Suppr.</button></div></td></tr>
                  </tbody>
                </table>
              </div></div>
            </div>
          )}

          {activeTab === 'resa' && (
            <div className="tab-panel active">
              <div className="section-label"><h2>Réservations récentes</h2></div>
              <div className="table-wrap"><div className="table-scroll">
                <table>
                  <thead><tr><th>Client</th><th>Lapin</th><th>Qté</th><th>Zone</th><th>Statut</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
                  <tbody>
                    <tr><td>Jean Dupont</td><td>Le Duo</td><td>2</td><td>Abidjan</td><td><span className="badge pending">En attente</span></td><td><div className="row-actions"><button className="hover-target">Confirmer</button><button className="hover-target">Annuler</button></div></td></tr>
                    <tr><td>Aïcha K.</td><td>Format Restaurateur</td><td>6</td><td>Azaguié</td><td><span className="badge confirmed">Confirmée</span></td><td><div className="row-actions"><button className="hover-target">WhatsApp</button></div></td></tr>
                    <tr><td>Serge B.</td><td>À l&apos;unité</td><td>1</td><td>Abidjan</td><td><span className="badge cancelled">Annulée</span></td><td><div className="row-actions"><button className="hover-target">WhatsApp</button></div></td></tr>
                  </tbody>
                </table>
              </div></div>
            </div>
          )}
        </div>
      )}

      <style jsx global>{`
        :root {
            --bg-light: #f3f0ea;
            --bg-dark: #0c0906;
            --text-dark: #171310;
            --text-light: #f3f0ea;
            --accent-orange: #e8622c;
            --panel: #17130e;
            --green: #7fb069;
            --font-main: 'Syne', sans-serif;
            --font-pixel: 'Silkscreen', sans-serif;
        }
        * { box-sizing: border-box; cursor: none; }
        body { margin: 0; padding: 0; background: var(--bg-dark); color: var(--text-light); font-family: var(--font-main); overflow-x: hidden; min-height: 100vh; line-height: 1.5; }
        @media (max-width: 700px) { * { cursor: auto; } }
      `}</style>
      <style jsx>{`
        .noise-overlay { position: fixed; top: -50%; left: -50%; width: 200%; height: 200%; background: url('data:image/svg+xml;utf8,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)"/%3E%3C/svg%3E'); opacity: 0.04; pointer-events: none; z-index: 9999; animation: noise 0.2s infinite; mix-blend-mode: difference; }
        @keyframes noise { 0% { transform: translate(0,0);} 50% { transform: translate(-10%,5%);} 100% { transform: translate(0,0);} }

        .custom-cursor { width: 10px; height: 10px; background-color: var(--text-light); border-radius: 50%; position: fixed; top: 0; left: 0; pointer-events: none; z-index: 99999; transition: width 0.3s, height 0.3s, background-color 0.3s; mix-blend-mode: difference; transform: translate(-50%, -50%); }
        .custom-cursor.hovered { width: 46px; height: 46px; background-color: var(--accent-orange); mix-blend-mode: normal; }

        .mock-banner { background: var(--accent-orange); color: var(--bg-dark); text-align: center; font-size: 0.76rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; padding: 9px; }

        header { display: flex; justify-content: space-between; align-items: center; padding: 20px 40px; background: rgba(12,9,6,0.9); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255,255,255,0.08); position: sticky; top: 0; z-index: 50; }
        .logo-area { display: flex; align-items: center; gap: 10px; font-weight: 700; font-size: 1rem; text-transform: uppercase; text-decoration: none; color: var(--text-light); }
        .logo-blob { width: 28px; height: 20px; background: var(--accent-orange); border-radius: 40% 60% 60% 40% / 50% 30% 70% 50%; }
        .admin-pill { font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; background: rgba(255,255,255,0.08); padding: 4px 10px; border-radius: 20px; opacity: 0.6; }
        .header-right { display: flex; align-items: center; gap: 14px; }
        .logout-btn { background: none; border: 1px solid rgba(255,255,255,0.15); color: rgba(243,240,234,0.6); padding: 9px 16px; border-radius: 10px; font-family: var(--font-main); font-size: 0.78rem; font-weight: 600; }

        .breadcrumb { max-width: 1200px; margin: 0 auto; padding: 20px 40px 0; font-size: 0.78rem; color: rgba(243,240,234,0.4); }
        .breadcrumb :global(a) { color: var(--accent-orange); text-decoration: none; }
        .breadcrumb :global(a:hover) { text-decoration: underline; }

        #gate { min-height: calc(100vh - 40px); display: flex; align-items: center; justify-content: center; padding: 24px; }
        .gate-box { background: var(--panel); border: 1px solid rgba(255,255,255,0.08); border-radius: 22px; padding: 44px; width: 100%; max-width: 380px; text-align: center; }
        .gate-eyebrow { font-size: 0.78rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--accent-orange); margin-bottom: 22px; }
        .gate-lock { width: 50px; height: 50px; border-radius: 50%; background: rgba(232,98,44,0.15); display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 1.3rem; }
        .gate-box :global(h1) { font-family: var(--font-pixel); font-size: 1.15rem; text-transform: uppercase; letter-spacing: -0.5px; margin-bottom: 8px; }
        .gate-box :global(p) { font-size: 0.85rem; color: rgba(243,240,234,0.45); margin-bottom: 28px; }
        .gate-input { width: 100%; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); border-radius: 12px; padding: 15px 16px; color: white; font-family: var(--font-main); font-size: 0.9rem; margin-bottom: 16px; transition: border-color 0.3s; }
        .gate-input:focus { outline: none; border-color: var(--accent-orange); }
        .gate-input::placeholder { color: rgba(243,240,234,0.3); }
        .gate-btn { width: 100%; background: var(--accent-orange); color: var(--bg-dark); border: none; border-radius: 12px; padding: 15px; font-family: var(--font-main); font-weight: 700; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 0.5px; transition: opacity 0.3s; }
        .gate-btn:hover { opacity: 0.85; }

        #dashboard { max-width: 1200px; margin: 0 auto; padding: 30px 40px 100px; }
        .page-head { margin-bottom: 34px; }
        .eyebrow { font-size: 0.78rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--accent-orange); margin-bottom: 10px; }
        .page-title { font-family: var(--font-pixel); font-size: 1.7rem; text-transform: uppercase; letter-spacing: -1px; }

        .tabs { display: flex; gap: 8px; margin-bottom: 32px; flex-wrap: wrap; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 20px; }
        .tab-btn { padding: 11px 20px; border-radius: 12px; font-family: var(--font-main); font-size: 0.85rem; font-weight: 600; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.03); color: rgba(243,240,234,0.55); transition: 0.25s; }
        .tab-btn:hover { border-color: rgba(232,98,44,0.4); color: var(--text-light); }
        .tab-btn.active { background: var(--accent-orange); color: var(--bg-dark); font-weight: 700; border-color: var(--accent-orange); }

        .tab-panel.active { display: block; }

        .kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 14px; margin-bottom: 44px; }
        .kpi-card { background: var(--panel); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 20px; transition: border-color 0.3s, transform 0.3s; }
        .kpi-card:hover { border-color: rgba(232,98,44,0.4); transform: translateY(-3px); }
        .kpi-label { font-size: 0.68rem; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px; color: rgba(243,240,234,0.4); margin-bottom: 12px; }
        .kpi-value { font-family: var(--font-pixel); font-size: 1.55rem; }
        .kpi-value.orange { color: var(--accent-orange); }
        .kpi-value.green { color: var(--green); }

        .section-label { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
        .section-label :global(h2) { font-size: 0.95rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
        .add-btn { background: var(--accent-orange); color: var(--bg-dark); border: none; padding: 10px 18px; border-radius: 10px; font-family: var(--font-main); font-weight: 700; font-size: 0.8rem; text-transform: uppercase; }

        .table-wrap { background: var(--panel); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; overflow: hidden; }
        .table-scroll { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; }
        th { text-align: left; padding: 14px 18px; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(243,240,234,0.4); border-bottom: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.02); }
        td { padding: 14px 18px; font-size: 0.88rem; border-bottom: 1px solid rgba(255,255,255,0.05); }
        tbody tr { transition: background 0.2s; }
        tbody tr:hover { background: rgba(255,255,255,0.03); }
        tr:last-child td { border-bottom: none; }

        .badge { font-size: 0.68rem; font-weight: 700; padding: 5px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.3px; }
        .badge.stock { background: rgba(127,176,105,0.18); color: var(--green); }
        .badge.pending { background: rgba(232,98,44,0.18); color: var(--accent-orange); }
        .badge.confirmed { background: rgba(127,176,105,0.18); color: var(--green); }
        .badge.cancelled { background: rgba(255,255,255,0.08); color: rgba(243,240,234,0.4); }

        .row-actions { display: flex; gap: 8px; justify-content: flex-end; }
        .row-actions :global(button) { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08); color: rgba(243,240,234,0.75); padding: 7px 12px; border-radius: 8px; font-size: 0.74rem; font-family: var(--font-main); font-weight: 600; transition: 0.2s; }
        .row-actions :global(button:hover) { border-color: var(--accent-orange); color: var(--accent-orange); }

        .empty-note { padding: 60px 20px; text-align: center; color: rgba(243,240,234,0.35); font-size: 0.85rem; }

        @media (max-width: 700px) {
            header, #dashboard, .breadcrumb { padding-left: 20px; padding-right: 20px; }
            table { font-size: 0.8rem; }
        }
      `}</style>
    </>
  )
}
