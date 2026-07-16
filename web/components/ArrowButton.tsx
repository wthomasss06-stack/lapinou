import Link from 'next/link'

// Port du hover .cf-card-link-arrow / .cf-mobile-item-arrow de l'ancien
// StaggeredMenu — un seul composant, tous les CTA du site l'utilisent
// (au lieu de chacun avoir son propre style de bouton).
function Arrow() {
  return (
    <span className="cf-arrow-btn-circle">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M7 17L17 7M17 7H7M17 7V17" />
      </svg>
    </span>
  )
}

type Props = {
  href: string
  children: React.ReactNode
  solid?: boolean
  external?: boolean
  className?: string
}

export default function ArrowButton({ href, children, solid, external, className = '' }: Props) {
  const cls = `cf-arrow-btn${solid ? ' cf-arrow-btn--solid' : ''} hover-target ${className}`.trim()

  if (external || href.startsWith('http') || href.startsWith('#')) {
    return (
      <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} className={cls}>
        {children}
        <Arrow />
      </a>
    )
  }

  return (
    <Link href={href} className={cls}>
      {children}
      <Arrow />
    </Link>
  )
}
