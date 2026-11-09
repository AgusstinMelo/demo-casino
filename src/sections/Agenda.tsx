import { AnimatePresence, m } from 'motion/react'
import { CalendarPlus, MapPin, QrCode } from 'lucide-react'
import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { agenda, sitio, type Evento } from '../content'
import { SectionHeading } from '../components/Kinetic'
import { ShareButton } from '../components/ShareButton'
import { plano, Txt } from '../components/Txt'
import { btn, chip } from '../components/ui'
import { useReducedMotion } from '../lib/hooks'
import { descargarIcs, eventoUrl } from '../lib/ics'

const QrModal = lazy(() => import('../components/QrModal').then((mod) => ({ default: mod.QrModal })))

const fecha = (iso: string) => {
  const d = new Date(iso)
  const tz = 'America/Argentina/Cordoba'
  return {
    dia: d.toLocaleDateString('es-AR', { day: '2-digit', timeZone: tz }),
    mes: d.toLocaleDateString('es-AR', { month: 'short', timeZone: tz }).replace('.', ''),
    semana: d.toLocaleDateString('es-AR', { weekday: 'long', timeZone: tz }),
    hora: d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: tz }),
  }
}

const TIPO: Record<Evento['tipo'], string> = { partido: 'Partido', torneo: 'Torneo', cultural: 'Cultural', social: 'Social' }

export default function Agenda() {
  const [filtro, setFiltro] = useState('todos')
  const [qr, setQr] = useState<Evento | null>(null)
  const [destacado, setDestacado] = useState<string | null>(null)
  const [verTodo, setVerTodo] = useState(false)
  const reduced = useReducedMotion()

  // Link directo a un evento (?evento=id), ej. desde un QR
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('evento')
    if (id) setDestacado(id)
  }, [])

  const eventos = useMemo(() => agenda.eventos.filter((e) => filtro === 'todos' || e.disciplina === filtro), [filtro])

  return (
    <section className="fundido bg-bg-alt py-16 md:py-24" aria-labelledby="agenda-titulo">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeading kicker={agenda.kicker} titulo={agenda.titulo} bajada={agenda.bajada} id="agenda-titulo" />
        <p className="mt-3">
          <span className="tag-ejemplo">Fechas de ejemplo</span>
        </p>

        <div className="no-scrollbar -mx-4 mt-10 flex gap-2 overflow-x-auto px-4 pb-2" role="group" aria-label="Filtrar por disciplina">
          {agenda.filtros.map((f) => (
            <button key={f.id} type="button" className={`${chip(filtro === f.id)} shrink-0`} aria-pressed={filtro === f.id} onClick={() => setFiltro(f.id)}>
              {f.label}
            </button>
          ))}
        </div>

        <m.ul layout={!reduced} className="mt-6 grid gap-3 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {(verTodo ? eventos : eventos.slice(0, 4)).map((ev) => {
              const f = fecha(ev.inicio)
              const titulo = plano(ev.titulo)
              return (
                <m.li
                  key={ev.id}
                  layout={!reduced}
                  initial={reduced ? false : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`@container rounded-[2rem] border bg-surface p-5 md:p-6 ${destacado === ev.id ? 'border-secundario ring-4 ring-secundario/20' : 'border-line'}`}
                >
                  <article className="flex gap-5">
                    <div className="grid h-24 w-20 shrink-0 place-content-center rounded-2xl bg-primario text-center text-white">
                      <span className="font-condensed text-4xl leading-none">{f.dia}</span>
                      <span className="text-sm font-semibold uppercase tracking-widest">{f.mes}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="kicker text-brand-accent-ink">
                        {TIPO[ev.tipo]} · <span className="capitalize">{f.semana}</span> {f.hora} h
                      </p>
                      <h3 className="mt-1 font-semicondensed text-2xl leading-tight">
                        <Txt>{ev.titulo}</Txt>
                      </h3>
                      <p className="mt-1 flex items-center gap-1.5 text-sm text-fg-muted">
                        <MapPin className="size-4 shrink-0" aria-hidden="true" /> {ev.lugar}
                      </p>
                      <p className="mt-2 text-sm text-fg-muted">{ev.descripcion}</p>
                    </div>
                  </article>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <button type="button" onClick={() => descargarIcs(ev)} className={`${btn.oscuro} ${btn.chico}`}>
                      <CalendarPlus className="size-4" aria-hidden="true" /> Agregar al calendario
                    </button>
                    <ShareButton data={{ title: titulo, text: `${titulo} — ${f.semana} ${f.dia} ${f.mes}, ${f.hora} h en ${sitio.nombre}`, url: eventoUrl(ev.id) }} className={`${btn.contorno} ${btn.chico} border-line`} />
                    <button type="button" onClick={() => setQr(ev)} className={`${btn.contorno} ${btn.chico} border-line`}>
                      <QrCode className="size-4" aria-hidden="true" /> Ver QR
                    </button>
                  </div>
                </m.li>
              )
            })}
          </AnimatePresence>
        </m.ul>
        {eventos.length > 4 && (
          <div className="mt-6 text-center">
            <button type="button" onClick={() => setVerTodo((v) => !v)} className={`${btn.contorno} ${btn.chico} border-line`} aria-expanded={verTodo}>
              {verTodo ? 'Ver menos' : `Ver más eventos (${eventos.length - 4})`}
            </button>
          </div>
        )}
        {eventos.length === 0 && <p className="mt-6 rounded-2xl border border-dashed border-line p-8 text-center text-fg-muted">No hay eventos cargados para esta disciplina por ahora.</p>}
      </div>
      {qr && (
        <Suspense fallback={null}>
          <QrModal open={!!qr} onClose={() => setQr(null)} url={eventoUrl(qr.id)} titulo={plano(qr.titulo)} />
        </Suspense>
      )}
    </section>
  )
}
