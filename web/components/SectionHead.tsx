import type { ReactNode } from 'react'

type SectionHeadProps = {
  number: number
  eyebrow: string
  title: ReactNode
  desc?: ReactNode
  footer?: ReactNode
  className?: string
}

/** En-tête éditorial alterné : impair → num gauche / titre droite ; pair → inversé. */
export default function SectionHead({ number, eyebrow, title, desc, footer, className = '' }: SectionHeadProps) {
  const numStr = String(number).padStart(2, '0')
  const inverted = number % 2 === 0

  const num = (
    <div className="editorial-head__num" aria-hidden="true">
      {numStr}
    </div>
  )

  const titleBlock = (
    <div className="editorial-head__title-block">
      <p className="editorial-head__eyebrow">{eyebrow}</p>
      <div className="editorial-head__title">{title}</div>
    </div>
  )

  return (
    <header
      className={`section-head editorial-head${inverted ? ' editorial-head--invert' : ''}${className ? ` ${className}` : ''}`}
    >
      <div className="editorial-head__row">
        {inverted ? (
          <>
            {titleBlock}
            {num}
          </>
        ) : (
          <>
            {num}
            {titleBlock}
          </>
        )}
      </div>
      {desc ? <div className="editorial-head__desc">{desc}</div> : null}
      {footer ? <div className="editorial-head__footer">{footer}</div> : null}
    </header>
  )
}
