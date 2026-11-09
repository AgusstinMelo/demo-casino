import type { Evento } from '../content'
import { sitio } from '../content'

const fmt = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;')

export const eventoUrl = (id: string) => `${sitio.url}/?evento=${id}#agenda`

/** Genera y descarga un archivo .ics para "Agregar al calendario". */
export function descargarIcs(ev: Evento) {
  const url = eventoUrl(ev.id)
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Club Deportivo Casino//Agenda//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${ev.id}@clubdeportivocasino`,
    `DTSTAMP:${fmt(new Date().toISOString())}`,
    `DTSTART:${fmt(ev.inicio)}`,
    `DTEND:${fmt(ev.fin)}`,
    `SUMMARY:${esc(ev.titulo)}`,
    `DESCRIPTION:${esc(`${ev.descripcion}\n${url}`)}`,
    `LOCATION:${esc(`${ev.lugar} — ${sitio.nombre}, ${sitio.ciudad}`)}`,
    `URL:${url}`,
    'BEGIN:VALARM',
    'TRIGGER:-PT2H',
    'ACTION:DISPLAY',
    `DESCRIPTION:${esc(ev.titulo)}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `${ev.id}.ics`
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(a.href), 2000)
}
