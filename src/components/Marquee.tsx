import { Star } from 'lucide-react'

/** Marquee infinito levemente inclinado. Se detiene con prefers-reduced-motion. */
export function Marquee({
  items,
  tilt = -2,
  reverse = false,
  tone = 'primario',
  duration = 38,
}: {
  items: string[]
  tilt?: number
  reverse?: boolean
  tone?: 'primario' | 'acento' | 'secundario'
  duration?: number
}) {
  const colors = {
    primario: 'bg-primario text-white',
    acento: 'bg-acento text-[#141010]',
    secundario: 'bg-secundario text-white',
  }[tone]
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((t, i) => (
        <li key={i} className="flex items-center gap-6 px-6 font-condensed text-3xl md:text-4xl">
          {t}
          <Star className="size-6 shrink-0 fill-current md:size-8" aria-hidden="true" />
        </li>
      ))}
    </ul>
  )
  return (
    <div className="relative z-10 overflow-hidden py-6" aria-label={items.join(' · ')} role="region">
      <div className={`marquee ${colors} py-4 shadow-xl md:py-5`} style={{ transform: `rotate(${tilt}deg) scale(1.04)` }}>
        <div className="marquee-track" data-reverse={reverse} style={{ ['--marquee-dur' as string]: `${duration}s` }}>
          {row(false)}
          {row(true)}
        </div>
      </div>
    </div>
  )
}
