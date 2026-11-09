import { useId } from 'react'

/**
 * Escudo oficial del Club Deportivo Casino, redibujado en vector:
 * escudo rojo con banda diagonal blanca y "C.D.C".
 * La misma figura está en /public/escudo.svg (favicon, íconos de la app e
 * imágenes para compartir). Si cambiás uno, cambiá el otro y corré `npm run assets`.
 */
const EXTERIOR =
  'M49 46C66 35 84 22 101 14C130 34 168 34 197 14C214 22 232 35 249 46C243 68 239 86 239 100C239 126 256 150 271 189C277 218 256 244 218 252C188 259 163 274 149 290C135 274 110 259 80 252C42 244 21 218 27 189C42 150 59 126 59 100C59 86 55 68 49 46Z'
const INTERIOR =
  'M58 50C72 40 87 29 103 22C131 40 167 40 195 22C211 29 226 40 240 50C235 70 232 88 232 100C232 128 250 152 263 189C268 215 250 238 214 246C185 253 162 267 149 281C136 267 113 253 84 246C48 238 30 215 35 189C48 152 66 128 66 100C66 88 63 70 58 50Z'

export function Escudo({ className = '', title = 'Escudo del Club Deportivo Casino' }: { className?: string; title?: string }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg viewBox="20 8 260 288" className={className} {...(title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': true })}>
      <defs>
        <clipPath id={`e${id}`}>
          <path d={INTERIOR} />
        </clipPath>
      </defs>
      <path d={EXTERIOR} fill="var(--club-rojo)" />
      <polygon points="-33,0 68,0 368,300 267,300" fill="#ffffff" clipPath={`url(#e${id})`} />
      <g fill="var(--club-rojo)" textAnchor="middle" style={{ font: '800 68px var(--font-display)' }}>
        <text x="96" y="107">
          C
        </text>
        <text x="161" y="162">
          D
        </text>
        <text x="221" y="228">
          C
        </text>
      </g>
      <circle cx="128" cy="110" r="6.5" fill="var(--club-rojo)" />
      <circle cx="190" cy="171" r="6.5" fill="var(--club-rojo)" />
    </svg>
  )
}
