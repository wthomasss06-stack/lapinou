import { AlertTriangle, Lightbulb, Mail } from 'lucide-react'

// Blocs de rendu partagés entre /conditions et /confidentialite — port
// direct de .toc / .section / .article-num / .highlight-box (conditions.html,
// confidentialite.html — même système visuel dans les deux).

export type LegalNote = { icon: 'warning' | 'tip' | 'mail'; text: string }
export type LegalSub = {
  title: string
  body?: string[]
  items?: string[]
  ordered?: boolean
  table?: { headers: string[]; rows: string[][] }
  note?: LegalNote
}
export type LegalSection = {
  num?: number
  id?: string
  title: string
  body?: string[]
  items?: string[]
  ordered?: boolean
  subs?: LegalSub[]
  note?: LegalNote
}

export function LegalToc({ sections }: { sections: LegalSection[] }) {
  return (
    <nav className="toc">
      <h3>Sommaire</h3>
      <ul>
        {sections.map((s) => (
          <li key={s.id}><a href={`#${s.id}`}>{s.title}</a></li>
        ))}
      </ul>
    </nav>
  )
}

function NoteBox({ note }: { note: LegalNote }) {
  const Icon = note.icon === 'warning' ? AlertTriangle : note.icon === 'tip' ? Lightbulb : Mail
  const label = note.icon === 'warning' ? 'Important' : note.icon === 'tip' ? 'Conseil' : 'Contact'
  return (
    <div className={`highlight-box${note.icon === 'warning' ? ' warning' : ''}`}>
      <p>
        <Icon size={14} style={{ display: 'inline', verticalAlign: '-2px', marginRight: '6px' }} />
        <strong>{label} : </strong>
        {note.text}
      </p>
    </div>
  )
}

function ListBlock({ items, ordered }: { items: string[]; ordered?: boolean }) {
  const Tag = ordered ? 'ol' : 'ul'
  return <Tag>{items.map((it) => <li key={it}>{it}</li>)}</Tag>
}

function SubBlock({ sub }: { sub: LegalSub }) {
  return (
    <>
      {sub.title && <h3>{sub.title}</h3>}
      {sub.body?.map((p, i) => <p key={i}>{p}</p>)}
      {sub.items && <ListBlock items={sub.items} ordered={sub.ordered} />}
      {sub.table && (
        <table style={{ width: '100%', borderCollapse: 'collapse', margin: '16px 0', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--rust)' }}>
              {sub.table.headers.map((h) => (
                <th key={h} style={{ textAlign: 'left', padding: '12px 0', fontWeight: 700, color: 'var(--paper)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sub.table.rows.map((row, i) => (
              <tr key={i} style={{ borderBottom: i < sub.table!.rows.length - 1 ? '1px solid rgba(243,233,218,0.12)' : 'none' }}>
                {row.map((cell, j) => (
                  <td key={j} style={{ padding: '10px 0', fontWeight: j === row.length - 1 ? 700 : 400, color: j === row.length - 1 ? 'var(--rust)' : 'rgba(243,233,218,0.85)' }}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {sub.note && <NoteBox note={sub.note} />}
    </>
  )
}

export function LegalSectionBlock({ section }: { section: LegalSection }) {
  return (
    <div className="section" id={section.id}>
      <h2>{section.num != null && <span className="article-num">{section.num}</span>}{section.title}</h2>
      {section.body?.map((p, j) => <p key={j}>{p}</p>)}
      {section.items && <ListBlock items={section.items} ordered={section.ordered} />}
      {section.subs?.map((sub, k) => <SubBlock sub={sub} key={k} />)}
      {section.note && <NoteBox note={section.note} />}
    </div>
  )
}
