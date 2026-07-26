'use client'
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import Image from 'next/image'
import { formatPrice } from '@/lib/status'
import './CircularGallery.css'

// Reconstruction DOM/CSS de la galerie circulaire — remplace l'ancienne
// version WebGL (port de PHOTO_CIRCULAIRE.html) qui déformait les images
// sur la courbe "bend" : un canvas ne peut pas à la fois courber le plan
// ET garder chaque image parfaitement rectangulaire, et il ne peut pas
// non plus accueillir un vrai overlay DOM au survol ni un vrai <Link> au
// clic. Ici, seule la DISPOSITION est circulaire (chaque carte tourne
// autour d'un cylindre virtuel via rotateY+translateZ) ; chaque carte
// elle-même reste un <img> bien rectangulaire, avec un overlay
// nom/description/prix qui apparaît au survol, et navigue au clic comme
// n'importe quel lien. API externe identique à l'ancienne version
// (items / onActiveIndexChange / onItemActivate / ref.next() / ref.prev())
// pour ne rien changer côté LapinsFeaturedSection.tsx.

const AUTO_ROTATE_SPEED = 0.045 // deg/frame, en veille
const DRAG_SENSITIVITY = 0.35 // deg par px de drag horizontal
const SNAP_EASE = 0.12
const IDLE_RESUME_DELAY = 2600 // ms avant que l'autoplay reprenne après une interaction

const CircularGallery = forwardRef(function CircularGallery(
  { items = [], onActiveIndexChange, onItemActivate },
  ref
) {
  const trackRef = useRef(null)
  const cardRefs = useRef([])
  const n = items.length

  // Angle courant (ref, pas de re-render à chaque frame) + cible pour le
  // snap. activeIndex, lui, est du state React : il ne change qu'au
  // repos, donc un re-render occasionnel ne coûte rien.
  const angleRef = useRef(0)
  const targetAngleRef = useRef(0)
  const velocityRef = useRef(0)
  const draggingRef = useRef(false)
  const dragStartXRef = useRef(0)
  const dragStartAngleRef = useRef(0)
  const lastPointerXRef = useRef(0)
  const lastMoveTimeRef = useRef(0)
  const idleUntilRef = useRef(0)
  const [activeIndex, setActiveIndex] = useState(0)

  const step = n > 0 ? 360 / n : 0
  // Rayon calibré pour qu'à ~5-8 cartes elles ne se chevauchent pas —
  // grossièrement proportionnel au nombre de cartes (cercle plus large
  // s'il y a plus de cartes à répartir). Constantes mises à l'échelle
  // avec la largeur de carte (260px → 320px, soit ×1.23) pour garder le
  // même espacement relatif.
  const radius = Math.max(400, n * 96)

  const nearestIndex = useCallback((angle) => {
    if (n === 0) return 0
    // La carte i est "face caméra" quand son propre angle ramène la
    // rotation totale à 0 (mod 360) — donc l'index actif est celui dont
    // -angle est le plus proche d'un multiple de step.
    const normalized = ((-angle % 360) + 360) % 360
    return Math.round(normalized / step) % n
  }, [n, step])

  const applyTransform = useCallback(() => {
    if (trackRef.current) {
      trackRef.current.style.transform = `translateZ(-${radius}px) rotateY(${angleRef.current}deg)`
    }
  }, [radius])

  // ── Boucle d'animation : autoplay en veille, glisse vers targetAngle
  //    (drag relâché / next/prev), sinon suit le drag en direct.
  useEffect(() => {
    if (n === 0) return
    let raf
    const tick = (t) => {
      if (draggingRef.current) {
        // rien à faire ici : onPointerMove met déjà angleRef à jour
      } else if (Math.abs(targetAngleRef.current - angleRef.current) > 0.05) {
        angleRef.current += (targetAngleRef.current - angleRef.current) * SNAP_EASE
      } else if (t > idleUntilRef.current) {
        angleRef.current -= AUTO_ROTATE_SPEED
        targetAngleRef.current = angleRef.current
      }
      applyTransform()
      const idx = nearestIndex(angleRef.current)
      setActiveIndex((prev) => (prev === idx ? prev : idx))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [n, applyTransform, nearestIndex])

  useEffect(() => {
    onActiveIndexChange?.(activeIndex)
  }, [activeIndex, onActiveIndexChange])

  const goToIndex = useCallback((idx) => {
    const wrapped = ((idx % n) + n) % n
    // Cible l'angle multiple de step le plus proche de l'angle courant
    // qui correspond à cet index (pour ne pas repartir dans le mauvais sens).
    const current = angleRef.current
    const base = -wrapped * step
    const k = Math.round((current - base) / 360)
    targetAngleRef.current = base + k * 360
    idleUntilRef.current = performance.now() + IDLE_RESUME_DELAY
  }, [n, step])

  useImperativeHandle(ref, () => ({
    next: () => goToIndex(nearestIndex(angleRef.current) + 1),
    prev: () => goToIndex(nearestIndex(angleRef.current) - 1),
  }), [goToIndex, nearestIndex])

  // ── Drag (souris + tactile) ──
  const onPointerDown = (e) => {
    draggingRef.current = true
    dragStartXRef.current = e.clientX
    dragStartAngleRef.current = angleRef.current
    lastPointerXRef.current = e.clientX
    lastMoveTimeRef.current = performance.now()
    velocityRef.current = 0
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }
  const onPointerMove = (e) => {
    if (!draggingRef.current) return
    const dx = e.clientX - dragStartXRef.current
    angleRef.current = dragStartAngleRef.current + dx * DRAG_SENSITIVITY
    const now = performance.now()
    const dt = Math.max(1, now - lastMoveTimeRef.current)
    velocityRef.current = ((e.clientX - lastPointerXRef.current) * DRAG_SENSITIVITY) / dt * 16
    lastPointerXRef.current = e.clientX
    lastMoveTimeRef.current = now
  }
  const endDrag = () => {
    if (!draggingRef.current) return
    draggingRef.current = false
    // Petite inertie, puis snap sur la carte la plus proche.
    const projected = angleRef.current + velocityRef.current * 4
    goToIndex(nearestIndex(projected))
  }

  if (n === 0) return null

  return (
    <div
      className="circular-gallery-3d"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
      role="region"
      aria-label="Galerie circulaire des lapins en vedette"
    >
      <div className="circular-gallery-track" ref={trackRef}>
        {items.map((item, i) => (
          <button
            type="button"
            key={item.slug || i}
            ref={(el) => { cardRefs.current[i] = el }}
            className={`circular-card${item.unavailable ? ' is-unavailable' : ''}${i === activeIndex ? ' is-active' : ''}`}
            style={{ transform: `rotateY(${i * step}deg) translateZ(${radius}px)` }}
            onClick={(e) => {
              // Un clic qui termine un drag ne doit pas déclencher la
              // navigation (sinon: on relâche après avoir glissé = ouverture
              // accidentelle de la fiche).
              if (Math.abs(velocityRef.current) > 0.3) { e.preventDefault(); return }
              onItemActivate?.(i)
            }}
            aria-label={`${item.name} — ${formatPrice(item.price)}`}
          >
            <span className="circular-card-media">
              <Image src={item.image} alt={item.name} fill sizes="400px" style={{ objectFit: 'cover' }} draggable={false} />
            </span>
            <span className="circular-card-info">
              <span className="circular-card-top">
                <span className="circular-card-name">{item.name}</span>
                <span className={`circular-card-badge${!item.unavailable && item.stock <= 4 ? ' low' : ''}`}>
                  {item.unavailable ? 'Stock épuisé' : `${item.stock} en stock`}
                </span>
              </span>
              <span className="circular-card-desc">
                {item.breed}{item.weight ? ` · ${item.weight} kg` : ''}
              </span>
              <span className="circular-card-price">
                {item.unavailable ? 'Épuisé' : formatPrice(item.price)}
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  )
})

export default CircularGallery
