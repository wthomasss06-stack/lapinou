// lib/numberHoverImages.ts
import { cld } from './cloudinary'

// Pools d'images "chiffre" (IMAGES/num) pour l'effet de survol des
// numéros de section (SectionHead → .editorial-head__num). Chaque chiffre a
// plusieurs variantes (répétitions du chiffre, ex. 7 / 77 / 777777 /
// 77777777) ; wireDigitHoverImages (lib/hoverImageChars.ts) en tire une au
// hasard à chaque survol.
export const NUMBER_IMAGE_POOLS: Record<string, string[]> = {
  '0': [
    cld('/IMAGES/num/0.webp'),
    cld('/IMAGES/num/00.webp'),
    cld('/IMAGES/num/000.webp'),
    cld('/IMAGES/num/0000.webp'),
    cld('/IMAGES/num/00000.webp'),
    cld('/IMAGES/num/00000000.webp'),
    cld('/IMAGES/num/000000000.webp'),
  ],
  '1': [
    cld('/IMAGES/num/1.webp'),
    cld('/IMAGES/num/11.webp'),
    cld('/IMAGES/num/1111.webp'),
  ],
  '2': [
    cld('/IMAGES/num/2.webp'),
    cld('/IMAGES/num/22.webp'),
    cld('/IMAGES/num/2222222.webp'),
  ],
  '3': [
    cld('/IMAGES/num/3.webp'),
    cld('/IMAGES/num/33.webp'),
    cld('/IMAGES/num/3333333.webp'),
    cld('/IMAGES/num/33333333.webp'),
  ],
  '4': [
    cld('/IMAGES/num/4.webp'),
    cld('/IMAGES/num/44.webp'),
    cld('/IMAGES/num/444.webp'),
    cld('/IMAGES/num/44444.webp'),
  ],
  '5': [
    cld('/IMAGES/num/5.webp'),
    cld('/IMAGES/num/55.webp'),
  ],
  '6': [
    cld('/IMAGES/num/6.webp'),
    cld('/IMAGES/num/66.webp'),
    cld('/IMAGES/num/666666.webp'),
  ],
  '7': [
    cld('/IMAGES/num/7.webp'),
    cld('/IMAGES/num/77.webp'),
    cld('/IMAGES/num/777777.webp'),
    cld('/IMAGES/num/77777777.webp'),
  ],
}