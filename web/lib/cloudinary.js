// lib/cloudinary.js
// Convertit un chemin local ('/IMAGES/xxx.ext') en URL Cloudinary — même
// arborescence, juste une autre origine + optimisation auto (format + qualité).
//
// Pourquoi : tout le dossier public/IMAGES (photos + vidéos du site, hero
// compris) est aujourd'hui committé dans le repo Git et servi par Vercel à
// chaque build/déploiement. Ça alourdit le repo et les déploiements, et
// Vercel ne fait aucune optimisation vidéo (pas de transcodage, pas de
// compression adaptative — un .webm de 8 Mo reste un .webm de 8 Mo).
// Cloudinary sert exactement les mêmes fichiers depuis un CDN, dans le
// format/poids le plus léger que le navigateur du visiteur accepte
// (AVIF/WebP pour les images, VP9/H.265 pour la vidéo, etc.) — même rendu,
// en plus léger et sans alourdir le repo.
//
// Usage : cld('/IMAGES/Snapchat-908462874.webp') — le chemin d'entrée est
// identique à ce qui était utilisé en local, seule l'origine change.
// L'upload correspondant se fait via api/scripts/upload-images-to-cloudinary.js
// (même arborescence, mêmes noms — donc rien à mapper à la main ici).

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dwuybrjxh'

// Racine Cloudinary — miroir exact du dossier local web/public/IMAGES.
const BASE_FOLDER = 'chez-florence/IMAGES'

const VIDEO_EXTENSIONS = new Set(['webm', 'mp4', 'mov'])

/**
 * @param {string} localPath - chemin local tel qu'utilisé avant, ex: '/IMAGES/foo/bar.webp'
 * @param {{ width?: number }} [options] - largeur optionnelle (sinon Cloudinary sert l'original, juste optimisé format/qualité)
 * @returns {string} URL Cloudinary prête à mettre dans un src/poster/background-image
 */
export function cld(localPath, options = {}) {
  const clean = localPath.replace(/^\/?IMAGES\//, '')
  const dotIndex = clean.lastIndexOf('.')
  const base = dotIndex !== -1 ? clean.slice(0, dotIndex) : clean
  const ext = dotIndex !== -1 ? clean.slice(dotIndex + 1).toLowerCase() : 'jpg'
  const resourceType = VIDEO_EXTENSIONS.has(ext) ? 'video' : 'image'

  const transforms = ['f_auto', 'q_auto']
  if (options.width) transforms.push(`w_${options.width}`)

  return `https://res.cloudinary.com/${CLOUD_NAME}/${resourceType}/upload/${transforms.join(',')}/${BASE_FOLDER}/${base}.${ext}`
}
