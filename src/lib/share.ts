import { waShare } from './wa'

export type ShareData = { title: string; text: string; url: string }
export type ShareResult = 'shared' | 'copied' | 'whatsapp' | 'cancelled'

/** Web Share API con fallback: copiar link y, si no se puede, WhatsApp. */
export async function share(data: ShareData): Promise<ShareResult> {
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share(data)
      return 'shared'
    } catch (e) {
      if ((e as DOMException)?.name === 'AbortError') return 'cancelled'
    }
  }
  try {
    await navigator.clipboard.writeText(data.url)
    return 'copied'
  } catch {
    window.open(waShare(data.text, data.url), '_blank', 'noopener')
    return 'whatsapp'
  }
}
