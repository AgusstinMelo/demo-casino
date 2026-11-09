import Lenis from 'lenis'
import { useEffect } from 'react'
import { Outlet, ScrollRestoration } from 'react-router-dom'
import { CustomCursor, DemoBanner, WhatsAppFloat } from './components/Floating'
import { Header } from './components/Header'
import { Toaster } from './components/Toaster'
import { useReducedMotion } from './lib/hooks'
import { setLenis } from './lib/scroll'
import { Footer } from './sections/Footer'

/** Scroll suave con Lenis (desactivado con prefers-reduced-motion). */
function useLenis() {
  const reduced = useReducedMotion()
  useEffect(() => {
    if (reduced) return
    const lenis = new Lenis({ autoRaf: true, lerp: 0.11, wheelMultiplier: 1, touchMultiplier: 1.2 })
    setLenis(lenis)
    const on = (e: Event) => ((e as CustomEvent).detail === 'stop' ? lenis.stop() : lenis.start())
    window.addEventListener('casino:lenis', on)
    return () => {
      window.removeEventListener('casino:lenis', on)
      lenis.destroy()
      setLenis(null)
    }
  }, [reduced])
}

export function Layout() {
  useLenis()
  return (
    <>
      <Header />
      <main id="contenido" tabIndex={-1} className="outline-none">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloat />
      <DemoBanner />
      <Toaster />
      <CustomCursor />
      <ScrollRestoration />
    </>
  )
}
