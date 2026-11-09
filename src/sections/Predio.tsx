import { m } from 'motion/react'
import { CalendarDays, Info, MapPin } from 'lucide-react'
import { mensajesWhatsapp, pileta, predio } from '../content'
import { WhatsAppIcon } from '../components/BrandIcons'
import { Icon } from '../components/Icon'
import { SectionHeading } from '../components/Kinetic'
import { Reveal } from '../components/Reveal'
import { SmartImage } from '../components/SmartImage'
import { Txt } from '../components/Txt'
import { btn } from '../components/ui'
import { useReducedMotion } from '../lib/hooks'
import { waLink } from '../lib/wa'

/** Grilla pareja: fútbol y gimnasio apenas más anchos que básquet y tenis, sin dominar. */
const SPANS = ['md:col-span-7', 'md:col-span-5', 'md:col-span-5', 'md:col-span-7']

/** Ondas de agua animadas (solo transform) para el fondo del bloque de la pileta. */
function Ondas() {
  return (
    <svg className="pointer-events-none absolute inset-x-0 bottom-0 h-40 w-[200%] text-white/10 motion-safe:animate-[olas_18s_linear_infinite]" viewBox="0 0 2400 160" preserveAspectRatio="none" aria-hidden="true">
      <path fill="currentColor" d="M0 80c200 0 200-60 400-60s200 60 400 60 200-60 400-60 200 60 400 60 200-60 400-60 200 60 400 60v80H0Z" />
    </svg>
  )
}

/** El predio: instalaciones del club en bento y, dentro, la pileta con la escuela de verano. */
export function Predio() {
  const reduced = useReducedMotion()
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-32" aria-labelledby="predio-titulo">
      <SectionHeading kicker={predio.kicker} titulo={predio.titulo} bajada={<Txt>{predio.bajada}</Txt>} id="predio-titulo" />
      <div className="mt-12 grid auto-rows-[minmax(17rem,auto)] gap-3 md:grid-cols-12 md:gap-4">
        {predio.instalaciones.map((it, i) => (
          <Reveal key={it.id} variant="photo" className={SPANS[i]}>
            <m.article
              className="@container group relative flex h-full min-h-60 flex-col justify-end overflow-hidden rounded-[2rem] p-6 text-white md:p-8"
              whileHover={reduced ? undefined : { y: -4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            >
              <SmartImage foto={it.foto} fill ratio={16 / 10} sizes="(min-width: 768px) 60vw, 92vw" imgClassName="transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 z-[2] bg-gradient-to-t from-[#0e0a0a] via-[#0e0a0a]/40 to-transparent" aria-hidden="true" />
              <div className="relative z-[3]">
                <p className="font-condensed text-[clamp(2.5rem,9cqi,4.5rem)] leading-[0.85] text-acento">{it.dato}</p>
                <h3 className="mt-2 font-semicondensed text-2xl md:text-3xl">{it.nombre}</h3>
                <p className="mt-1 max-w-lg text-white/85">
                  <Txt>{it.detalle}</Txt>
                </p>
                {it.cta && (
                  <a
                    href={waLink(mensajesWhatsapp[it.cta.mensaje])}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur-sm transition-colors hover:bg-acento hover:text-negro"
                  >
                    <WhatsAppIcon size={16} /> {it.cta.label}
                  </a>
                )}
              </div>
            </m.article>
          </Reveal>
        ))}
      </div>

      {/* Verano en Casino: la pileta como una tarjeta más del predio */}
      <Reveal variant="photo" className="mt-3 md:mt-4">
        <article id="pileta" className="relative grid scroll-mt-24 overflow-hidden rounded-[2rem] bg-[#0779aa] text-white lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]" aria-labelledby="pileta-titulo">
          {/* Foto a sangre con el dato de la pileta */}
          <div className="relative min-h-64 lg:min-h-full">
            <SmartImage foto={pileta.foto} fill ratio={4 / 3} grano sizes="(min-width: 1024px) 40vw, 92vw" />
            <div className="absolute inset-0 z-[2] bg-gradient-to-t from-[#0779aa]/80 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-[#0779aa]/60" aria-hidden="true" />
            <div className="absolute bottom-5 left-5 z-[3] rounded-2xl bg-acento px-4 py-3 text-negro shadow-xl">
              <p className="font-condensed text-3xl leading-none">50 × 20</p>
              <p className="mt-0.5 text-xs font-semibold">metros · trampolines</p>
            </div>
          </div>

          {/* Contenido */}
          <div className="relative overflow-hidden p-6 md:p-8 lg:p-10">
            <Ondas />
            <div className="relative">
              <p className="kicker flex items-center gap-3 text-white">
                <span className="inline-block h-0.5 w-6 bg-current" aria-hidden="true" />
                {pileta.kicker}
              </p>
              <h3 id="pileta-titulo" className="mt-3 font-semicondensed text-3xl leading-tight md:text-4xl">
                {pileta.titulo}
              </h3>
              <p className="mt-2 max-w-xl text-white/90">{pileta.bajada}</p>

              <ul className="mt-6 divide-y divide-white/20 border-y border-white/20">
                {pileta.turnos.map((t) => (
                  <li key={t.id} className="flex items-start gap-4 py-3.5">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/15 text-white">
                      <Icon name={t.icono} size={20} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
                        <h4 className="font-semibold">{t.titulo}</h4>
                        <p className="flex items-center gap-1.5 text-sm font-semibold text-white">
                          <CalendarDays className="size-3.5" aria-hidden="true" /> {t.dias}
                        </p>
                      </div>
                      <p className="mt-0.5 text-sm text-white/85">
                        <Txt>{t.detalle}</Txt>
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <p className="mt-5 text-sm text-white/90">
                <span className="font-condensed text-2xl text-white">~250 chicos</span> · {pileta.dato}
              </p>
              <p className="mt-2 flex gap-2 text-xs text-white/80">
                <Info className="mt-px size-4 shrink-0" aria-hidden="true" />
                <span>
                  <Txt>{pileta.temporada}</Txt>
                </span>
              </p>

              <a href={waLink(mensajesWhatsapp.pileta)} target="_blank" rel="noopener noreferrer" className={`${btn.acento} mt-6`}>
                <WhatsAppIcon size={20} /> Consultar por la temporada
              </a>
            </div>
          </div>
        </article>
      </Reveal>

      <p className="mt-6 flex items-center gap-2 text-fg-muted">
        <MapPin className="size-4 shrink-0 text-brand-accent-ink" aria-hidden="true" /> Av. General Savio 1476 · Barrio El Libertador · Río Tercero
      </p>
    </section>
  )
}
