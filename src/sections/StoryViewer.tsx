import { AnimatePresence, m } from 'motion/react'
import { ChevronLeft, ChevronRight, Pause, Play, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import type { GrupoHistorias } from '../content'
import { mensajesWhatsapp } from '../content'
import { plano, Txt } from '../components/Txt'
import { btn } from '../components/ui'
import { useFocusTrap, useLockBody, useReducedMotion } from '../lib/hooks'
import { imgUrl } from '../lib/img'
import { scrollToId } from '../lib/scroll'
import { waLink } from '../lib/wa'

const DURACION = 6000

/** Visor de historias a pantalla completa: toque, swipe, teclado y pausa. */
export default function StoryViewer({
  grupos,
  inicio,
  onClose,
  onVisto,
}: {
  grupos: GrupoHistorias[]
  inicio: number
  onClose: () => void
  onVisto: (id: string) => void
}) {
  const [g, setG] = useState(inicio)
  const [s, setS] = useState(0)
  const [paused, setPaused] = useState(false)
  const [dir, setDir] = useState(1)
  const barRef = useRef<HTMLSpanElement>(null)
  const elapsed = useRef(0)
  // Duración de la historia actual: 6 s las imágenes, lo que dure el video (tope 60 s)
  const duracion = useRef(DURACION)
  const videoRef = useRef<HTMLVideoElement>(null)
  const reduced = useReducedMotion()
  const navigate = useNavigate()
  useLockBody(true)
  const trapRef = useFocusTrap<HTMLDivElement>(true, onClose)

  const grupo = grupos[g]
  const story = grupo.historias[s]

  useEffect(() => onVisto(grupo.id), [grupo.id, onVisto])
  useEffect(() => {
    duracion.current = DURACION
  }, [g, s])
  // El video se pausa junto con la historia
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (paused) v.pause()
    else v.play().catch(() => {})
  }, [paused, g, s])

  const next = useCallback(() => {
    elapsed.current = 0
    if (s < grupo.historias.length - 1) setS(s + 1)
    else if (g < grupos.length - 1) {
      setDir(1)
      setG(g + 1)
      setS(0)
    } else onClose()
  }, [s, g, grupo.historias.length, grupos.length, onClose])

  const prev = useCallback(() => {
    elapsed.current = 0
    if (s > 0) setS(s - 1)
    else if (g > 0) {
      setDir(-1)
      setG(g - 1)
      setS(grupos[g - 1].historias.length - 1)
    } else setS(0)
  }, [s, g, grupos])

  const nextGroup = useCallback(() => {
    elapsed.current = 0
    if (g < grupos.length - 1) {
      setDir(1)
      setG(g + 1)
      setS(0)
    } else onClose()
  }, [g, grupos.length, onClose])
  const prevGroup = useCallback(() => {
    elapsed.current = 0
    if (g > 0) {
      setDir(-1)
      setG(g - 1)
      setS(0)
    }
  }, [g])

  // Temporizador con requestAnimationFrame (funciona también con movimiento reducido)
  useEffect(() => {
    let raf = 0
    let last = performance.now()
    const tick = (t: number) => {
      const dt = t - last
      last = t
      if (!paused) elapsed.current += dt
      const p = Math.min(1, elapsed.current / duracion.current)
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`
      if (p >= 1) {
        next()
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [g, s, paused, next])

  // Precarga de la próxima imagen
  useEffect(() => {
    const n = grupo.historias[s + 1] ?? grupos[g + 1]?.historias[0]
    if (n?.tipo === 'imagen') new Image().src = imgUrl(n.src, 720, 1280)
  }, [g, s, grupo, grupos])

  // Teclado
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next()
      else if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowDown') nextGroup()
      else if (e.key === 'ArrowUp') prevGroup()
      else if (e.key === ' ' && (e.target as HTMLElement).tagName !== 'BUTTON') {
        e.preventDefault()
        setPaused((p) => !p)
      }
    }
    window.addEventListener('keydown', on)
    return () => window.removeEventListener('keydown', on)
  }, [next, prev, nextGroup, prevGroup])

  // Gestos: toque izquierda/derecha, mantener para pausar, swipe lateral y hacia abajo
  const start = useRef<{ x: number; y: number; t: number } | null>(null)
  const holdTimer = useRef<number>(0)
  const onDown = (e: React.PointerEvent) => {
    start.current = { x: e.clientX, y: e.clientY, t: performance.now() }
    holdTimer.current = window.setTimeout(() => setPaused(true), 180)
  }
  const onUp = (e: React.PointerEvent) => {
    window.clearTimeout(holdTimer.current)
    const st = start.current
    start.current = null
    if (!st) return
    const dx = e.clientX - st.x
    const dy = e.clientY - st.y
    const dt = performance.now() - st.t
    if (paused && dt > 180) {
      setPaused(false)
      return
    }
    if (dy > 90 && Math.abs(dy) > Math.abs(dx)) return onClose()
    if (Math.abs(dx) > 60) return dx < 0 ? nextGroup() : prevGroup()
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    if (e.clientX - rect.left < rect.width * 0.33) prev()
    else next()
  }

  const ir = (href: string) => {
    onClose()
    if (href.startsWith('/#')) {
      navigate('/')
      setTimeout(() => scrollToId(href.slice(2)), 50)
    } else navigate(href, { viewTransition: !reduced })
  }

  return createPortal(
    <div ref={trapRef} className="fixed inset-0 z-[95] flex items-center justify-center bg-black/95" role="dialog" aria-modal="true" aria-label={`Historias de ${grupo.nombre}`}>
      <AnimatePresence initial={false} custom={dir} mode="popLayout">
        <m.div
          key={grupo.id}
          custom={dir}
          className="relative h-[100dvh] w-full overflow-hidden bg-primario-700 sm:h-[min(92dvh,860px)] sm:w-auto sm:rounded-3xl"
          style={{ aspectRatio: '9 / 16' }}
          initial={reduced ? false : { x: `${dir * 100}%`, opacity: 0.4, rotateY: dir * 25 }}
          animate={{ x: 0, opacity: 1, rotateY: 0 }}
          exit={reduced ? { opacity: 0 } : { x: `${-dir * 100}%`, opacity: 0.4, rotateY: -dir * 25 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Medio */}
          {story.tipo === 'video' ? (
            <video ref={videoRef} key={story.id} src={story.src} onLoadedMetadata={(e) => { const d = e.currentTarget.duration; if (Number.isFinite(d) && d > 0) duracion.current = Math.min(d, 60) * 1000 }} poster={story.poster} className="absolute inset-0 h-full w-full object-cover" autoPlay muted playsInline aria-label={story.alt} />
          ) : (
            <img key={story.id} src={imgUrl(story.src, 720, 1280)} alt={story.alt} className="absolute inset-0 h-full w-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/85" aria-hidden="true" />

          {/* Zona táctil */}
          <div className="absolute inset-0 z-10 touch-none select-none" onPointerDown={onDown} onPointerUp={onUp} onPointerCancel={() => window.clearTimeout(holdTimer.current)} aria-hidden="true" />

          {/* Barras de progreso */}
          <div className="absolute inset-x-0 top-0 z-20 flex gap-1 p-3 pt-[max(0.75rem,env(safe-area-inset-top))]" aria-hidden="true">
            {grupo.historias.map((h, i) => (
              <span key={h.id} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/35">
                <span
                  ref={i === s ? barRef : undefined}
                  className="block h-full origin-left rounded-full bg-white"
                  style={{ transform: `scaleX(${i < s ? 1 : 0})` }}
                />
              </span>
            ))}
          </div>

          {/* Cabecera */}
          <div className="absolute inset-x-0 top-5 z-20 flex items-center justify-between px-3 pt-[env(safe-area-inset-top)] text-white">
            <div className="flex items-center gap-2">
              <img src={imgUrl(grupo.portada.src, 80, 80)} alt="" className="size-9 rounded-full border-2 border-white/80 object-cover" />
              <span className="text-sm font-semibold">{grupo.nombre}</span>
              {!story.enVivo && <span className="tag-ejemplo">Ejemplo</span>}
            </div>
            <div className="flex items-center">
              <button type="button" onClick={() => setPaused((p) => !p)} className="tap grid size-11 place-items-center rounded-full hover:bg-white/15" aria-label={paused ? 'Reanudar' : 'Pausar'}>
                {paused ? <Play className="size-5" aria-hidden="true" /> : <Pause className="size-5" aria-hidden="true" />}
              </button>
              <button type="button" onClick={onClose} className="tap grid size-11 place-items-center rounded-full hover:bg-white/15" aria-label="Cerrar historias" data-autofocus>
                <X className="size-6" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Texto + CTA */}
          <div className="absolute inset-x-0 bottom-0 z-20 p-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-white" aria-live="polite">
            {story.texto && (
              <m.p key={story.id} initial={reduced ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mb-5 font-semicondensed text-3xl leading-tight">
                <Txt>{story.texto}</Txt>
              </m.p>
            )}
            <div className="flex gap-2">
              {story.enVivo && grupo.cuenta ? (
                <a href={`https://www.instagram.com/${grupo.cuenta}/`} target="_blank" rel="noopener noreferrer" className={`${btn.claro} flex-1`}>
                  Ver en Instagram
                </a>
              ) : story.cta ? (
                <button type="button" onClick={() => ir(story.cta!.href)} className={`${btn.claro} flex-1`}>
                  {story.cta.label}
                </button>
              ) : (
                <a href={waLink(`${mensajesWhatsapp.general} Vi la historia: "${plano(story.texto)}"`)} target="_blank" rel="noopener noreferrer" className={`${btn.claro} flex-1`}>
                  Quiero saber más
                </a>
              )}
            </div>
          </div>

          {/* Controles visibles en desktop / teclado */}
          <button type="button" onClick={prev} className="tap absolute left-2 top-1/2 z-20 hidden size-11 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white backdrop-blur hover:bg-white/30 sm:grid" aria-label="Historia anterior">
            <ChevronLeft className="size-6" aria-hidden="true" />
          </button>
          <button type="button" onClick={next} className="tap absolute right-2 top-1/2 z-20 hidden size-11 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white backdrop-blur hover:bg-white/30 sm:grid" aria-label="Historia siguiente">
            <ChevronRight className="size-6" aria-hidden="true" />
          </button>
        </m.div>
      </AnimatePresence>
      <p className="sr-only">Usá las flechas izquierda y derecha para cambiar de historia, arriba y abajo para cambiar de sección, espacio para pausar y Escape para cerrar.</p>
    </div>,
    document.body,
  )
}
