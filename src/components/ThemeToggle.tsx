import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { aplicarTema, temaActual, type Tema } from '../lib/theme'

export function ThemeToggle({ className = '' }: { className?: string }) {
  const [tema, setTema] = useState<Tema>(() => (typeof window === 'undefined' ? 'light' : temaActual()))
  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const on = () => {
      try {
        if (!localStorage.getItem('casino-tema')) setTema(mql.matches ? 'dark' : 'light')
      } catch {
        setTema(mql.matches ? 'dark' : 'light')
      }
    }
    mql.addEventListener('change', on)
    return () => mql.removeEventListener('change', on)
  }, [])
  const oscuro = tema === 'dark'
  return (
    <button
      type="button"
      className={`tap grid size-11 place-items-center rounded-full transition-colors hover:bg-current/10 ${className}`}
      aria-label={oscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      aria-pressed={oscuro}
      onClick={() => {
        const t = oscuro ? 'light' : 'dark'
        const run = () => {
          aplicarTema(t)
          setTema(t)
        }
        const d = document as Document & { startViewTransition?: (cb: () => void) => unknown }
        if (d.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) d.startViewTransition(run)
        else run()
      }}
    >
      {oscuro ? <Sun className="size-5" aria-hidden="true" /> : <Moon className="size-5" aria-hidden="true" />}
    </button>
  )
}
