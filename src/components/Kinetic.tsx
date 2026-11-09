import { AnimatePresence, m } from 'motion/react'
import { Fragment, useEffect, useState, type ElementType } from 'react'
import { useReducedMotion } from '../lib/hooks'

type Props = {
  text: string
  as?: ElementType
  className?: string
  /** Animar al montar (hero) en vez de al entrar en pantalla */
  onMount?: boolean
  delay?: number
  stagger?: number
  id?: string
}

/** Tipografía cinética: el título entra palabra por palabra. */
export function KineticTitle({ text, as: Tag = 'h2', className = '', onMount = false, intro = true, delay = 0, stagger = 0.07, id }: Props & { intro?: boolean }) {
  const reduced = useReducedMotion()
  const words = text.split(' ')
  // Al montar (hero) usamos animación CSS pura: el título se pinta sin esperar
  // a que cargue JavaScript, lo que mejora el LCP.
  if (onMount)
    return (
      <Tag className={className} id={id}>
        {words.map((w, i) => (
          <Fragment key={i}>
            <span className={intro ? 'kt-word' : 'inline-block'} style={{ ['--d' as string]: `${delay + i * stagger}s` }}>
              {w}
            </span>
            {i < words.length - 1 && ' '}
          </Fragment>
        ))}
      </Tag>
    )
  const anim = onMount ? { animate: 'show' } : { whileInView: 'show', viewport: { once: true, margin: '0px 0px -12% 0px' } }
  return (
    <Tag className={className} id={id}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="inline-block overflow-hidden pb-[0.06em] align-bottom">
            <m.span
              className="inline-block will-change-transform"
              initial={reduced ? false : 'hidden'}
              {...anim}
              variants={{
                hidden: { y: '105%', rotate: 4 },
                show: { y: '0%', rotate: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: delay + i * stagger } },
              }}
            >
              {w}
            </m.span>
          </span>
          {i < words.length - 1 && ' '}
        </Fragment>
      ))}
    </Tag>
  )
}

/** Palabra rotativa (DEPORTE / CULTURA / COMUNIDAD / FAMILIA). */
export function RotatingWord({ words, className = '', interval = 2200 }: { words: string[]; className?: string; interval?: number }) {
  const reduced = useReducedMotion()
  const [i, setI] = useState(0)
  useEffect(() => {
    if (reduced) return
    const t = window.setInterval(() => setI((v) => (v + 1) % words.length), interval)
    return () => window.clearInterval(t)
  }, [reduced, words.length, interval])
  return (
    <span className={`relative inline-grid overflow-hidden align-bottom ${className}`}>
      {/* texto accesible: todas las palabras, sin anunciar cada cambio */}
      <span className="sr-only">{words.join(', ')}</span>
      <AnimatePresence mode="popLayout" initial={false}>
        <m.span
          key={words[i]}
          aria-hidden="true"
          className="col-start-1 row-start-1 inline-block"
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {words[i]}
        </m.span>
      </AnimatePresence>
    </span>
  )
}

/** Encabezado estándar de sección: kicker + título cinético + bajada. */
export function SectionHeading({
  kicker,
  titulo,
  bajada,
  id,
  align = 'left',
  tone = 'default',
  className = '',
  size = 'giant',
}: {
  size?: 'giant' | 'huge'
  kicker: string
  titulo: string
  bajada?: React.ReactNode
  id?: string
  align?: 'left' | 'center'
  tone?: 'default' | 'light'
  className?: string
}) {
  const light = tone === 'light'
  return (
    <header className={`${align === 'center' ? 'mx-auto text-center' : ''} max-w-5xl ${className}`}>
      <p className={`kicker mb-4 flex items-center gap-3 ${align === 'center' ? 'justify-center' : ''} ${light ? 'text-acento' : 'text-brand-accent-ink'}`}>
        <span className="inline-block h-0.5 w-8 bg-current" aria-hidden="true" />
        {kicker}
      </p>
      <KineticTitle text={titulo} id={id} className={`font-condensed ${size === 'huge' ? 'text-huge' : 'text-giant'} ${light ? 'text-white' : 'text-fg'}`} />
      {bajada && <p className={`mt-5 max-w-2xl text-lg leading-relaxed md:text-xl ${align === 'center' ? 'mx-auto' : ''} ${light ? 'text-white/80' : 'text-fg-muted'}`}>{bajada}</p>}
    </header>
  )
}
