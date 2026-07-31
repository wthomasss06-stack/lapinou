import { forwardRef } from 'react'
import Link from 'next/link'
import HoverFadeText from './HoverFadeText'

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
  children: string
  solid?: boolean
  block?: boolean
  external?: boolean
  className?: string
  onClick?: () => void
}

const ArrowButton = forwardRef<HTMLAnchorElement, Props>(function ArrowButton(
  { href, children, solid, block, external, className = '', onClick },
  ref
) {
  const cls = [
    'cf-arrow-btn',
    solid && 'cf-arrow-btn--solid',
    block && 'cf-arrow-btn--block',
    'hover-target',
    className,
  ].filter(Boolean).join(' ')

  if (external || href.startsWith('http') || href.startsWith('#')) {
    return (
      <a
        ref={ref}
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className={cls}
        onClick={onClick}
      >
        <HoverFadeText>{children}</HoverFadeText>
        <Arrow />
      </a>
    )
  }

  return (
    <Link ref={ref as React.Ref<HTMLAnchorElement>} href={href} className={cls} onClick={onClick}>
      <HoverFadeText>{children}</HoverFadeText>
      <Arrow />
    </Link>
  )
})

export default ArrowButton
