'use client'
// Port de reveal_hover_image_par_lettre.html : chaque lettre a sa PROPRE
// image dédiée (contrairement à CharSplitHeading qui pioche au hasard dans
// un pool) — la boîte s'élargit et la lettre laisse place à l'image au
// survol (souris ou tap tactile, géré en CSS pur comme l'original).
//
// `words` : un mot par ligne, forcée (ex: ['CHEZ', 'FLORENCE'] → toujours
// 2 lignes, jamais de retour à la ligne imprévisible au milieu d'un mot,
// que ce soit desktop ou mobile).

interface LetterHoverTitleProps {
  words: string[]
  letterImages: Record<string, string>
  as?: 'div' | 'h1' | 'h2'
  className?: string
}

export default function LetterHoverTitle({ words, letterImages, as: Tag = 'div', className = '' }: LetterHoverTitleProps) {
  return (
    <Tag className={`letter-hover-title ${className}`.trim()} aria-label={words.join(' ')}>
      {words.map((word, wi) => (
        <span className="letter-hover-word" key={wi}>
          {word.split('').map((ch, i) => (
            <span key={i} className="letter-hover-box" aria-hidden="true">
              <span className="letter-hover-char">{ch}</span>
              {letterImages[ch.toUpperCase()] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="letter-hover-image" src={letterImages[ch.toUpperCase()]} alt="" />
              )}
            </span>
          ))}
        </span>
      ))}
    </Tag>
  )
}

