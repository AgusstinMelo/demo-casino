import { m, useScroll, useTransform } from 'motion/react'
import { ArrowDown } from 'lucide-react'
import { useRef } from 'react'
import { hero } from '../content'
import { KineticTitle, RotatingWord } from '../components/Kinetic'
import { Magnetic } from '../components/Magnetic'
import { AnchorLink } from '../components/NavLink'
import { SmartImage } from '../components/SmartImage'
import { btn } from '../components/ui'
import { useReducedMotion } from '../lib/hooks'
import { hadShell, isServer } from '../lib/shell'
import { StoriesRow } from './Stories'

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  // Si el hero vino prerenderizado, no repetimos la entrada
  const skip = reduced || hadShell || isServer
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  // Zoom suave: la foto de la sede mide 1691 px, más ampliación la ablanda en pantallas grandes
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-12%'])
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section ref={ref} className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-bg text-white" aria-labelledby="hero-titulo">
      {/* Foto enmarcada (LCP): carga prioritaria, sin lazy, ya viene en el HTML prerenderizado */}
      <div className="absolute inset-1.5 -z-10 overflow-hidden rounded-[1.75rem] bg-primario-700 md:inset-3 md:rounded-[2.5rem]">
        <m.div className="absolute inset-0" style={reduced ? undefined : { y, scale }}>
          <SmartImage foto={hero.foto} fill priority sizes="100vw" widths={[640, 960, 1280, 1600, 2000]} ratio={16 / 9} tratamiento="none" cursor={false} />
        </m.div>
        {/* Capa para asegurar contraste AA del texto sobre la foto */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0a0a] via-[#0e0a0a]/60 to-[#0e0a0a]/30" aria-hidden="true" />
        <div className="mesh opacity-25 mix-blend-soft-light" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>

      {/* Historias: arriba en móvil (bajo el header), abajo a la derecha en pantallas grandes */}
      <div className="pt-[4.75rem] md:pt-28 xl:absolute xl:bottom-8 xl:right-24 xl:z-10 xl:pt-0">
        <StoriesRow />
      </div>

      <m.div className="mx-auto mt-auto w-full max-w-7xl px-4 pb-10 md:px-8 md:pb-16 xl:pt-28" style={reduced ? undefined : { y: contentY, opacity: fade }}>
        <m.p
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-md"
          initial={skip ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {hero.badge}
        </m.p>
        <KineticTitle as="h1" id="hero-titulo" text={hero.titulo} onMount intro={!hadShell} delay={0.1} stagger={0.05} className="font-condensed max-w-[14ch] text-[min(var(--text-mega),17svh)] drop-shadow-[0_4px_30px_rgb(0_0_0/0.35)] lg:max-w-[18ch] xl:max-w-[13ch] xl:text-[min(var(--text-mega),10svh)]" />
        <m.p
          className="mt-4 font-condensed text-huge text-acento"
          initial={skip ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          {hero.prefijoRotativo} <RotatingWord words={hero.palabrasRotativas} className="min-w-[6ch]" />
        </m.p>
        <m.div initial={skip ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.05, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/90 md:text-xl">{hero.subtitulo}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Magnetic>
              <AnchorLink to="socios" className={`${btn.primario} text-base md:text-lg`}>
                {hero.ctaPrincipal}
              </AnchorLink>
            </Magnetic>
          </div>
        </m.div>
      </m.div>
      <AnchorLink to="historia" className="absolute bottom-6 right-6 hidden size-14 place-items-center rounded-full border border-white/30 text-white/80 transition-colors hover:bg-white hover:text-primario md:grid" aria-label="Bajar a la siguiente sección">
        <ArrowDown className="size-5 motion-safe:animate-bounce" aria-hidden="true" />
      </AnchorLink>
    </section>
  )
}
