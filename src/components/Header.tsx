import { AnimatePresence, m } from 'motion/react'
import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { navegacion, redes } from '../content'
import { useFocusTrap, useLockBody } from '../lib/hooks'
import { RedIcon } from './BrandIcons'
import { Escudo } from './Escudo'
import { Magnetic } from './Magnetic'
import { AnchorLink } from './NavLink'
import { ThemeToggle } from './ThemeToggle'
import { btn } from './ui'

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  useEffect(() => setOpen(false), [location.pathname])

  const solid = scrolled || open
  return (
    <>
      <a href="#contenido" className="sr-only z-[100] rounded-full bg-acento px-4 py-2 font-semibold text-[#141010] focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Saltar al contenido
      </a>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[padding] duration-500 ${solid ? 'py-2' : 'py-3 md:py-5'}`}
        style={{ viewTransitionName: 'header' }}
      >
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-full px-3 py-1.5 transition-[background-color,color,box-shadow,border-color] duration-500 md:px-4 ${
            solid ? 'glass mx-3 text-fg shadow-lg md:mx-auto' : 'mx-3 border border-transparent text-white md:mx-auto'
          }`}
        >
          <Link to="/" className="cursor-swap tap flex items-center gap-2.5 rounded-full pr-2" data-swap="logo" viewTransition>
            <Escudo className="h-10 w-auto drop-shadow md:h-11" title="" />
            <span className="font-semicondensed text-lg uppercase leading-none tracking-wide">
              Casino
              <span className="block text-[0.6rem] font-semibold tracking-[0.2em] opacity-75">Río Tercero</span>
            </span>
          </Link>

          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex items-center gap-0.5 xl:gap-1">
              {navegacion.map((n) => (
                <li key={n.id}>
                  <AnchorLink to={n.id} className="tap rounded-full px-3 py-2 xl:px-4 text-sm font-semibold transition-colors hover:bg-current/10">
                    {n.label}
                  </AnchorLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1">
            <ThemeToggle />
            <span className="hidden sm:block"><Magnetic>
              <AnchorLink to="socios" className={`${btn.primario} ${btn.chico}`}>
                Hacete socio
              </AnchorLink>
            </Magnetic></span>
            <button
              type="button"
              className="tap grid size-11 place-items-center rounded-full hover:bg-current/10 lg:hidden"
              aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={open}
              aria-controls="menu-movil"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="size-6" aria-hidden="true" /> : <Menu className="size-6" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </>
  )
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  useLockBody(open)
  const ref = useFocusTrap<HTMLDivElement>(open, onClose)
  return (
    <AnimatePresence>
      {open && (
        <m.div
          ref={ref}
          id="menu-movil"
          role="dialog"
          aria-modal="true"
          aria-label="Menú"
          className="glass fixed inset-0 z-40 flex flex-col overflow-y-auto px-6 pb-10 pt-28 lg:hidden"
          initial={{ clipPath: 'circle(0% at 92% 4%)' }}
          animate={{ clipPath: 'circle(150% at 92% 4%)' }}
          exit={{ clipPath: 'circle(0% at 92% 4%)' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <nav aria-label="Menú móvil">
            <ul className="space-y-1">
              {navegacion.map((n, i) => (
                <m.li key={n.id} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 + i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
                  <AnchorLink to={n.id} onNavigate={onClose} className="tap flex items-baseline gap-4 py-1 font-condensed text-4xl text-fg">
                    <span className="font-sans text-sm font-semibold text-brand-accent-ink">0{i + 1}</span>
                    {n.label}
                  </AnchorLink>
                </m.li>
              ))}
            </ul>
          </nav>
          <m.div className="mt-auto space-y-6 pt-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <AnchorLink to="socios" onNavigate={onClose} className={`${btn.primario} w-full text-lg`}>
              Hacete socio
            </AnchorLink>
            <ul className="flex flex-wrap gap-2" aria-label="Redes del club">
              {redes.map((r) => (
                <li key={r.id}>
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="tap grid size-11 place-items-center rounded-full border border-line" aria-label={`${r.nombre} en ${r.tipo === 'facebook' ? 'Facebook' : 'Instagram'}`}>
                    <RedIcon tipo={r.tipo} />
                  </a>
                </li>
              ))}
            </ul>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  )
}
