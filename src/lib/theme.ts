export type Tema = 'light' | 'dark'
const KEY = 'casino-tema'

export function temaGuardado(): Tema | null {
  try {
    const t = localStorage.getItem(KEY)
    return t === 'light' || t === 'dark' ? t : null
  } catch {
    return null
  }
}

export function temaActual(): Tema {
  const g = temaGuardado()
  if (g) return g
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function aplicarTema(t: Tema) {
  document.documentElement.dataset.theme = t
  try {
    localStorage.setItem(KEY, t)
  } catch {
    /* sin storage: el tema dura la sesión */
  }
}
