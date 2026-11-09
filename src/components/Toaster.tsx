import { AnimatePresence, m } from 'motion/react'
import { useEffect, useState } from 'react'

type T = { id: number; text: string }

/** Muestra un aviso breve desde cualquier lugar: toast('Link copiado') */
export function toast(text: string) {
  window.dispatchEvent(new CustomEvent('casino:toast', { detail: text }))
}

export function Toaster() {
  const [items, setItems] = useState<T[]>([])
  useEffect(() => {
    const on = (e: Event) => {
      const id = Date.now() + Math.random()
      setItems((v) => [...v, { id, text: (e as CustomEvent<string>).detail }])
      window.setTimeout(() => setItems((v) => v.filter((x) => x.id !== id)), 2800)
    }
    window.addEventListener('casino:toast', on)
    return () => window.removeEventListener('casino:toast', on)
  }, [])
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[80] flex flex-col items-center gap-2 px-4" role="status" aria-live="polite">
      <AnimatePresence>
        {items.map((t) => (
          <m.div
            key={t.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="rounded-full bg-fg px-5 py-3 text-sm font-semibold text-bg shadow-2xl"
          >
            {t.text}
          </m.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
