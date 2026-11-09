import { AnimatePresence, m } from 'motion/react'
import { Info, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { disciplinas, mensajesWhatsapp, sitio } from '../content'
import { useFinePointer, useReducedMotion } from '../lib/hooks'
import { waLink } from '../lib/wa'
import { WhatsAppIcon } from './BrandIcons'

/** Botón flotante de WhatsApp: el mensaje cambia según la página. */
export function WhatsAppFloat() {
  const { pathname } = useLocation()
  const slug = pathname.startsWith('/deportes/') ? pathname.split('/')[2] : null
  const d = disciplinas.find((x) => x.slug === slug)
  const msg = d ? mensajesWhatsapp.probar(d.nombre) : mensajesWhatsapp.general
  return (
    <a
      href={waLink(msg)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribinos por WhatsApp"
      className="tap group fixed bottom-4 right-4 z-[60] flex items-center gap-2 rounded-full bg-[#1fa855] p-3.5 text-white shadow-[0_12px_30px_-8px_rgb(31_168_85/0.7)] transition-[padding] hover:pr-5 md:bottom-6 md:right-6"
    >
      <span className="absolute inset-0 -z-10 animate-[pulse-ring_2.6s_ease-out_infinite] rounded-full bg-[#1fa855]/50 motion-reduce:hidden" aria-hidden="true" />
      <WhatsAppIcon size={28} />
      <span className="hidden max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold transition-[max-width] duration-500 group-hover:max-w-40 md:inline">¿Hablamos?</span>
    </a>
  )
}

/** Banner discreto de demo (se puede cerrar). */
export function DemoBanner() {
  const [visible, setVisible] = useState(() => {
    try {
      return sessionStorage.getItem('casino-demo-banner') !== 'off'
    } catch {
      return true
    }
  })
  return (
    <AnimatePresence>
      {visible && (
        <m.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: { delay: 1.6 } }}
          exit={{ y: 60, opacity: 0 }}
          className="fixed bottom-4 left-4 z-[60] flex max-w-[calc(100vw-6.5rem)] items-center gap-2 rounded-full bg-[#141010]/90 py-1.5 pl-3 pr-1.5 text-xs font-medium text-acento-200 shadow-lg backdrop-blur md:bottom-6 md:left-6"
          role="note"
        >
          <Info className="size-4 shrink-0" aria-hidden="true" />
          <span className="truncate">{sitio.bannerDemo}</span>
          <button
            type="button"
            aria-label="Ocultar aviso de demo"
            className="tap grid size-7 shrink-0 place-items-center rounded-full hover:bg-white/10"
            onClick={() => {
              setVisible(false)
              try {
                sessionStorage.setItem('casino-demo-banner', 'off')
              } catch {
                /* noop */
              }
            }}
          >
            <X className="size-3.5" aria-hidden="true" />
          </button>
        </m.div>
      )}
    </AnimatePresence>
  )
}

/** Cursor personalizado: solo desktop con mouse, cambia sobre fotos y links. */
export function CustomCursor() {
  const fine = useFinePointer()
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!fine || reduced) return
    const el = ref.current
    if (!el) return
    let x = -100,
      y = -100,
      tx = -100,
      ty = -100,
      raf = 0
    /* "Lupa": sobre botones, chips y tarjetas con fondo de color, el círculo muestra
       una copia del elemento con fondo y texto intercambiados (ningún blend mode logra
       rojo↔blanco o ámbar↔negro). Los escudos (.cursor-swap[data-swap="logo"]) intercambian rojo↔blanco.
       Estructura: lente (forma del elemento, overflow hidden) > circulo (sigue al cursor) > copia */
    const lente = document.createElement('div')
    lente.className = 'cursor-lente'
    lente.setAttribute('aria-hidden', 'true')
    const circulo = document.createElement('div')
    circulo.className = 'cursor-lente-circulo'
    lente.appendChild(circulo)
    document.body.appendChild(lente)
    let boton: HTMLElement | null = null
    let copia: HTMLElement | null = null
    let modoColores = false
    const R = 30 // radio del círculo (3.75rem / 2)
    const INTERACTIVO = 'a, button, [role="button"], label, summary'

    /** Opacidad de un color computado (rgb/rgba/color()/oklab()). */
    const alfa = (c: string) => {
      if (!c || c === 'transparent') return 0
      const barra = c.match(/\/\s*([\d.]+%?)\s*\)$/)
      if (barra) return barra[1].endsWith('%') ? parseFloat(barra[1]) / 100 : parseFloat(barra[1])
      const rgba = c.match(/^rgba\(([^)]+)\)$/)
      if (rgba) return parseFloat(rgba[1].split(',')[3] ?? '1')
      return 1
    }

    /** ¿Sobre qué elemento hay que mostrar la lupa? */
    const objetivo = (t: Element | null): HTMLElement | null => {
      const swap = t?.closest?.('.cursor-swap') as HTMLElement | null
      if (swap) return swap
      const inter = t?.closest?.(INTERACTIVO) as HTMLElement | null
      if (!inter) return null
      return alfa(getComputedStyle(inter).backgroundColor) >= 0.5 ? inter : null
    }

    const pintar = () => {
      if (!boton || !copia) return
      if (!modoColores) {
        // Escudo con inclinación 3D (pie): copiamos los estilos en línea que cambian con el mouse
        // (la copia tiene la misma estructura que el original: se recorren en paralelo)
        const orig = boton.querySelectorAll<HTMLElement>('*')
        const dup = copia.querySelectorAll<HTMLElement>('*')
        orig.forEach((o, i) => {
          const d = dup[i]
          if (!d || d.tagName === 'svg') return
          const st = o.getAttribute('style')
          if (st !== null && d.getAttribute('style') !== st) d.setAttribute('style', st)
        })
        return
      }
      const cs = getComputedStyle(boton)
      copia.style.setProperty('background-color', cs.color, 'important')
      copia.style.setProperty('color', cs.backgroundColor, 'important')
    }

    const soltar = () => {
      boton = null
      copia = null
      circulo.replaceChildren()
      lente.style.display = 'none'
    }
    const tomar = (b: HTMLElement) => {
      boton = b
      const cs = getComputedStyle(b)
      const c = b.cloneNode(true) as HTMLElement
      c.removeAttribute('id')
      c.querySelectorAll('[id]').forEach((n) => n.removeAttribute('id'))
      const r = b.getBoundingClientRect()
      const s = c.style
      modoColores = b.dataset.swap !== 'logo' && alfa(cs.backgroundColor) >= 0.5
      if (modoColores) {
        c.dataset.modo = 'colores' // los hijos heredan el color intercambiado (ver index.css)
      } else {
        // Escudo: se intercambian los rellenos rojo ↔ blanco; el texto pasa a rojo
        c.querySelectorAll('[fill]').forEach((n) => {
          const f = n.getAttribute('fill')
          if (f === 'var(--club-rojo)') n.setAttribute('fill', '#ffffff')
          else if (f === '#ffffff') n.setAttribute('fill', 'var(--club-rojo)')
        })
        c.querySelectorAll('svg').forEach((n) => n.style.setProperty('filter', 'none', 'important'))
        s.setProperty('color', 'var(--club-rojo)', 'important')
      }
      s.setProperty('box-shadow', 'none', 'important')
      s.setProperty('transition', 'none', 'important')
      s.setProperty('margin', '0', 'important')
      s.width = `${r.width}px`
      s.height = `${r.height}px`
      s.boxSizing = 'border-box'
      copia = c
      circulo.replaceChildren(c)
      pintar()
      // La lupa se recorta a la forma del elemento y al círculo del cursor
      lente.style.borderRadius = cs.borderRadius
      lente.style.display = 'block'
    }

    const loop = () => {
      x += (tx - x) * 0.2
      y += (ty - y) * 0.2
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`
      if (boton && copia) {
        if (!boton.isConnected) soltar()
        else {
          const r = boton.getBoundingClientRect()
          lente.style.transform = `translate3d(${r.left}px, ${r.top}px, 0)`
          lente.style.width = `${r.width}px`
          lente.style.height = `${r.height}px`
          // El círculo se mueve dentro de la lente y la copia se mueve al revés, así queda quieta
          const cx = x - r.left - R
          const cy = y - r.top - R
          circulo.style.transform = `translate3d(${cx}px, ${cy}px, 0)`
          copia.style.setProperty('transform', `translate3d(${-cx}px, ${-cy}px, 0)`, 'important')
          pintar() // sigue los cambios de color del hover
        }
      }
      raf = requestAnimationFrame(loop)
    }
    const move = (e: PointerEvent) => {
      tx = e.clientX
      ty = e.clientY
      const t = e.target as Element | null
      // data-cursor="neutro": el cursor no altera colores (por ejemplo, las historias con foto)
      const neutro = !!t?.closest?.('[data-cursor="neutro"]')
      const swap = neutro ? null : objetivo(t)
      if (swap !== boton) swap ? tomar(swap) : soltar()
      const state = neutro ? 'neutro' : swap ? 'swap' : t?.closest?.('[data-cursor="foto"]') && !t.closest('a, button') ? 'foto' : t?.closest?.('a, button, [role="button"], input, select, textarea, label, summary') ? 'link' : 'default'
      if (el.dataset.state !== state) el.dataset.state = state
      el.style.opacity = '1'
    }
    const leave = () => {
      el.style.opacity = '0'
      soltar()
    }
    window.addEventListener('pointermove', move, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('pointerleave', leave)
      lente.remove()
    }
  }, [fine, reduced])
  if (!fine || reduced) return null
  return <div ref={ref} className="cursor-ring" style={{ opacity: 0 }} aria-hidden="true" />
}
