import { Store } from 'lucide-react'
import { mensajesWhatsapp, sponsors } from '../content'
import { SectionHeading } from '../components/Kinetic'
import { Magnetic } from '../components/Magnetic'
import { Txt } from '../components/Txt'
import { btn } from '../components/ui'
import { waLink } from '../lib/wa'

function Logo({ name, i }: { name: string; i: number }) {
  return (
    <li className="mx-2 flex h-24 w-52 shrink-0 items-center justify-center gap-2 rounded-3xl border border-dashed border-line bg-surface px-6 text-fg-muted md:h-28 md:w-60">
      <Store className="size-5 shrink-0" aria-hidden="true" />
      <span className={`truncate ${i % 2 ? 'font-expresiva italic' : 'font-semicondensed uppercase'} text-lg`}>{name}</span>
    </li>
  )
}

export default function Sponsors() {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0" aria-hidden={hidden || undefined}>
      {sponsors.lista.map((s, i) => (
        <Logo key={s + i} name={s} i={i} />
      ))}
    </ul>
  )
  return (
    <section className="fundido overflow-hidden bg-bg-alt py-14 md:py-20" aria-labelledby="sponsors-titulo">
      <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-6 px-4 md:px-8">
        <SectionHeading kicker={sponsors.kicker} titulo={sponsors.titulo} bajada={<Txt>{sponsors.bajada}</Txt>} id="sponsors-titulo" />
        <Magnetic>
          <a href={waLink(mensajesWhatsapp.sponsor)} target="_blank" rel="noopener noreferrer" className={btn.primario}>
            {sponsors.cta}
          </a>
        </Magnetic>
      </div>
      <div className="marquee mt-8 [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
        <div className="marquee-track" style={{ ['--marquee-dur' as string]: '45s' }}>
          {row(false)}
          {row(true)}
        </div>
      </div>
    </section>
  )
}
