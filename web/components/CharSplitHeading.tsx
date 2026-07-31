'use client'
import { useEffect, useRef } from 'react'
import { wireHoverImageChars } from '@/lib/hoverImageChars'

// Découpe un titre (une ou plusieurs lignes) en caractères et affiche une
// image flottante au survol du caractère le plus proche du curseur — port
// de teeeextoooo_prooo.html (Effect 086), voir lib/hoverImageChars.ts.
//
// Les lettres sont regroupées par MOT (chaque mot est un bloc insécable) :
// sur mobile, si une ligne ne tient pas, le retour à la ligne se fait entre
// les mots, jamais au milieu d'un mot (bug corrigé : "CHAQUE BESOIN" ne se
// coupe plus en "CHAQUE BESOI" / "N").
//
// À utiliser pour les titres qui n'ont PAS déjà de découpage par caractère
// (.reveal-text, page-title, cat-title...). Les titres portant déjà
// .elastic-title sont découpés par GSAP SplitText dans useGsapLenis.ts —
// ce même hook y branche déjà l'effet hover-image, pas besoin de ce
// composant pour ceux-là (sinon double découpage en conflit).

interface CharSplitHeadingProps {
  lines: string[]
  images: string[]
  as?: 'h1' | 'h2'
  className?: string
}

export default function CharSplitHeading({ lines, images, as: Tag = 'h2', className = '' }: CharSplitHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (!ref.current) return
    return wireHoverImageChars(ref.current, '.hover-char', images)
  }, [images])

  return (
    <Tag ref={ref} className={className}>
      {lines.map((line, li) => (
        <span className="hover-char-line" key={li}>
          {line.split(' ').map((word, wi, arr) => (
            <span className="hover-char-word" key={wi} style={{ marginRight: wi < arr.length - 1 ? '0.45em' : 0 }}>
              {word.split('').map((ch, ci) => (
                <span className="hover-char" key={ci}>{ch}</span>
              ))}
            </span>
          ))}
        </span>
      ))}
    </Tag>
  )
}

