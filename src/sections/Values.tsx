import { valores } from '../content'
import { SectionHeading } from '../components/Kinetic'
import { Reveal } from '../components/Reveal'
import { Txt } from '../components/Txt'

/** Más que un club: el rol social del Casino, en una grilla compacta. */
export function Values() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24" aria-labelledby="social-titulo">
      <SectionHeading kicker={valores.kicker} titulo={valores.social.titulo} bajada={valores.social.bajada} id="social-titulo" />
      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {valores.social.items.map((it, i) => (
          <Reveal key={it.titulo}>
            <article className={`h-full rounded-[1.75rem] p-6 ${i === 0 ? 'bg-primario text-white' : 'border border-line bg-surface'}`}>
              <span className={`font-condensed text-3xl ${i === 0 ? 'text-acento' : 'text-brand-accent-ink'}`} aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-3 font-semicondensed text-xl leading-tight">{it.titulo}</h3>
              <p className={`mt-2 text-sm leading-relaxed ${i === 0 ? 'text-white/85' : 'text-fg-muted'}`}>
                <Txt>{it.texto}</Txt>
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
