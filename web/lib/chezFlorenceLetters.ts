// lib/chezFlorenceLetters.ts
// Table lettre → image pour l'effet de survol par lettre (LetterHoverTitle),
// utilisée à la fois sur le "CHEZ FLORENCE" du footer et le "FLORENCE" du
// Hero. Une image par lettre DISTINCTE — une lettre qui revient plusieurs
// fois (le E de FLORENCE, le C de CHEZ FLORENCE...) réutilise la même image.
//
// Remarque : 3 fichiers fournis (CH.webp, EN.webp, EZ.webp) ne sont pas
// utilisés ici — la correspondance ci-dessous mappe caractère par
// caractère (comme reveal_hover_image_par_lettre.html, qui découpe aussi
// lettre par lettre, pas par paire). Si l'intention était plutôt des boîtes
// à 2 lettres (CH / EZ / ... / EN), c'est un remaniement rapide à faire —
// dis-le-moi.

import { cld } from './cloudinary'

export const CHEZ_FLORENCE_LETTER_IMAGES: Record<string, string> = {
  C: cld('/IMAGES/CHEZ FLORENCE/C.webp'),
  H: cld('/IMAGES/CHEZ FLORENCE/H.webp'),
  E: cld('/IMAGES/CHEZ FLORENCE/E.webp'),
  Z: cld('/IMAGES/CHEZ FLORENCE/Z.webp'),
  F: cld('/IMAGES/CHEZ FLORENCE/F.webp'),
  L: cld('/IMAGES/CHEZ FLORENCE/L.webp'),
  O: cld('/IMAGES/CHEZ FLORENCE/O.webp'),
  R: cld('/IMAGES/CHEZ FLORENCE/R.webp'),
  N: cld('/IMAGES/CHEZ FLORENCE/N.webp'),
}

// Pool pour l'effet "image aléatoire au survol" des titres de section —
// mêmes 12 fichiers (les 9 lettres + les 3 combos CH/EN/EZ, non utilisés
// ci-dessus, servent ici de variété supplémentaire).
export const CHEZ_FLORENCE_IMAGE_POOL: string[] = [
  ...Object.values(CHEZ_FLORENCE_LETTER_IMAGES),
  cld('/IMAGES/CHEZ FLORENCE/CH.webp'),
  cld('/IMAGES/CHEZ FLORENCE/EN.webp'),
  cld('/IMAGES/CHEZ FLORENCE/EZ.webp'),
]
