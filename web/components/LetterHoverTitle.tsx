'use client'
// Port de reveal_hover_image_par_lettre.html : chaque lettre a sa PROPRE
// image dédiée (contrairement à CharSplitHeading qui pioche au hasard dans
// un pool) — la boîte s'élargit et la lettre laisse place à l'image au
// survol (souris ou tap tactile, géré en CSS pur comme l'original).

interface LetterHoverTitleProps {
  text: string
  letterImages: Record<string, string>
  as?: 'div' | 'h1' | 'h2' | 'span'
  className?: string
}

export default function LetterHoverTitle({ text, letterImages, as: Tag = 'div', className = '' }: LetterHoverTitleProps) {
  return (
    <Tag className={`letter-hover-title ${className}`.trim()} aria-label={text}>
      {text.split('').map((ch, i) =>
        ch === ' ' ? (
          <span key={i} className="letter-hover-gap" aria-hidden="true" />
        ) : (
          <span key={i} className="letter-hover-box" aria-hidden="true">
            <span className="letter-hover-char">{ch}</span>
            {letterImages[ch.toUpperCase()] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="letter-hover-image" src={letterImages[ch.toUpperCase()]} alt="" />
            )}
          </span>
        )
      )}
    </Tag>
  )
}
