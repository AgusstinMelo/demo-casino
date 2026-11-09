import { ArrowUp } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { contacto, footer, navegacion, redes, sitio } from '../content'
import { RedIcon, WhatsAppIcon } from '../components/BrandIcons'
import { Escudo } from '../components/Escudo'
import { AnchorLink } from '../components/NavLink'
import { toast } from '../components/Toaster'
import { Txt } from '../components/Txt'
import { btn } from '../components/ui'
import { useReducedMotion } from '../lib/hooks'
import { getLenis } from '../lib/scroll'
import { waLink } from '../lib/wa'

type DOE = typeof DeviceOrientationEvent & { requestPermission?: () => Promise<'granted' | 'denied'> }

/** Escudo con inclinación 3D (CSS transforms): mouse en desktop, giroscopio en el celu. */
function EscudoTilt() {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const [giro, setGiro] = useState(false)

  useEffect(() => {
    if (reduced) return
    const el = ref.current
    if (!el) return
    const set = (rx: number, ry: number) => {
      el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`
      el.style.setProperty('--gx', `${50 + ry * 2}%`)
      el.style.setProperty('--gy', `${50 - rx * 2}%`)
    }
    const footerEl = el.closest('footer')!
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      const r = el.getBoundingClientRect()
      const x = (e.clientX - (r.left + r.width / 2)) / window.innerWidth
      const y = (e.clientY - (r.top + r.height / 2)) / window.innerHeight
      set(-y * 30, x * 36)
    }
    const onLeave = () => set(0, 0)
    const onOrient = (e: DeviceOrientationEvent) => {
      if (e.beta == null || e.gamma == null) return
      set(Math.max(-20, Math.min(20, (e.beta - 45) * 0.5)), Math.max(-25, Math.min(25, e.gamma * 0.7)))
    }
    footerEl.addEventListener('pointermove', onMove)
    footerEl.addEventListener('pointerleave', onLeave)
    window.addEventListener('deviceorientation', onOrient)
    return () => {
      footerEl.removeEventListener('pointermove', onMove)
      footerEl.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('deviceorientation', onOrient)
    }
  }, [reduced, giro])

  const pedirGiro = async () => {
    const D = (typeof DeviceOrientationEvent !== 'undefined' ? DeviceOrientationEvent : undefined) as DOE | undefined
    if (D?.requestPermission) {
      const p = await D.requestPermission().catch(() => 'denied' as const)
      if (p === 'granted') {
        setGiro(true)
        toast('¡Mové el celu! 📱')
      }
    }
  }

  return (
    <button type="button" onClick={pedirGiro} className="cursor-swap group mx-auto block [perspective:900px]" data-swap="logo">
      <span className="sr-only">Escudo del club: inclinalo moviendo el mouse o el celular</span>
      <div ref={ref} className="relative transition-transform duration-300 ease-out [transform-style:preserve-3d]" style={{ transform: 'perspective(900px)' }}>
        <div className="absolute inset-0 translate-y-6 scale-90 rounded-full bg-black/40 blur-2xl [transform:translateZ(-60px)]" aria-hidden="true" />
        <Escudo title="" className="relative h-56 w-auto drop-shadow-2xl md:h-72 [transform:translateZ(40px)]" />
        <div
          className="pointer-events-none absolute inset-0 [transform:translateZ(60px)]"
          style={{ background: 'radial-gradient(circle at var(--gx,50%) var(--gy,30%), rgb(255 255 255 / .35), transparent 45%)', maskImage: 'url(/escudo.svg)', maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center' }}
          aria-hidden="true"
        />
      </div>
    </button>
  )
}

export function Footer() {
  return (
    <footer className="fundido fundido-sin-abajo overflow-hidden bg-ambiente pb-28 pt-24 text-fg md:pb-12" aria-labelledby="footer-lema">
      <div className="mesh" style={{ opacity: 'calc(var(--blob-ambiente) * 0.6)' }} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <EscudoTilt />
        <p id="footer-lema" className="mt-10 text-center font-condensed text-mega leading-[0.85]">
          {footer.lema}
        </p>
        <p className="mx-auto mt-6 max-w-xl text-center text-lg text-fg-muted">{sitio.lema}. Hacete socio, sumate a una actividad o vení a darnos una mano.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <AnchorLink to="socios" className={btn.primario}>
            Hacete socio
          </AnchorLink>
        </div>

        <div className="mt-20 grid gap-10 border-t border-line pt-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-semicondensed text-2xl">{sitio.nombre}</p>
            <p className="mt-2 text-sm text-fg-muted">
              Av. General Savio 1476 · {sitio.barrio} · {sitio.ciudad}, {sitio.provincia}
            </p>
            <p className="mt-1 text-sm text-fg-muted">Fundado el 10 de febrero de 1944</p>
            <p className="mt-1 text-sm text-fg-muted">Ex {sitio.nombreHistorico}</p>
            <p className="mt-1 text-sm text-fg-muted">Capital Nacional del Deportista</p>
          </div>
          <nav aria-label="Secciones">
            <p className="kicker mb-3 text-brand-accent-ink">Secciones</p>
            <ul className="space-y-2">
              {navegacion.map((n) => (
                <li key={n.id}>
                  <AnchorLink to={n.id} className="text-fg/85 hover:text-fg hover:underline">
                    {n.label}
                  </AnchorLink>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="kicker mb-3 text-brand-accent-ink">Contacto</p>
            <ul className="space-y-2 text-sm text-fg/85">
              <li>
                <Txt>{contacto.direccion}</Txt>
              </li>
              <li>
                <Txt>{contacto.telefono}</Txt>
              </li>
              <li>
                <Txt>{contacto.email}</Txt>
              </li>
              <li>
                <a href={waLink('¡Hola Casino!')} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:underline">
                  <WhatsAppIcon size={16} /> WhatsApp
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="kicker mb-3 text-brand-accent-ink">Redes</p>
            <ul className="space-y-2 text-sm">
              {redes.map((r) => (
                <li key={r.id}>
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-fg/85 hover:text-fg hover:underline">
                    <RedIcon tipo={r.tipo} size={16} /> {r.usuario}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-line pt-6 text-sm text-fg-muted sm:flex-row sm:items-center">
          <p>{footer.copyright}</p>
          <p>{sitio.bannerDemo}</p>
          <button
            type="button"
            className="tap inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 hover:bg-fg hover:text-bg"
            onClick={() => {
              const l = getLenis()
              if (l) l.scrollTo(0)
              else window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          >
            <ArrowUp className="size-4" aria-hidden="true" /> Volver arriba
          </button>
        </div>
      </div>
    </footer>
  )
}
