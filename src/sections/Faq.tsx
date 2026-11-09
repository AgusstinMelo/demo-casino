import { AnimatePresence, m } from 'motion/react'
import { RotateCcw } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { faq, mensajesWhatsapp } from '../content'
import { Escudo } from '../components/Escudo'
import { WhatsAppIcon } from '../components/BrandIcons'
import { SectionHeading } from '../components/Kinetic'
import { Txt } from '../components/Txt'
import { btn } from '../components/ui'
import { useReducedMotion } from '../lib/hooks'
import { waLink } from '../lib/wa'

type Msg = { id: string; de: 'club' | 'yo'; texto: string; escribiendo?: boolean }

/** Texto que aparece con efecto de escritura. */
function Typewriter({ text, onDone }: { text: string; onDone: () => void }) {
  const reduced = useReducedMotion()
  const [n, setN] = useState(reduced ? text.length : 0)
  const done = useRef(onDone)
  useEffect(() => {
    done.current = onDone
  })
  useEffect(() => {
    if (reduced) {
      done.current()
      return
    }
    let i = 0
    const t = window.setInterval(() => {
      i += 2
      setN(i)
      if (i >= text.length) {
        window.clearInterval(t)
        done.current()
      }
    }, 18)
    return () => window.clearInterval(t)
  }, [text, reduced])
  const visible = text.slice(0, n)
  return n >= text.length ? <Txt>{text}</Txt> : <>{visible}</>
}

export default function Faq() {
  const [msgs, setMsgs] = useState<Msg[]>([{ id: 'hola', de: 'club', texto: faq.saludo }])
  const [ocupado, setOcupado] = useState(false)
  const [hechas, setHechas] = useState<string[]>([])
  const box = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = box.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [msgs])

  // Mientras se "escribe" la respuesta, mantenemos el chat abajo de todo
  useEffect(() => {
    if (!ocupado) return
    const t = window.setInterval(() => {
      const el = box.current
      if (el) el.scrollTop = el.scrollHeight
    }, 120)
    return () => window.clearInterval(t)
  }, [ocupado])

  const preguntar = (id: string) => {
    const q = faq.preguntas.find((p) => p.id === id)
    if (!q || ocupado) return
    setOcupado(true)
    setHechas((h) => [...h, id])
    setMsgs((m) => [...m, { id: `q-${id}-${m.length}`, de: 'yo', texto: q.pregunta }, { id: `a-${id}-${m.length}`, de: 'club', texto: q.respuesta, escribiendo: true }])
  }

  const pendientes = faq.preguntas.filter((p) => !hechas.includes(p.id))

  return (
    <section className="py-16 md:py-24" aria-labelledby="faq-titulo">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 md:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div>
          <SectionHeading kicker={faq.kicker} titulo={faq.titulo} bajada={faq.bajada} id="faq-titulo" size="huge" />
        </div>
        <div className="overflow-hidden rounded-[2rem] border border-line bg-surface shadow-[var(--shadow)]">
          <div className="flex items-center gap-3 border-b border-line bg-primario px-5 py-4 text-white">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white"><Escudo className="h-8 w-auto" title="" /></span>
            <div>
              <p className="font-semibold leading-tight">Club Deportivo Casino</p>
              <p className="text-xs text-white/75">{ocupado ? 'escribiendo…' : 'en línea'}</p>
            </div>
            <button
              type="button"
              className="tap ml-auto grid size-10 place-items-center rounded-full hover:bg-white/15"
              aria-label="Reiniciar conversación"
              onClick={() => {
                setMsgs([{ id: 'hola', de: 'club', texto: faq.saludo }])
                setHechas([])
                setOcupado(false)
              }}
            >
              <RotateCcw className="size-4" aria-hidden="true" />
            </button>
          </div>
          <div ref={box} className="h-[26rem] space-y-3 overflow-y-auto bg-[radial-gradient(circle_at_1px_1px,var(--border)_1px,transparent_0)] bg-[length:18px_18px] p-4 md:p-6" aria-live="polite" data-lenis-prevent>
            <AnimatePresence initial={false}>
              {msgs.map((m_) => (
                <m.div key={m_.id} initial={{ opacity: 0, y: 12, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} className={`flex ${m_.de === 'yo' ? 'justify-end' : 'justify-start'}`}>
                  <p
                    className={`max-w-[85%] rounded-3xl px-4 py-3 text-[0.95rem] leading-relaxed shadow-sm ${
                      m_.de === 'yo' ? 'rounded-br-md bg-primario text-white' : 'rounded-bl-md border border-line bg-bg text-fg'
                    }`}
                  >
                    {m_.escribiendo ? (
                      <Escribiendo
                        text={m_.texto}
                        onDone={() => {
                          setMsgs((all) => all.map((x) => (x.id === m_.id ? { ...x, escribiendo: false } : x)))
                          setOcupado(false)
                        }}
                      />
                    ) : (
                      <Txt>{m_.texto}</Txt>
                    )}
                  </p>
                </m.div>
              ))}
            </AnimatePresence>
          </div>
          <div className="border-t border-line p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-fg-muted">Preguntas sugeridas</p>
            <div className="flex flex-wrap gap-2">
              {pendientes.map((p) => (
                <button key={p.id} type="button" disabled={ocupado} onClick={() => preguntar(p.id)} className="tap rounded-full border border-primario/30 bg-primario/5 px-4 py-2 text-left text-sm font-semibold text-brand-ink transition-colors hover:bg-primario hover:text-white disabled:opacity-50 dark:border-white/20">
                  {p.pregunta}
                </button>
              ))}
              <a href={waLink(mensajesWhatsapp.general)} target="_blank" rel="noopener noreferrer" className={`${btn.whatsapp} ${btn.chico}`}>
                <WhatsAppIcon size={18} /> {faq.whatsapp}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/** Muestra "..." un instante y luego escribe la respuesta. */
function Escribiendo({ text, onDone }: { text: string; onDone: () => void }) {
  const reduced = useReducedMotion()
  const [puntos, setPuntos] = useState(!reduced)
  useEffect(() => {
    if (!puntos) return
    const t = window.setTimeout(() => setPuntos(false), 700)
    return () => window.clearTimeout(t)
  }, [puntos])
  if (puntos)
    return (
      <span className="flex gap-1 py-1" aria-label="Escribiendo">
        {[0, 1, 2].map((i) => (
          <span key={i} className="size-2 rounded-full bg-fg-muted" style={{ animation: `typing 1s ${i * 0.15}s infinite` }} />
        ))}
      </span>
    )
  return <Typewriter text={text} onDone={onDone} />
}
