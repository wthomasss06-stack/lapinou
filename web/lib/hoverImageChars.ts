// lib/hoverImageChars.ts
// Utilitaire partagé, indépendant du framework : au survol d'un conteneur
// dont le texte est déjà découpé en caractères (un <span> par lettre —
// que ce découpage vienne de GSAP SplitText avec charsClass: 'hero-char',
// ou de notre propre CharSplitHeading), affiche une image flottante à côté
// du caractère le plus proche du curseur, choisie au hasard dans un pool.
// Port de teeeextoooo_prooo.html (Effect 086), généralisé à un nombre
// arbitraire de caractères et de lignes (distance 2D, pas seulement X —
// la version d'origine ne gérait qu'une seule ligne dans un <li>).
//
// Utilisation : appeler une fois le conteneur monté (et son texte déjà
// découpé en caractères), garder la fonction de nettoyage retournée pour
// la rappeler au démontage.

export function wireHoverImageChars(
  container: HTMLElement,
  charSelector: string,
  images: string[]
): () => void {
  if (!images.length) return () => {}
  const chars = Array.from(container.querySelectorAll<HTMLElement>(charSelector))
  if (!chars.length) return () => {}

  const img = document.createElement('img')
  img.className = 'hover-char-image'
  img.alt = ''
  img.setAttribute('aria-hidden', 'true')
  if (!container.style.position) container.style.position = 'relative'
  container.appendChild(img)

  let active: HTMLElement | null = null

  function nearestChar(x: number, y: number) {
    let best: HTMLElement | null = null
    let bestDist = Infinity
    for (const el of chars) {
      const r = el.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      const d = (cx - x) ** 2 + (cy - y) ** 2
      if (d < bestDist) { bestDist = d; best = el }
    }
    return best
  }

  function place(el: HTMLElement) {
    const containerRect = container.getBoundingClientRect()
    const r = el.getBoundingClientRect()
    img.style.left = `${r.left - containerRect.left + r.width / 2}px`
    img.style.top = `${r.top - containerRect.top + r.height / 2}px`
  }

  function showAt(x: number, y: number) {
    const nearest = nearestChar(x, y)
    if (!nearest) return
    if (nearest !== active) {
      active = nearest
      img.src = images[Math.floor(Math.random() * images.length)]
      place(active)
    }
  }

  function onMouseEnter(e: MouseEvent) {
    showAt(e.clientX, e.clientY)
    img.classList.add('is-active')
  }
  function onMouseMove(e: MouseEvent) {
    showAt(e.clientX, e.clientY)
  }
  function onMouseLeave() {
    img.classList.remove('is-active')
    active = null
  }
  function onTouchStart(e: TouchEvent) {
    const t = e.touches[0]
    if (!t) return
    showAt(t.clientX, t.clientY)
    img.classList.add('is-active')
    window.setTimeout(onMouseLeave, 900)
  }

  container.addEventListener('mouseenter', onMouseEnter)
  container.addEventListener('mousemove', onMouseMove)
  container.addEventListener('mouseleave', onMouseLeave)
  container.addEventListener('touchstart', onTouchStart, { passive: true })

  return () => {
    container.removeEventListener('mouseenter', onMouseEnter)
    container.removeEventListener('mousemove', onMouseMove)
    container.removeEventListener('mouseleave', onMouseLeave)
    container.removeEventListener('touchstart', onTouchStart)
    img.remove()
  }
}

// Variante "lettre → image dédiée" (pas un pool aléatoire) pour des
// caractères déjà découpés par GSAP SplitText, dont on lit directement le
// contenu textuel — utilisée pour le "FLORENCE" du Hero avec la même table
// que le footer (lib/chezFlorenceLetters.ts). Contrairement à
// LetterHoverTitle (qui élargit la boîte), ici l'image se pose simplement
// par-dessus le caractère existant : on ne veut pas faire bouger la mise
// en page des .hero-char voisins gérés par l'animation d'entrée GSAP.
export function wireLetterDedicatedHoverImages(
  chars: HTMLElement[] | ArrayLike<Element>,
  letterImages: Record<string, string>
): () => void {
  const cleanups: Array<() => void> = []

  Array.from(chars as ArrayLike<HTMLElement>).forEach((el) => {
    const letter = (el.textContent || '').trim().toUpperCase()
    const src = letterImages[letter]
    if (!src) return

    if (!el.style.position) el.style.position = 'relative'

    const img = document.createElement('img')
    img.className = 'hero-letter-hover-image'
    img.alt = ''
    img.src = src
    el.appendChild(img)

    const onEnter = () => img.classList.add('is-active')
    const onLeave = () => img.classList.remove('is-active')
    const onTouch = () => { onEnter(); window.setTimeout(onLeave, 900) }

    el.addEventListener('mouseenter', onEnter)
    el.addEventListener('mouseleave', onLeave)
    el.addEventListener('touchstart', onTouch, { passive: true })

    cleanups.push(() => {
      el.removeEventListener('mouseenter', onEnter)
      el.removeEventListener('mouseleave', onLeave)
      el.removeEventListener('touchstart', onTouch)
      img.remove()
    })
  })

  return () => cleanups.forEach((fn) => fn())
}

// Variante "chiffre → pool d'images dédié" pour les numéros de section
// (SectionHead, ex. "07"), déjà découpés en .hero-char par le même
// SplitText que les titres (voir la boucle .elastic-title de
// useGsapLenis.ts). Contrairement à wireLetterDedicatedHoverImages (une
// seule image fixe par lettre), chaque chiffre a ICI plusieurs variantes
// (public/IMAGES/num, voir lib/numberHoverImages.ts) et on en tire une au
// hasard à chaque survol — même logique de tirage que wireHoverImageChars,
// mais ancrée sur le caractère exact plutôt que le plus proche du curseur.
export function wireDigitHoverImages(
  container: HTMLElement,
  charSelector: string,
  pools: Record<string, string[]>
): () => void {
  const chars = Array.from(container.querySelectorAll<HTMLElement>(charSelector))
  if (!chars.length) return () => {}

  const cleanups: Array<() => void> = []

  chars.forEach((el) => {
    const digit = (el.textContent || '').trim()
    const pool = pools[digit]
    if (!pool || !pool.length) return

    if (!el.style.position) el.style.position = 'relative'

    const img = document.createElement('img')
    img.className = 'num-hover-image'
    img.alt = ''
    img.setAttribute('aria-hidden', 'true')
    el.appendChild(img)

    const roll = () => {
      img.src = pool[Math.floor(Math.random() * pool.length)]
      // Légère rotation aléatoire à chaque tirage — même image répétée
      // plusieurs fois au survol n'a alors jamais l'air parfaitement figée.
      img.style.setProperty('--num-rot', `${(Math.random() * 16 - 8).toFixed(1)}deg`)
    }

    const onEnter = () => { roll(); img.classList.add('is-active') }
    const onLeave = () => img.classList.remove('is-active')
    const onTouch = () => { onEnter(); window.setTimeout(onLeave, 900) }

    el.addEventListener('mouseenter', onEnter)
    el.addEventListener('mouseleave', onLeave)
    el.addEventListener('touchstart', onTouch, { passive: true })

    cleanups.push(() => {
      el.removeEventListener('mouseenter', onEnter)
      el.removeEventListener('mouseleave', onLeave)
      el.removeEventListener('touchstart', onTouch)
      img.remove()
    })
  })

  return () => cleanups.forEach((fn) => fn())
}

