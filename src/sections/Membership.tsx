import { AnimatePresence, m } from 'motion/react'
import { ArrowLeft, ArrowRight, Check, PartyPopper } from 'lucide-react'
import { useId, useState } from 'react'
import { disciplinas, mensajesWhatsapp, socios, type Plan } from '../content'
import { WhatsAppIcon } from '../components/BrandIcons'
import { Icon } from '../components/Icon'
import { SectionHeading } from '../components/Kinetic'
import { Magnetic } from '../components/Magnetic'
import { Txt } from '../components/Txt'
import { btn } from '../components/ui'
import { useReducedMotion } from '../lib/hooks'
import { scrollToId } from '../lib/scroll'
import { waLink } from '../lib/wa'

type Datos = { nombre: string; edad: string; telefono: string; disciplina: string; comentario: string }
const vacio: Datos = { nombre: '', edad: '', telefono: '', disciplina: '', comentario: '' }

async function festejar() {
  const confetti = (await import('canvas-confetti')).default
  const colors = ['#cc0033', '#141010', '#f2a516', '#ffffff']
  const base = { disableForReducedMotion: true, colors, ticks: 220, scalar: 0.9, zIndex: 120 }
  confetti({ ...base, particleCount: 70, spread: 70, origin: { y: 0.7 } })
  setTimeout(() => confetti({ ...base, particleCount: 40, angle: 60, spread: 55, origin: { x: 0, y: 0.75 } }), 180)
  setTimeout(() => confetti({ ...base, particleCount: 40, angle: 120, spread: 55, origin: { x: 1, y: 0.75 } }), 300)
}

function Field({ label, children, hint }: { label: string; children: (id: string) => React.ReactNode; hint?: string }) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">
        {label}
      </label>
      {children(id)}
      {hint && <p className="mt-1 text-xs text-fg-muted">{hint}</p>}
    </div>
  )
}
const inputCls = 'w-full rounded-2xl border border-line bg-bg px-4 py-3.5 text-base outline-none transition-colors placeholder:text-fg-muted/60 focus:border-primario focus-visible:outline-none focus:ring-4 focus:ring-primario/15 dark:focus:border-acento'

function Wizard({ plan, setPlan }: { plan: Plan | null; setPlan: (p: Plan) => void }) {
  const [paso, setPaso] = useState(plan ? 1 : 0)
  const [datos, setDatos] = useState<Datos>(vacio)
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState('')
  const reduced = useReducedMotion()
  const pasos = ['Plan', 'Tus datos', 'Confirmación']
  const set = (k: keyof Datos) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setDatos((d) => ({ ...d, [k]: e.target.value }))

  const mensaje = () =>
    [
      mensajesWhatsapp.socio,
      `• Plan: ${plan?.nombre}`,
      `• Nombre: ${datos.nombre}`,
      datos.edad && `• Edad: ${datos.edad}`,
      `• Teléfono: ${datos.telefono}`,
      datos.disciplina && `• Me interesa: ${datos.disciplina}`,
      datos.comentario && `• Comentario: ${datos.comentario}`,
    ]
      .filter(Boolean)
      .join('\n')

  const siguiente = () => {
    if (paso === 0 && !plan) return setError('Elegí un plan para seguir.')
    if (paso === 1 && (!datos.nombre.trim() || datos.telefono.replace(/\D/g, '').length < 6)) return setError('Completá tu nombre y un teléfono válido.')
    setError('')
    setPaso((p) => Math.min(2, p + 1))
  }

  const enviar = () => {
    window.open(waLink(mensaje()), '_blank', 'noopener')
    setEnviado(true)
    festejar()
  }

  if (enviado)
    return (
      <m.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="grid place-items-center py-10 text-center" role="status">
        <PartyPopper className="size-16 text-acento" aria-hidden="true" strokeWidth={1.5} />
        <p className="mt-4 font-condensed text-4xl">¡Bienvenido/a!</p>
        <p className="mt-3 max-w-sm text-fg-muted">Te abrimos WhatsApp con tu solicitud. Te respondemos a la brevedad para terminar el alta. ¡Ya sos parte!</p>
        <button
          type="button"
          className={`${btn.contorno} ${btn.chico} mt-6`}
          onClick={() => {
            setEnviado(false)
            setPaso(0)
            setDatos(vacio)
          }}
        >
          Asociar a otra persona
        </button>
      </m.div>
    )

  return (
    <div>
      <ol className="mb-8 grid grid-cols-3 gap-2" aria-label="Pasos">
        {pasos.map((p, i) => (
          <li key={p} aria-current={i === paso ? 'step' : undefined}>
            <span className={`block h-1.5 rounded-full transition-colors duration-500 ${i <= paso ? 'bg-secundario' : 'bg-line'}`} />
            <span className={`mt-2 block text-xs font-semibold sm:text-sm ${i === paso ? 'text-fg' : 'text-fg-muted'}`}>
              {i + 1}. {p}
            </span>
          </li>
        ))}
      </ol>

      <AnimatePresence mode="wait" initial={false}>
        <m.div key={paso} initial={reduced ? false : { opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={reduced ? { opacity: 0 } : { opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
          {paso === 0 && (
            <fieldset>
              <legend className="mb-4 font-semicondensed text-2xl">¿Qué plan te queda mejor?</legend>
              <div className="grid gap-2 sm:grid-cols-3">
                {socios.planes.map((p) => (
                  <label key={p.id} className={`tap flex cursor-pointer items-center gap-3 rounded-2xl border-2 p-4 transition-colors ${plan?.id === p.id ? 'border-secundario bg-secundario/5' : 'border-line hover:border-fg/40'}`}>
                    <input type="radio" name="plan" value={p.id} checked={plan?.id === p.id} onChange={() => setPlan(p)} className="size-5 accent-[var(--color-secundario)]" />
                    <span>
                      <span className="block font-semibold">{p.nombre}</span>
                      <span className="text-sm text-fg-muted">{p.para}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}
          {paso === 1 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label="Nombre y apellido *">{(id) => <input id={id} className={inputCls} value={datos.nombre} onChange={set('nombre')} autoComplete="name" required />}</Field>
              </div>
              <Field label="Edad">{(id) => <input id={id} className={inputCls} value={datos.edad} onChange={set('edad')} inputMode="numeric" placeholder="Ej: 12" />}</Field>
              <Field label="Teléfono *">{(id) => <input id={id} className={inputCls} value={datos.telefono} onChange={set('telefono')} type="tel" autoComplete="tel" placeholder="3571 ..." required />}</Field>
              <div className="sm:col-span-2">
                <Field label="¿Qué te interesa?">
                  {(id) => (
                    <select id={id} className={inputCls} value={datos.disciplina} onChange={set('disciplina')}>
                      <option value="">Solo ser socio/a</option>
                      {disciplinas.map((d) => (
                        <option key={d.slug}>{d.nombre}</option>
                      ))}
                      <option>Centro Cultural</option>
                    </select>
                  )}
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Comentario (opcional)">{(id) => <textarea id={id} className={`${inputCls} min-h-24`} value={datos.comentario} onChange={set('comentario')} />}</Field>
              </div>
            </div>
          )}
          {paso === 2 && (
            <div>
              <p className="mb-4 font-semicondensed text-2xl">Revisá y enviá</p>
              <dl className="divide-y divide-line rounded-2xl border border-line">
                {[
                  ['Plan', plan?.nombre],
                  ['Nombre', datos.nombre],
                  ['Edad', datos.edad || '—'],
                  ['Teléfono', datos.telefono],
                  ['Interés', datos.disciplina || 'Solo ser socio/a'],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 px-4 py-3">
                    <dt className="text-fg-muted">{k}</dt>
                    <dd className="text-right font-semibold">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-sm text-fg-muted">Se abre WhatsApp con el mensaje listo. Sin vueltas.</p>
            </div>
          )}
        </m.div>
      </AnimatePresence>

      {error && (
        <p className="mt-4 text-sm font-semibold text-brand-accent-ink" role="alert">
          {error}
        </p>
      )}

      <div className="mt-8 flex items-center justify-between gap-3">
        <button type="button" onClick={() => setPaso((p) => Math.max(0, p - 1))} className={`${btn.contorno} ${btn.chico} border-line ${paso === 0 ? 'invisible' : ''}`}>
          <ArrowLeft className="size-4" aria-hidden="true" /> Atrás
        </button>
        {paso < 2 ? (
          <button type="button" onClick={siguiente} className={btn.oscuro}>
            Siguiente <ArrowRight className="size-4" aria-hidden="true" />
          </button>
        ) : (
          <button type="button" onClick={enviar} className={btn.whatsapp}>
            <WhatsAppIcon size={20} /> Enviar<span className="hidden sm:inline"> por WhatsApp</span>
          </button>
        )}
      </div>
    </div>
  )
}

export default function Membership() {
  const [plan, setPlan] = useState<Plan | null>(null)
  const [wizardKey, setWizardKey] = useState(0)

  const elegir = (p: Plan) => {
    setPlan(p)
    setWizardKey((k) => k + 1)
    // Mismo scroll calibrado que el menú (Lenis + header). En escritorio el texto y el
    // formulario van lado a lado: alineamos el kicker "Alta de socio". En móvil van
    // apilados: vamos directo al formulario, que es donde sigue la acción.
    const escritorio = window.matchMedia('(min-width: 1024px)').matches
    scrollToId(escritorio ? 'alta-socio' : 'alta-socio-form')
  }

  return (
    <section className="relative py-16 md:py-24" aria-labelledby="socios-titulo">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeading kicker={socios.kicker} titulo={socios.titulo} bajada={socios.bajada} id="socios-titulo" />
        <p className="mt-3 text-sm text-fg-muted">
          Valores <Txt>{socios.periodicidad}</Txt>
        </p>

        <ul className="mt-8 grid gap-3 md:grid-cols-3">
          {socios.planes.map((p) => (
            <li key={p.id} className={`@container relative flex flex-col rounded-[2rem] p-6 ${p.destacado ? 'bg-primario text-white' : 'border border-line bg-surface'}`}>
              {p.destacado && <span className="absolute right-5 top-5 rounded-full bg-acento px-3 py-1 text-xs font-bold text-[#141010]">Recomendado</span>}
              <p className="font-condensed text-3xl">{p.nombre}</p>
              <p className={`mt-1 text-sm ${p.destacado ? 'text-white/75' : 'text-fg-muted'}`}>
                <Txt>{p.para}</Txt>
              </p>
              <p className="mt-4 font-semibold">
                <Txt>{p.precio}</Txt>
              </p>
              <ul className="mt-4 space-y-1.5 text-sm">
                {socios.comparador
                  .filter((f) => p.incluye.includes(f.id))
                  .map((f) => (
                    <li key={f.id} className="flex gap-2">
                      <Check className={`size-4 shrink-0 ${p.destacado ? 'text-acento' : 'text-[#1fa855]'}`} aria-hidden="true" /> {f.label}
                    </li>
                  ))}
              </ul>
              <button type="button" onClick={() => elegir(p)} className={`${p.destacado ? btn.acento : btn.oscuro} ${btn.chico} mt-auto w-full`} style={{ marginTop: '1.5rem' }}>
                Elegir {p.nombre}
              </button>
            </li>
          ))}
        </ul>

        {/* Formulario en pasos */}
        <div id="alta-socio" className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
          <div>
            <p className="kicker text-brand-accent-ink">Alta de socio</p>
            <h3 className="mt-3 font-condensed text-huge">Hacete socio en 3 pasos</h3>
            <p className="mt-4 text-lg text-fg-muted">Elegí el plan, dejá tus datos y te escribimos por WhatsApp para terminar el alta. Sin papeles, sin filas.</p>
            <Magnetic className="mt-6">
              <a href={waLink(mensajesWhatsapp.socio)} target="_blank" rel="noopener noreferrer" className={`${btn.contorno} ${btn.chico} border-line`}>
                <WhatsAppIcon size={18} /> Prefiero hablar directo
              </a>
            </Magnetic>
          </div>
          <div id="alta-socio-form" className="rounded-[2rem] border border-line bg-surface p-6 shadow-[var(--shadow)] md:p-9">
            <Wizard key={wizardKey} plan={plan} setPlan={setPlan} />
          </div>
        </div>

        {/* Otras formas de ayudar (compacto) */}
        <div className="mt-16 rounded-[2rem] bg-bg-alt p-6 md:p-8">
          <h3 className="font-condensed text-3xl">{socios.ayudar.titulo}</h3>
          <p className="mt-1 text-fg-muted">{socios.ayudar.bajada}</p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {socios.ayudar.items.map((a) => (
              <li key={a.id}>
                <a
                  href={waLink(a.id === 'sponsors' ? mensajesWhatsapp.sponsor : mensajesWhatsapp.ayudar(a.titulo.toLowerCase()))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tap group flex h-full items-start gap-3 rounded-2xl bg-surface p-4 transition-colors hover:bg-primario hover:text-white"
                >
                  <Icon name={a.icono} size={24} className="mt-0.5 shrink-0 text-brand-accent-ink group-hover:text-acento" />
                  <span>
                    <span className="flex items-center gap-1 font-semibold">
                      {a.titulo} <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </span>
                    <span className="mt-1 block text-sm opacity-80">{a.texto}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
