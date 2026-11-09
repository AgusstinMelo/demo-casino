import { m } from 'motion/react'
import { CalendarHeart } from 'lucide-react'
import { cultura, mensajesWhatsapp } from '../content'
import { InstagramIcon, WhatsAppIcon } from '../components/BrandIcons'
import { Icon } from '../components/Icon'
import { KineticTitle } from '../components/Kinetic'
import { Reveal } from '../components/Reveal'
import { SmartImage } from '../components/SmartImage'
import { Txt } from '../components/Txt'
import { btn } from '../components/ui'
import { useReducedMotion } from '../lib/hooks'
import { waLink } from '../lib/wa'

/** Centro Cultural Casino: identidad propia, más artística y orgánica. */
export default function Cultural() {
  const reduced = useReducedMotion()
  return (
    <section className="fundido overflow-hidden bg-ambiente py-24 text-fg md:py-32" aria-labelledby="cultura-titulo">
      {/* Formas orgánicas animadas */}
      <svg className="pointer-events-none absolute -right-40 -top-40 h-[42rem] w-[42rem]" style={{ opacity: 'var(--blob-ambiente)' }} viewBox="0 0 200 200" aria-hidden="true">
        <path fill="var(--color-secundario)" d="M45.3-58.7C58.6-49.9 69.2-35.6 73.6-19.4 78-3.2 76.2 14.8 68.4 29.4 60.6 44 46.8 55.2 31.2 62.8 15.6 70.4-1.8 74.4-19.6 71.3-37.4 68.2-55.6 58-66.6 42.4-77.6 26.8-81.4 5.8-76.6-12.6-71.8-31-58.4-46.8-42.7-55.2-27-63.6-9-64.6 4.3-70.2 17.6-75.8 32-67.5 45.3-58.7Z" transform="translate(100 100)">
          {!reduced && <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="80s" repeatCount="indefinite" additive="sum" />}
        </path>
      </svg>
      <svg className="pointer-events-none absolute -bottom-52 -left-40 h-[36rem] w-[36rem]" style={{ opacity: 'calc(var(--blob-ambiente) * 0.85)' }} viewBox="0 0 200 200" aria-hidden="true">
        <path fill="var(--color-acento)" d="M44.7-61.4C57.1-52.4 65.6-38.1 70.4-22.6 75.2-7.1 76.3 9.6 70.6 23.5 64.9 37.4 52.4 48.5 38.3 57.4 24.2 66.3 8.5 73-7.8 73.6-24.1 74.2-41 68.7-53.6 57.6-66.2 46.5-74.5 29.8-76.6 12.6-78.7-4.6-74.6-22.3-64.7-35.5-54.8-48.7-39.1-57.4-23.9-64.8-8.7-72.2 6.1-78.3 20.4-76.1 34.7-73.9 32.3-70.4 44.7-61.4Z" transform="translate(100 100)">
          {!reduced && <animateTransform attributeName="transform" type="rotate" from="360 0 0" to="0 0 0" dur="95s" repeatCount="indefinite" additive="sum" />}
        </path>
      </svg>
      <div className="grano pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <p className="kicker mb-4 flex items-center gap-3 text-brand-accent-ink">
          <span className="inline-block h-0.5 w-8 bg-current" aria-hidden="true" />
          {cultura.kicker}
        </p>
        <KineticTitle id="cultura-titulo" text={cultura.titulo} className="max-w-5xl font-expresiva text-giant font-light italic leading-[1] [font-family:var(--font-expresiva)] [text-transform:none]" />
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fg/85 md:text-xl">{cultura.bajada}</p>
        <Reveal variant="photo" className="mt-12">
          <SmartImage foto={cultura.foto} ratio={21 / 9} className="rounded-[2.5rem]" sizes="(min-width: 1280px) 1200px, 92vw" />
        </Reveal>

        {/* Talleres en mosaico orgánico */}
        <div className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
          {cultura.talleres.map((t, i) => (
            <Reveal key={t.id} variant="photo" className={i % 2 === 1 ? 'md:translate-y-14' : ''}>
              <m.article className="@container group relative overflow-hidden text-white" style={{ borderRadius: i % 2 ? '45% 55% 2rem 2rem / 30% 30% 2rem 2rem' : '55% 2rem 2rem 2rem / 30% 2rem 2rem 2rem' }} whileHover={reduced ? undefined : { rotate: i % 2 ? 1.5 : -1.5 }}>
                <SmartImage foto={t.foto} ratio={3 / 4} sizes="(min-width: 768px) 25vw, 50vw" imgClassName="transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 z-[2] bg-gradient-to-t from-negro via-negro/30 to-transparent" aria-hidden="true" />
                <div className="absolute inset-x-0 bottom-0 z-[3] p-4 @xs:p-6">
                  <Icon name={t.icono} className="mb-2 text-acento" size={26} />
                  <h3 className="font-expresiva text-3xl italic @xs:text-4xl">{t.nombre}</h3>
                  <p className="mt-1 text-xs text-white/80 @xs:text-sm">
                    <Txt>{t.detalle}</Txt>
                  </p>
                </div>
              </m.article>
            </Reveal>
          ))}
        </div>

        {/* Muestras y eventos + CTA */}
        <div className="mt-24 grid grid-cols-1 gap-8 md:mt-32 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <div>
            <h3 className="flex items-center gap-3 font-expresiva text-4xl italic">
              <CalendarHeart className="size-8 text-brand-accent-ink" aria-hidden="true" /> Muestras y eventos
            </h3>
            <ul className="mt-6 divide-y divide-line border-y border-line">
              {cultura.muestras.map((mu) => (
                <li key={mu.titulo} className="flex flex-wrap items-baseline justify-between gap-2 py-5">
                  <span className="text-xl font-semibold">
                    <Txt>{mu.titulo}</Txt>
                  </span>
                  <span className="text-sm text-fg-muted">
                    <Txt>{mu.fecha}</Txt>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col justify-between gap-6 rounded-[2.5rem] bg-[var(--cita-bg)] p-8 text-[var(--cita-fg)] shadow-[var(--shadow)]">
            <p className="font-expresiva text-3xl italic leading-tight">“El club es grande porque no es solo deporte.”</p>
            <div className="flex flex-wrap gap-3">
              <a href={waLink(mensajesWhatsapp.cultura)} target="_blank" rel="noopener noreferrer" className={btn.cita}>
                <WhatsAppIcon size={20} /> Quiero un taller
              </a>
              <a href={cultura.instagram} target="_blank" rel="noopener noreferrer" className={`${btn.contorno}`}>
                <InstagramIcon size={18} /> {cultura.usuarioInstagram}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
