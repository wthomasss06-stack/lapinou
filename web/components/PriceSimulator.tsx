'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import ArrowButton from './ArrowButton'
import {
  PRICE_PER_KG,
  SIM_MIN_KG,
  SIM_MAX_KG,
  SIM_STEP_KG,
  SIM_DEFAULT_KG,
  SIM_QUICK_PICKS_KG,
  priceForKg,
  snapKg,
  formatKg,
  formatFcfa,
} from '@/lib/pricing'
import './PriceSimulator.css'

// ═══════════════════════════════════════════════════════════════════
//  Simulateur de prix — « la balance »
//
//  Un seul tarif au kilo (lib/pricing.ts). On choisit un poids de 1 à
//  3 kg : le cadran, le compteur à rouleaux, le ticket et les formats
//  suivent. Tout le visuel se déduit de `kg` — aucune valeur en dur.
//  Animations : transform / opacity / stroke-dashoffset uniquement,
//  coupées si prefers-reduced-motion.
// ═══════════════════════════════════════════════════════════════════

// ─── Géométrie du cadran (viewBox 400 × 400) ─────────────────────────────────
const CX = 200
const CY = 200
const SWEEP_START = -120 // degrés depuis le haut, sens horaire
const SWEEP_END = 120
const ARC_R = 120
const TICK_STEPS = Math.round((SIM_MAX_KG - SIM_MIN_KG) / SIM_STEP_KG)

function polar(r: number, deg: number) {
  const rad = (deg * Math.PI) / 180
  return { x: CX + r * Math.sin(rad), y: CY - r * Math.cos(rad) }
}
const ratioOf = (kg: number) => (kg - SIM_MIN_KG) / (SIM_MAX_KG - SIM_MIN_KG)
const angleOf = (kg: number) => SWEEP_START + ratioOf(kg) * (SWEEP_END - SWEEP_START)

const ARC_FROM = polar(ARC_R, SWEEP_START)
const ARC_TO = polar(ARC_R, SWEEP_END)
const ARC_PATH = `M ${ARC_FROM.x.toFixed(2)} ${ARC_FROM.y.toFixed(2)} A ${ARC_R} ${ARC_R} 0 1 1 ${ARC_TO.x.toFixed(2)} ${ARC_TO.y.toFixed(2)}`

// Graduations : une par pas de 0,1 kg ; plus longues + numérotées tous les 0,5 kg
const TICKS = Array.from({ length: TICK_STEPS + 1 }, (_, i) => {
  const kg = Math.round((SIM_MIN_KG + i * SIM_STEP_KG) * 10) / 10
  const major = Math.abs(kg * 2 - Math.round(kg * 2)) < 1e-9 // multiple de 0,5
  const deg = SWEEP_START + (i / TICK_STEPS) * (SWEEP_END - SWEEP_START)
  const outer = polar(186, deg)
  const inner = polar(major ? 170 : 177, deg)
  const label = major ? polar(153, deg) : null
  return { kg, major, outer, inner, label }
})

// ─── Compteur à rouleaux ─────────────────────────────────────────────────────
const DIGIT_COLUMNS = String(priceForKg(SIM_MAX_KG)).length
const SEP_AFTER = DIGIT_COLUMNS - 3 // séparateur de milliers avant les 3 derniers chiffres
const ZERO_TO_NINE = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

function Odometer({ value }: { value: number }) {
  const chars = String(value).padStart(DIGIT_COLUMNS, ' ').split('')
  return (
    <span className="ps-odo" aria-hidden="true">
      {chars.map((ch, i) => {
        const blank = ch === ' '
        const fromRight = DIGIT_COLUMNS - 1 - i
        const style = { '--d': blank ? 0 : Number(ch), '--i': fromRight } as CSSProperties
        return (
          <span key={i} className="ps-odo-slot">
            {i === SEP_AFTER && <span className={`ps-odo-sep${chars[SEP_AFTER - 1] === ' ' ? ' is-blank' : ''}`} />}
            <span className={`ps-digit${blank ? ' is-blank' : ''}`} style={style}>
              <span className="ps-digit-strip">
                {ZERO_TO_NINE.map((n) => (
                  <span key={n}>{n}</span>
                ))}
              </span>
            </span>
          </span>
        )
      })}
    </span>
  )
}

// ─── Composant principal ─────────────────────────────────────────────────────
export default function PriceSimulator() {
  const [kg, setKg] = useState<number>(SIM_DEFAULT_KG)
  const [dragging, setDragging] = useState(false)
  const dialRef = useRef<HTMLDivElement>(null)
  const interactedRef = useRef(false)
  const timersRef = useRef<number[]>([])

  const price = priceForKg(kg)
  const ratio = ratioOf(kg)
  const angle = angleOf(kg)

  // Toute action de l'utilisateur annule l'intro automatique
  const chooseKg = useCallback((next: number) => {
    interactedRef.current = true
    timersRef.current.forEach((id) => window.clearTimeout(id))
    timersRef.current = []
    setKg(Math.min(SIM_MAX_KG, Math.max(SIM_MIN_KG, snapKg(next))))
  }, [])

  // Intro : une seule fois, quand la balance entre à l'écran, l'aiguille
  // parcourt toute la plage (1 → 3 kg) puis se pose sur le poids par défaut.
  useEffect(() => {
    const dial = dialRef.current
    if (!dial || typeof IntersectionObserver === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return
        observer.disconnect()
        if (interactedRef.current) return
        const sequence: Array<[number, number]> = [
          [SIM_MIN_KG, 0],
          [SIM_MAX_KG, 750],
          [SIM_DEFAULT_KG, 1850],
        ]
        timersRef.current = sequence.map(([value, delay]) =>
          window.setTimeout(() => {
            if (!interactedRef.current) setKg(value)
          }, delay)
        )
      },
      { threshold: 0.6 }
    )
    observer.observe(dial)
    return () => {
      observer.disconnect()
      timersRef.current.forEach((id) => window.clearTimeout(id))
    }
  }, [])

  // Pendant le glissement : l'aiguille suit le doigt sans inertie
  const startDrag = useCallback(() => {
    setDragging(true)
    const stop = () => {
      setDragging(false)
      window.removeEventListener('pointerup', stop)
      window.removeEventListener('pointercancel', stop)
    }
    window.addEventListener('pointerup', stop)
    window.addEventListener('pointercancel', stop)
  }, [])

  const railStyle = { '--t': ratio } as CSSProperties
  const knobStyle = { transform: `rotate(${angle}deg)` } as CSSProperties
  const valueText = `${formatKg(kg)} : ${formatFcfa(price)}`

  return (
    <div className="ps-wrap">
      <div className="ps" data-dragging={dragging ? '1' : undefined}>
        {/* ── La balance ─────────────────────────────────────────── */}
        <div className="ps-dial" ref={dialRef}>
          <svg className="ps-dial-svg" viewBox="0 0 400 400" aria-hidden="true" focusable="false">
            <defs>
              <radialGradient id="ps-face" cx="50%" cy="38%" r="70%">
                <stop offset="0%" stopColor="#FBF6EC" />
                <stop offset="100%" stopColor="#E4D2B4" />
              </radialGradient>
              <linearGradient id="ps-arc" x1="0%" y1="100%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E0AE6C" />
                <stop offset="100%" stopColor="#C2723D" />
              </linearGradient>
            </defs>

            <circle cx={CX} cy={CY} r="196" fill="url(#ps-face)" />
            <circle cx={CX} cy={CY} r="190" fill="none" stroke="rgba(58,47,34,0.14)" strokeWidth="1.5" />

            {/* graduations */}
            {TICKS.map((t) => (
              <line
                key={t.kg}
                className={`ps-tick${t.major ? ' is-major' : ''}${t.kg <= kg + 1e-9 ? ' is-on' : ''}`}
                x1={t.inner.x}
                y1={t.inner.y}
                x2={t.outer.x}
                y2={t.outer.y}
              />
            ))}
            {TICKS.filter((t) => t.label).map((t) => (
              <text
                key={`l-${t.kg}`}
                className={`ps-tick-label${Math.abs(t.kg - kg) < 0.05 ? ' is-on' : ''}`}
                x={t.label!.x}
                y={t.label!.y}
                textAnchor="middle"
                dominantBaseline="central"
              >
                {String(t.kg).replace('.', ',')}
              </text>
            ))}

            {/* arc de progression */}
            <path className="ps-arc-track" d={ARC_PATH} fill="none" strokeWidth="12" strokeLinecap="round" />
            <path
              className="ps-arc-fill"
              d={ARC_PATH}
              fill="none"
              stroke="url(#ps-arc)"
              strokeWidth="12"
              strokeLinecap="round"
              pathLength="1"
              strokeDasharray="1 1"
              strokeDashoffset={1 - ratio}
            />

            {/* aiguille (bouton rond sur l'arc) */}
            <g className="ps-knob" style={knobStyle}>
              <circle className="ps-knob-halo" cx={CX} cy={CY - ARC_R} r="23" />
              <circle className="ps-knob-body" cx={CX} cy={CY - ARC_R} r="15" />
              <circle className="ps-knob-dot" cx={CX} cy={CY - ARC_R} r="5.5" />
            </g>
          </svg>

          <div className="ps-dial-readout">
            <div className="ps-price">
              <Odometer value={price} />
            </div>
            <div className="ps-currency" aria-hidden="true">FCFA</div>
          </div>
          <div className="ps-dial-weight" aria-hidden="true">{formatKg(kg)}</div>
        </div>

        {/* ── Les commandes ──────────────────────────────────────── */}
        <div className="ps-controls">
          <h3 className="ps-title">Combien de kilos ?</h3>
          <p className="ps-lead">
            Faites glisser : le prix se calcule au kilo, de {formatKg(SIM_MIN_KG)} à {formatKg(SIM_MAX_KG)}.
          </p>

          <div className="ps-slider" style={railStyle}>
            <button
              type="button"
              className="ps-step hover-target"
              aria-label={`Retirer ${formatKg(SIM_STEP_KG)}`}
              onClick={() => chooseKg(kg - SIM_STEP_KG)}
              disabled={kg <= SIM_MIN_KG}
            >
              <span aria-hidden="true">−</span>
            </button>

            <div className="ps-rail">
              <div className="ps-rail-track">
                <span className="ps-rail-fill" />
                <span className="ps-rail-ticks" aria-hidden="true">
                  {TICKS.map((t) => (
                    <i key={t.kg} className={t.major ? 'is-major' : undefined} />
                  ))}
                </span>
              </div>
              <span className="ps-rail-thumb" aria-hidden="true">
                <span className="ps-rail-thumb-dot" />
              </span>
              <input
                className="ps-range hover-target"
                type="range"
                min={SIM_MIN_KG}
                max={SIM_MAX_KG}
                step={SIM_STEP_KG}
                value={kg}
                onChange={(e) => chooseKg(parseFloat(e.target.value))}
                onPointerDown={startDrag}
                aria-label="Poids en kilos"
                aria-valuetext={valueText}
              />
            </div>

            <button
              type="button"
              className="ps-step hover-target"
              aria-label={`Ajouter ${formatKg(SIM_STEP_KG)}`}
              onClick={() => chooseKg(kg + SIM_STEP_KG)}
              disabled={kg >= SIM_MAX_KG}
            >
              <span aria-hidden="true">+</span>
            </button>
          </div>

          <div className="ps-picks" role="group" aria-label="Poids courants">
            {SIM_QUICK_PICKS_KG.map((pick) => (
              <button
                key={pick}
                type="button"
                className="ps-pick hover-target"
                aria-pressed={Math.abs(kg - pick) < 0.05}
                onClick={() => chooseKg(pick)}
              >
                {formatKg(pick)}
              </button>
            ))}
          </div>

          <dl className="ps-ticket">
            <div>
              <dt>Tarif au kilo</dt>
              <dd>{formatFcfa(PRICE_PER_KG)}</dd>
            </div>
            <div>
              <dt>Votre poids</dt>
              <dd>{formatKg(kg)}</dd>
            </div>
            <div className="ps-ticket-total">
              <dt>Total</dt>
              <dd>{formatFcfa(price)}</dd>
            </div>
          </dl>
          <p className="ps-note">Livraison en supplément selon votre zone.</p>

          <ArrowButton href="#contact" solid block className="ps-cta">
            Commander
          </ArrowButton>
        </div>

        <p className="ps-sr" role="status" aria-live="polite">{valueText}</p>
      </div>
    </div>
  )
}
