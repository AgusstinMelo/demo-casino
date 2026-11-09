import { lazy, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { marquee, sitio } from '../content'
import { LazySection } from '../components/LazySection'
import { Marquee } from '../components/Marquee'
import { eventosLd } from '../lib/jsonld'
import { scrollToId } from '../lib/scroll'
import { useSeo } from '../lib/seo'
import { Hero } from '../sections/Hero'

const History = lazy(() => import('../sections/History').then((m) => ({ default: m.History })))
const Values = lazy(() => import('../sections/Values').then((m) => ({ default: m.Values })))
const Predio = lazy(() => import('../sections/Predio').then((m) => ({ default: m.Predio })))
// Secciones de más abajo: se descargan cuando se acercan a la pantalla
const Cultural = lazy(() => import('../sections/Cultural'))
const Membership = lazy(() => import('../sections/Membership'))
const Agenda = lazy(() => import('../sections/Agenda'))
const Faq = lazy(() => import('../sections/Faq'))
const Social = lazy(() => import('../sections/Social'))
const Sponsors = lazy(() => import('../sections/Sponsors'))
const Contact = lazy(() => import('../sections/Contact'))

export default function Home() {
  const { hash } = useLocation()
  useSeo({ titulo: sitio.seo.titulo, descripcion: sitio.seo.descripcion, path: '/' })

  useEffect(() => {
    if (!hash) return
    const id = decodeURIComponent(hash.slice(1))
    const t = window.setTimeout(() => scrollToId(id, { immediate: true }), 60)
    return () => window.clearTimeout(t)
  }, [hash])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventosLd()) }} />
      <Hero />
      <Marquee items={marquee} />
      <LazySection id="historia" label="Nuestra historia" minHeight={3600}>
        <History />
      </LazySection>
      <LazySection id="valores" label="Más que un club" minHeight={700}>
        <Values />
      </LazySection>
      <LazySection id="predio" label="El predio y la pileta" minHeight={2900}>
        <Predio />
      </LazySection>
      <LazySection id="cultura" label="Centro Cultural" minHeight={1600}>
        <Cultural />
      </LazySection>
      <LazySection id="socios" label="Hacete socio" minHeight={1800}>
        <Membership />
      </LazySection>
      <LazySection id="agenda" label="Agenda" minHeight={1100}>
        <Agenda />
      </LazySection>
      <LazySection id="redes" label="Redes" minHeight={500}>
        <Social />
      </LazySection>
      <LazySection id="sponsors" label="Sponsors" minHeight={500}>
        <Sponsors />
      </LazySection>
      <LazySection id="contacto" label="Contacto" minHeight={1000}>
        <Contact />
      </LazySection>
      <LazySection id="preguntas" label="Preguntas frecuentes" minHeight={800}>
        <Faq />
      </LazySection>
    </>
  )
}
