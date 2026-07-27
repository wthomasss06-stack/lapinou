'use client'

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/status'
import './CircularGallery.css'

const AUTO_ROTATE_SPEED = 0.045
const DRAG_SENSITIVITY = 0.35
const SNAP_EASE = 0.12
const IDLE_RESUME_DELAY = 2600
const CLICK_THRESHOLD_PX = 6

const CircularGallery = forwardRef(function CircularGallery(
  {
    items = [],
    onActiveIndexChange = () => {},
    onItemActivate = () => {},
  }: {
    items: any[]
    onActiveIndexChange?: (index: number) => void
    onItemActivate?: (index: number) => void
  },
  ref: any
) {
  const trackRef = useRef<HTMLDivElement>(null)
  const n = items.length

  const angleRef = useRef(0)
  const targetAngleRef = useRef(0)
  const velocityRef = useRef(0)
  const draggingRef = useRef(false)
  const dragStartXRef = useRef(0)
  const dragStartAngleRef = useRef(0)
  const lastPointerXRef = useRef(0)
  const lastMoveTimeRef = useRef(0)
  const idleUntilRef = useRef(0)
  const dragDeltaRef = useRef(0)
  const [activeIndex, setActiveIndex] = useState(0)

  const step = n > 0 ? 360 / n : 0
  const radius = Math.max(400, n * 96)

  const nearestIndex = useCallback((angle: number) => {
    if (n === 0) return 0
    const normalized = ((-angle % 360) + 360) % 360
    return Math.round(normalized / step) % n
  }, [n, step])

  const applyTransform = useCallback(() => {
    if (trackRef.current) {
      trackRef.current.style.transform = `translateZ(-${radius}px) rotateY(${angleRef.current}deg)`
    }
  }, [radius])

  // ── Boucle d'animation ──
  useEffect(() => {
    if (n === 0) return
    let raf: number
    const tick = (t: number) => {
      if (draggingRef.current) {
        // rien : le drag met à jour angleRef en direct
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

  const goToIndex = useCallback((idx: number) => {
    const wrapped = ((idx % n) + n) % n
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

  // ── Drag sur window (pas de setPointerCapture = les <Link> gardent leurs clics) ──
  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (!draggingRef.current) return
    const dx = e.clientX - dragStartXRef.current
    angleRef.current = dragStartAngleRef.current + dx * DRAG_SENSITIVITY
    dragDeltaRef.current = Math.abs(dx)
    const now = performance.now()
    const dt = Math.max(1, now - lastMoveTimeRef.current)
    velocityRef.current = ((e.clientX - lastPointerXRef.current) * DRAG_SENSITIVITY) / dt * 16
    lastPointerXRef.current = e.clientX
    lastMoveTimeRef.current = now
  }, [])

  const handlePointerUp = useCallback(() => {
    if (!draggingRef.current) return
    draggingRef.current = false
    window.removeEventListener('pointermove', handlePointerMove)
    window.removeEventListener('pointerup', handlePointerUp)

    if (dragDeltaRef.current < CLICK_THRESHOLD_PX) {
      // Clic court : laisser le <Link> naviguer normalement
      velocityRef.current = 0
      return
    }

    // Snap avec inertie
    const projected = angleRef.current + velocityRef.current * 4
    velocityRef.current = 0
    goToIndex(nearestIndex(projected))
  }, [handlePointerMove, goToIndex, nearestIndex])

  const onPointerDown = (e: React.PointerEvent) => {
    draggingRef.current = true
    dragStartXRef.current = e.clientX
    dragStartAngleRef.current = angleRef.current
    lastPointerXRef.current = e.clientX
    lastMoveTimeRef.current = performance.now()
    velocityRef.current = 0
    dragDeltaRef.current = 0

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
  }

  // ── Molette / trackpad + flèches clavier (port de PHOTO_CIRCULAIRE.html :
  // wheel + keydown ArrowLeft/ArrowRight en plus du drag). ──
  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY || e.deltaX
    angleRef.current -= delta * 0.06
    targetAngleRef.current = angleRef.current
    idleUntilRef.current = performance.now() + IDLE_RESUME_DELAY
  }, [])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); goToIndex(nearestIndex(angleRef.current) + 1) }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); goToIndex(nearestIndex(angleRef.current) - 1) }
  }

  if (n === 0) return null

  return (
    <div
      className="circular-gallery-3d"
      onPointerDown={onPointerDown}
      onWheel={onWheel}
      onKeyDown={onKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Galerie circulaire des lapins en vedette — flèches gauche/droite, molette ou glisser pour naviguer"
    >
      <div className="circular-gallery-track" ref={trackRef}>
        {items.map((item, i) => {
          const isLowStock = !item.unavailable && item.stock > 0 && item.stock <= 4
          return (
            <Link
              key={item.slug || i}
              href={`/rabbits/${item.slug}`}
              className={`circular-card${item.unavailable ? ' is-unavailable' : ''}${i === activeIndex ? ' is-active' : ''}`}
              style={{ transform: `rotateY(${i * step}deg) translateZ(${radius}px)` }}
              onClick={(e) => {
                // Si on a dragué, on bloque la navigation
                if (dragDeltaRef.current >= CLICK_THRESHOLD_PX) {
                  e.preventDefault()
                } else {
                  onItemActivate?.(i)
                }
              }}
              aria-label={`${item.name} — ${formatPrice(item.price)}`}
            >
              <span className="circular-card-media">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="400px"
                  style={{ objectFit: 'cover' }}
                  draggable={false}
                  priority={i === 0}
                />
              </span>
              <span className="circular-card-info">
                <span className="circular-card-top">
                  <span className="circular-card-name">{item.name}</span>
                  <span className={`circular-card-badge${isLowStock ? ' low' : ''}`}>
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
            </Link>
          )
        })}
      </div>
    </div>
  )
})

export default CircularGallery