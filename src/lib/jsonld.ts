import { agenda, contacto, disciplinas, redes, sitio } from '../content'

const real = (s: string) => (s && !s.includes('[COMPLETAR') ? s : undefined)

/** JSON-LD SportsClub (los datos sin completar se omiten). */
export function sportsClubLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SportsClub',
    name: sitio.nombre,
    alternateName: [sitio.nombreHistorico, 'Club Casino'],
    foundingDate: sitio.fundacion,
    url: sitio.url,
    logo: `${sitio.url}/icons/pwa-512.png`,
    image: `${sitio.url}${sitio.seo.imagen}`,
    description: sitio.seo.descripcion,
    sport: disciplinas.map((d) => d.nombre),
    address: {
      '@type': 'PostalAddress',
      streetAddress: real(contacto.direccion.split(',')[0]),
      addressLocality: sitio.ciudad,
      addressRegion: sitio.provincia,
      addressCountry: 'AR',
    },
    telephone: real(contacto.telefono),
    email: real(contacto.email),
    sameAs: redes.map((r) => r.url),
  }
}

/** JSON-LD Event para cada evento de la agenda. */
export function eventosLd() {
  return agenda.eventos.map((ev) => ({
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: ev.titulo.replace('[EJEMPLO] ', ''),
    startDate: ev.inicio,
    endDate: ev.fin,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    description: ev.descripcion,
    url: `${sitio.url}/?evento=${ev.id}#agenda`,
    image: `${sitio.url}${sitio.seo.imagen}`,
    location: {
      '@type': 'Place',
      name: `${ev.lugar} — ${sitio.nombre}`,
      address: { '@type': 'PostalAddress', addressLocality: sitio.ciudad, addressRegion: sitio.provincia, addressCountry: 'AR' },
    },
    organizer: { '@type': 'SportsClub', name: sitio.nombre, url: sitio.url },
  }))
}
