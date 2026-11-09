import { Suspense, useEffect, useState } from 'react'
import { useInViewOnce } from '../lib/hooks'

/**
 * Carga diferida: monta la sección (y descarga su código) recién cuando se
 * acerca a la pantalla. Mientras tanto reserva espacio con un skeleton.
 * El `id` queda siempre en el DOM para que funcionen los links con ancla.
 */
export function LazySection({ id, minHeight = 600, children, label }: { id?: string; minHeight?: number; children: React.ReactNode; label?: string }) {
  const [ref, inView] = useInViewOnce<HTMLDivElement>('900px 0px')
  const [forced, setForced] = useState(false)
  useEffect(() => {
    const on = () => setForced(true)
    window.addEventListener('casino:montar-todo', on)
    return () => window.removeEventListener('casino:montar-todo', on)
  }, [])
  const show = inView || forced
  const fallback = (
    <div style={{ minHeight }} className="mx-auto max-w-7xl px-4 py-20" role="status" aria-busy="true" aria-label={label ? `Cargando ${label}` : undefined}>
      <div className="skeleton mb-6 h-6 w-40 rounded-full" />
      <div className="skeleton mb-10 h-16 w-3/4 rounded-2xl" />
      <div className="skeleton h-72 w-full rounded-[2rem]" />
    </div>
  )
  return (
    <div ref={ref} id={id} className="scroll-mt-20">
      {show ? <Suspense fallback={fallback}>{children}</Suspense> : fallback}
    </div>
  )
}
