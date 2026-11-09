import { m, useScroll } from 'motion/react'
import { Quote } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { historia } from '../content'
import { KineticTitle } from '../components/Kinetic'
import { Reveal, ScrollFadeIn } from '../components/Reveal'
import { SmartImage } from '../components/SmartImage'
import { Txt } from '../components/Txt'
import { useReducedMotion } from '../lib/hooks'
import { supportsScrollTimeline } from '../lib/scroll'

const css = supportsScrollTimeline()

/**
 * Nuestra historia — scroll storytelling.
 * Columna fijada (sticky) con el año y el progreso; los hitos avanzan con el scroll.
 * El abandono va en blanco y negro y el color vuelve con la recuperación.
 */
export function History() {
  const [activo, setActivo] = useState(0)
  const listRef = useRef<HTMLOListElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 0.5', 'end 0.5'] })

  // Capítulo activo según la posición real del scroll (robusto ante saltos largos)
  useEffect(() => {
    let raf = 0
    const calcular = () => {
      raf = 0
      const el = listRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const v = (window.innerHeight * 0.5 - r.top) / r.height
      const n = historia.hitos.length
      setActivo(Math.min(n - 1, Math.max(0, Math.floor(v * n))))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(calcular)
    }
    calcular()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const hito = historia.hitos[activo]
  const enSilencio = hito.estado === 'bn'
  const progressStyle = reduced || css ? undefined : { scaleY: scrollYProgress }

  return (
    <section className="fundido scroll-mt-16 overflow-clip bg-[#0e0a0a] text-white" aria-labelledby="historia-titulo" style={{ timelineScope: '--historia' } as React.CSSProperties}>
      {/* Fondo que cambia de clima según el capítulo (solo opacity) */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-b from-[#2a1c10] to-[#0e0a0a] transition-opacity duration-1000" style={{ opacity: hito.estado === 'sepia' ? 1 : 0 }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1b1d22] to-[#050608] transition-opacity duration-1000" style={{ opacity: enSilencio ? 1 : 0 }} />
        <div className="absolute inset-0 transition-opacity duration-1000" style={{ opacity: hito.estado === 'color' ? 1 : 0 }}>
          <div className="absolute inset-0 bg-primario-700" />
          <div className="mesh opacity-70">
            <span />
            <span />
            <span />
          </div>
        </div>
        <div className="grano absolute inset-0" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pt-24 md:px-8 md:pt-32">
        <p className="kicker mb-4 flex items-center gap-3 text-acento">
          <span className="inline-block h-0.5 w-8 bg-current" aria-hidden="true" />
          {historia.kicker}
        </p>
        <KineticTitle id="historia-titulo" text={historia.titulo} className="font-condensed text-giant max-w-5xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 md:px-8 lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-x-12">
        {/* Columna fijada (en grid, el sticky necesita self-start) */}
        <div className="sticky top-16 z-10 -mx-4 mt-8 px-4 py-3 lg:top-0 lg:mx-0 lg:mt-0 lg:flex lg:h-screen lg:items-center lg:self-start lg:px-0 lg:py-0">
          <div className="flex items-center gap-4 rounded-2xl bg-black/30 px-4 py-3 backdrop-blur-md lg:block lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
            <div className="relative hidden h-[52vh] w-1 overflow-hidden rounded-full bg-white/15 lg:absolute lg:-left-6 lg:top-1/2 lg:block lg:-translate-y-1/2" aria-hidden="true">
              <m.span className={`absolute inset-0 origin-top rounded-full bg-acento ${css && !reduced ? 'sd-progress' : ''}`} style={progressStyle} />
            </div>
            <p className="kicker text-white/70 lg:mb-3">Capítulo {activo + 1} de {historia.hitos.length}</p>
            <div aria-live="polite" className="lg:min-h-[1em]">
              <m.p key={hito.id} initial={reduced ? false : { y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="whitespace-nowrap font-condensed text-2xl text-acento lg:whitespace-normal lg:text-[clamp(3rem,5vw,5.5rem)]">
                {hito.anioCorto}
              </m.p>
              <p className="hidden font-semicondensed text-3xl lg:block">{hito.titulo}</p>
            </div>
            <ol className="ml-auto flex gap-1.5 lg:ml-0 lg:mt-8 lg:gap-2" aria-hidden="true">
              {historia.hitos.map((h, i) => (
                <li key={h.id} className={`h-1.5 rounded-full transition-all duration-500 ${i === activo ? 'w-8 bg-acento' : i < activo ? 'w-3 bg-white/70' : 'w-3 bg-white/25'}`} />
              ))}
            </ol>
          </div>
        </div>

        {/* Hitos */}
        <ol ref={listRef} className="timeline-historia relative pb-24 lg:pb-0" style={{ viewTimelineName: '--historia' } as React.CSSProperties}>
          {historia.hitos.map((h, i) => (
            <li key={h.id} className="flex min-h-[60vh] items-center py-8 lg:min-h-[78vh]">
              <article data-hito={i} className="w-full">
                <Reveal variant="photo">
                  {h.id === 'recuperacion' ? (
                    <div className="relative overflow-hidden rounded-[2rem]" style={{ aspectRatio: "16 / 10" }}>
                      <SmartImage foto={h.foto} fill tratamiento="bn" sizes="(min-width: 1024px) 55vw, 92vw" ratio={16 / 10} />
                      <ScrollFadeIn className="absolute inset-0">
                        <SmartImage foto={h.foto} fill tratamiento="club" sizes="(min-width: 1024px) 55vw, 92vw" ratio={16 / 10} grano />
                      </ScrollFadeIn>
                    </div>
                  ) : (
                    <SmartImage foto={h.foto} ratio={16 / 10} tratamiento={h.estado === 'bn' ? 'bn' : h.estado === 'sepia' ? 'sepia' : 'club'} grano className="rounded-[2rem]" sizes="(min-width: 1024px) 55vw, 92vw" />
                  )}
                </Reveal>
                <Reveal className="mt-6 md:mt-8">
                  <p className="kicker text-acento">
                    <Txt>{h.anio}</Txt>
                  </p>
                  <h3 className="mt-2 font-condensed text-4xl md:text-5xl">{h.titulo}</h3>
                  <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/85 md:text-xl">
                    <Txt>{h.texto}</Txt>
                  </p>
                </Reveal>
              </article>
            </li>
          ))}
        </ol>
      </div>

      {/* Cita de cierre */}
      <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-4 text-center md:px-8 md:pb-28">
        <Reveal>
          <Quote className="mx-auto size-14 text-acento" aria-hidden="true" strokeWidth={1.25} />
          <blockquote className="mt-6">
            <p className="font-expresiva text-[clamp(1.5rem,3.3vw,3rem)] font-medium italic leading-[1.15]">“{historia.cita.texto}”</p>
            <footer className="mt-6 text-white/75">
              {historia.cita.ejemplo && <span className="tag-ejemplo mr-2">Ejemplo</span>}— <Txt>{historia.cita.autor}</Txt>
            </footer>
          </blockquote>
        </Reveal>
      </div>
    </section>
  )
}
