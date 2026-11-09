import { Fragment } from 'react'

const RE = /\[(COMPLETAR|EJEMPLO)([^\]]*)\]/g

/**
 * Muestra un texto de content.ts resaltando los "[COMPLETAR: ...]" (dato a
 * relevar) y convirtiendo "[EJEMPLO]" en una etiqueta visible.
 */
export function Txt({ children, className }: { children: string; className?: string }) {
  const parts: React.ReactNode[] = []
  let last = 0
  let i = 0
  for (const m of children.matchAll(RE)) {
    const idx = m.index ?? 0
    if (idx > last) parts.push(<Fragment key={i++}>{children.slice(last, idx)}</Fragment>)
    if (m[1] === 'COMPLETAR') {
      parts.push(
        <span key={i++} className="ph" title="Dato a completar con el club">
          {m[0]}
        </span>,
      )
    } else {
      parts.push(
        <span key={i++} className="tag-ejemplo mr-1 align-middle">
          Ejemplo
        </span>,
      )
    }
    last = idx + m[0].length
  }
  if (last < children.length) parts.push(<Fragment key={i++}>{children.slice(last).replace(/^\s+/, last ? ' ' : '')}</Fragment>)
  return className ? <span className={className}>{parts}</span> : <>{parts}</>
}

/** Texto plano sin marcas (para alt, aria-label, mensajes de WhatsApp). */
export const plano = (s: string) => s.replace(/\[EJEMPLO\]\s*/g, '').trim()
export const esPendiente = (s: string) => s.includes('[COMPLETAR')
