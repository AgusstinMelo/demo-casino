import { contacto } from '../content'

/**
 * Arma un link de WhatsApp con el mensaje prellenado.
 * Si todavía no se cargó el número del club, abre WhatsApp para elegir contacto.
 */
export function waLink(mensaje: string): string {
  const texto = encodeURIComponent(mensaje)
  const numero = contacto.whatsapp.replace(/\D/g, '')
  return numero ? `https://wa.me/${numero}?text=${texto}` : `https://wa.me/?text=${texto}`
}

/** Link para compartir algo por WhatsApp (sin destinatario). */
export function waShare(texto: string, url: string): string {
  return `https://wa.me/?text=${encodeURIComponent(`${texto}\n${url}`)}`
}
