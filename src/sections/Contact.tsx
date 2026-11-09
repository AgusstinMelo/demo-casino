import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import { comision, contacto, sitio } from '../content'
import { WhatsAppIcon } from '../components/BrandIcons'
import { SectionHeading } from '../components/Kinetic'
import { Txt } from '../components/Txt'
import { btn } from '../components/ui'
import { useInViewOnce } from '../lib/hooks'
import { waLink } from '../lib/wa'


/** Mapa embebido: se carga recién cuando está cerca de la pantalla. */
function Mapa() {
  const [ref, inView] = useInViewOnce<HTMLDivElement>('300px')
  const q = encodeURIComponent(contacto.consultaMapa)
  return (
    <div ref={ref} className="relative isolate h-full min-h-[22rem] overflow-hidden rounded-[2rem] bg-bg-alt">
      {inView ? (
        <iframe
          title={`Mapa: ${sitio.nombre}, ${sitio.barrio}, ${sitio.ciudad}`}
          src={`https://www.google.com/maps?q=${q}&z=15&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full border-0 [filter:grayscale(1)_contrast(1.05)]"
        />
      ) : (
        <div className="skeleton absolute inset-0" aria-hidden="true" />
      )}
      {/* Tinte con el color del club */}
      <div className="pointer-events-none absolute inset-0 bg-primario mix-blend-color opacity-30" aria-hidden="true" />
      <div className="pointer-events-none absolute left-4 top-4 rounded-full bg-surface px-4 py-2 text-sm font-semibold shadow-lg">
        📍 Av. General Savio 1476
      </div>
    </div>
  )
}

export default function Contact() {

  const datos = [
    { icon: MapPin, label: 'Dirección', valor: contacto.direccion },
    { icon: Clock, label: 'Secretaría', valor: contacto.secretaria },
    { icon: Phone, label: 'Teléfono', valor: contacto.telefono },
    { icon: Mail, label: 'Email', valor: contacto.email },
  ]

  return (
    <section className="py-16 md:py-24" aria-labelledby="contacto-titulo">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeading kicker="Contacto" titulo="Vení a conocernos" bajada={`Estamos en Av. General Savio 1476, ${sitio.barrio}, ${sitio.ciudad}. La puerta está abierta.`} id="contacto-titulo" />

        <div className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="space-y-4">
            <ul className="grid gap-3 sm:grid-cols-2">
              {datos.map((d) => (
                <li key={d.label} className="flex gap-3 rounded-3xl border border-line bg-surface p-5">
                  <d.icon className="mt-0.5 size-5 shrink-0 text-brand-accent-ink" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wider text-fg-muted">{d.label}</p>
                    <p className="mt-1 break-words font-medium">
                      <Txt>{d.valor}</Txt>
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="rounded-3xl border border-line bg-surface p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-fg-muted">{comision.titulo}</p>
              <p className="mt-1 font-semicondensed text-xl">Presidente: {comision.presidente}</p>
              <p className="mt-1 text-sm text-fg-muted">{comision.texto}</p>
              <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Vocalías">
                {comision.vocalias.map((v) => (
                  <li key={v} className="rounded-full bg-bg-alt px-3 py-1 text-xs font-semibold">
                    {v}
                  </li>
                ))}
              </ul>
            </div>


            <div className="flex flex-wrap gap-2">
              <a href={waLink('¡Hola Casino!')} target="_blank" rel="noopener noreferrer" className={`${btn.whatsapp} ${btn.chico}`}>
                <WhatsAppIcon size={18} /> WhatsApp
              </a>
            </div>
          </div>
          <Mapa />
        </div>
      </div>
    </section>
  )
}
