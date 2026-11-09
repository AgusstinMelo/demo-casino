import { Share2 } from 'lucide-react'
import { share, type ShareData } from '../lib/share'
import { toast } from './Toaster'

/** Compartir con Web Share API (fallback: copiar link / WhatsApp). */
export function ShareButton({ data, className = '', label = 'Compartir', iconOnly = false }: { data: ShareData; className?: string; label?: string; iconOnly?: boolean }) {
  return (
    <button
      type="button"
      className={className}
      aria-label={iconOnly ? `${label}: ${data.title}` : undefined}
      onClick={async () => {
        const r = await share(data)
        if (r === 'copied') toast('¡Link copiado! Pegalo donde quieras 📋')
        if (r === 'whatsapp') toast('Abriendo WhatsApp…')
      }}
    >
      <Share2 className="size-4" aria-hidden="true" />
      {!iconOnly && label}
    </button>
  )
}
