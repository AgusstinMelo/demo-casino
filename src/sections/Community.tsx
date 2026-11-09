import { AnimatePresence, m } from 'motion/react'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { useState } from 'react'
import { comunidad } from '../content'
import { InstagramIcon } from '../components/BrandIcons'
import { SectionHeading } from '../components/Kinetic'
import { Txt } from '../components/Txt'
import { btn } from '../components/ui'
import { useReducedMotion } from '../lib/hooks'
import { imgUrl } from '../lib/img'

function Testimonios() {
  const [i, setI] = useState(0)
  const [dir, setDir] = useState(1)
  const reduced = useReducedMotion()
  const n = comunidad.testimonios.length
  const go = (d: number) => {
    setDir(d)
    setI((v) => (v + d + n) % n)
  }
  const t = comunidad.testimonios[i]
  return (
    <div
      className="relative overflow-hidden rounded-[2.5rem] bg-primario p-6 text-white md:p-12"
      role="region"
      aria-roledescription="carrusel"
      aria-label="Testimonios"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(1)
        if (e.key === 'ArrowLeft') go(-1)
      }}
    >
      <div className="mesh opacity-60" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <Quote className="relative size-14 text-acento md:size-20" aria-hidden="true" strokeWidth={1.25} />
      <div className="relative min-h-[22rem] md:min-h-[17rem]">
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <m.figure
            key={t.id}
            custom={dir}
            initial={reduced ? false : { opacity: 0, x: dir * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, x: dir * -60 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            drag={reduced ? false : 'x'}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) go(1)
              else if (info.offset.x > 60) go(-1)
            }}
            className="cursor-grab active:cursor-grabbing"
            aria-roledescription="diapositiva"
            aria-label={`${i + 1} de ${n}`}
          >
            <blockquote className="mt-6 font-expresiva text-[clamp(1.3rem,2.7vw,2.4rem)] font-medium italic leading-[1.25]">“{t.cita}”</blockquote>
            <figcaption className="mt-8 flex items-center gap-4">
              <img src={imgUrl(t.foto.src, 160, 160)} alt="" width={64} height={64} className="size-16 rounded-full border-2 border-acento object-cover" loading="lazy" />
              <span>
                <span className="block text-lg font-semibold">
                  <Txt>{t.nombre}</Txt>
                </span>
                <span className="text-sm text-white/75">{t.rol}</span>
              </span>
            </figcaption>
          </m.figure>
        </AnimatePresence>
      </div>
      <div className="relative mt-8 flex items-center justify-between">
        <div className="flex gap-2" role="tablist" aria-label="Elegir testimonio">
          {comunidad.testimonios.map((x, k) => (
            <button
              key={x.id}
              type="button"
              role="tab"
              aria-selected={k === i}
              aria-label={`Testimonio ${k + 1}`}
              onClick={() => {
                setDir(k > i ? 1 : -1)
                setI(k)
              }}
              className="grid size-8 place-items-center"
            >
              <span className={`block h-2 rounded-full transition-all duration-500 ${k === i ? 'w-8 bg-acento' : 'w-2 bg-white/40'}`} />
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => go(-1)} className="tap grid size-12 place-items-center rounded-full border border-white/30 hover:bg-white hover:text-primario" aria-label="Testimonio anterior">
            <ChevronLeft className="size-5" aria-hidden="true" />
          </button>
          <button type="button" onClick={() => go(1)} className="tap grid size-12 place-items-center rounded-full border border-white/30 hover:bg-white hover:text-primario" aria-label="Testimonio siguiente">
            <ChevronRight className="size-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}


export default function Community() {
  return (
    <section className="py-16 md:py-24" aria-labelledby="comunidad-titulo">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeading kicker={comunidad.kicker} titulo={comunidad.titulo} bajada={comunidad.bajada} id="comunidad-titulo" />
        <p className="mt-3">
          <span className="tag-ejemplo">Testimonios y fotos de ejemplo</span>
        </p>
        <div className="mt-12">
          <Testimonios />
        </div>

        <p className="mt-6 text-center">
          <a href={comunidad.urlHashtag} target="_blank" rel="noopener noreferrer" className={`${btn.contorno} ${btn.chico}`}>
            <InstagramIcon size={18} /> Compartí tu foto con #SoyCasino
          </a>
        </p>
      </div>
    </section>
  )
}
