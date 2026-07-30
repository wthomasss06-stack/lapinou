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
// toutes les images du fichier txt (loader + curseurs) mélangées au hasard.
export const CHEZ_FLORENCE_IMAGE_POOL: string[] = [
  cld('/IMAGES/loader/bunny-marble.png'),
  cld('/IMAGES/loader/bunny-purple.webp'),
  cld('/IMAGES/loader/bunny-red.webp'),
  cld('/IMAGES/loader/bunny-rust.webp'),
  cld('/IMAGES/loader/bunny-amber.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/k.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/kkkk.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ll.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/llllllll.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/p.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/v.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/www.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/b.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/BB.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/bbb.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/bunny-amberB.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 15_07_14DDD.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 15_17_17hh.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 15_17_24bb.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 15_19_56.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 15_20_16.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 15_20_26.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 15_43_11.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 15_45_34.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 15_46_57.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 15_50_53.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 15_53_20.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_06_25.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_08_38.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_10_07.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_13_22.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_19_32.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_19_32ddddddd.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_19_32gggg.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_19_32ssss.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_19_32xxxx.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_21_05ddd.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_21_05ssss.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_21_05xx.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_21_05zzzz.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_23_18cccc.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_23_18xx.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_34_26nnnnnn.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_34_26zzz.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_37_54.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_37_54ooo.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_37_54v.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_39_32aaaaa.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_39_32bbbbll.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_39_32qq.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_40_47ccc.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_40_47ddd.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_40_47hhhhh.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_40_47qqq.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_40_47sssss.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 16_40_47vvvvv.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 17_46_47.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 17_46_47bbbbb.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 17_46_47m.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 17_46_47nn.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ChatGPT Image 29 juil. 2026, 17_46_47nnnnnn.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/ddddd.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/dddddddddd.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/h.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/hh.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/HHHH.webp'),
  cld('/IMAGES/CURSEUR TEXTE TITRE PROJECTIL/jjjj.webp'),
]