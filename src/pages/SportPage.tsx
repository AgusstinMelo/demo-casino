import { m } from 'motion/react'
import { ArrowLeft, CalendarClock, Play, UserRound, Users } from 'lucide-react'
import { lazy, Suspense, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { disciplinas, mensajesWhatsapp, sitio } from '../content'
import { useHistorias } from '../lib/historias'
import { InstagramIcon, WhatsAppIcon } from '../components/BrandIcons'
import { KineticTitle } from '../components/Kinetic'
import { Magnetic } from '../components/Magnetic'
import { Reveal } from '../components/Reveal'
import { ShareButton } from '../components/ShareButton'
import { SmartImage } from '../components/SmartImage'
import { Txt } from '../components/Txt'
import { btn } from '../components/ui'
import { useReducedMotion } from '../lib/hooks'
import { imgUrl } from '../lib/img'
import { useSeo } from '../lib/seo'
import { waLink } from '../lib/wa'
import NotFound from './NotFound'

const StoryViewer = lazy(() => import('../sections/StoryViewer'))

export default function SportPage() {
  const { slug } = useParams()
  const d = disciplinas.find((x) => x.slug === slug)
  const reduced = useReducedMotion()
  const [storyOpen, setStoryOpen] = useState(false)
  const grupos = useHistorias()
  useSeo({
    titulo: d?.seo.titulo ?? `Página no encontrada · ${sitio.nombre}`,
    descripcion: d?.seo.descripcion ?? sitio.seo.descripcion,
    imagen: d ? `/og/${d.slug}.png` : undefined,
    path: d ? `/deportes/${d.slug}` : '/',
  })
  if (!d) return <NotFound />

  // Solo si la disciplina tiene historias activas
  const grupo = grupos.find((g) => g.id === d.slug && g.historias.length > 0)
  const otras = disciplinas.filter((x) => x.slug !== d.slug)
  const shareData = { title: d.seo.titulo, text: `${d.nombre} en el ${sitio.nombre}: ${d.bajada}`, url: `${sitio.url}/deportes/${d.slug}` }

  return (
    <article>
      {/* Hero: la foto de la tarjeta se expande hasta acá (View Transition) */}
      <header className="relative flex min-h-[88svh] items-end overflow-hidden bg-primario-700 text-white">
        <div className="absolute inset-0">
          <SmartImage foto={d.foto} fill priority sizes="100vw" widths={[640, 960, 1280, 1600, 2000]} ratio={16 / 9} grano cursor={false} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0a0a] via-[#0e0a0a]/50 to-[#0e0a0a]/25" aria-hidden="true" />
        <div className="relative mx-auto w-full max-w-7xl px-4 pb-12 pt-32 md:px-8 md:pb-16">
          <Link to="/" viewTransition={!reduced} className="tap mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur hover:bg-white/25">
            <ArrowLeft className="size-4" aria-hidden="true" /> Volver al inicio
          </Link>
          <KineticTitle as="h1" text={d.nombre} onMount delay={0.15} className="font-condensed text-mega" />
          <m.p initial={reduced ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-4 max-w-2xl text-xl text-white/90 md:text-2xl">
            {d.bajada}
          </m.p>
          <m.div initial={reduced ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }} className="mt-8 flex flex-wrap gap-3">
            <Magnetic>
              <a href={waLink(mensajesWhatsapp.probar(d.nombre))} target="_blank" rel="noopener noreferrer" className={btn.primario}>
                <WhatsAppIcon size={20} /> Quiero probar
              </a>
            </Magnetic>
            <ShareButton data={shareData} className={`${btn.contornoClaro} backdrop-blur-sm`} />
            {grupo && (
              <button type="button" onClick={() => setStoryOpen(true)} className={`${btn.contornoClaro} backdrop-blur-sm`}>
                <Play className="size-4" aria-hidden="true" /> Ver historias
              </button>
            )}
          </m.div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
          <div>
            <p className="kicker mb-4 text-brand-accent-ink">La disciplina</p>
            {d.destacados && (
              <ul className="mb-8 flex flex-wrap gap-2" aria-label="Datos destacados">
                {d.destacados.map((x) => (
                  <li key={x} className="rounded-full bg-primario px-4 py-2 text-sm font-semibold text-white">
                    {x}
                  </li>
                ))}
              </ul>
            )}
            {d.descripcion.map((p, i) => (
              <Reveal key={i}>
                <p className={`${i === 0 ? 'font-semicondensed text-3xl leading-tight md:text-4xl' : 'mt-6 text-lg leading-relaxed text-fg-muted'}`}>
                  <Txt>{p}</Txt>
                </p>
              </Reveal>
            ))}

            <h2 className="mt-16 flex items-center gap-3 font-condensed text-4xl md:text-4xl">
              <Users className="size-8 text-brand-accent-ink" aria-hidden="true" /> Categorías
            </h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {d.categorias.map((c) => (
                <li key={c.nombre} className="@container rounded-3xl border border-line bg-surface p-5">
                  <p className="font-semicondensed text-2xl"><Txt>{c.nombre}</Txt></p>
                  <p className="mt-1 text-fg-muted">
                    <Txt>{c.edades}</Txt>
                  </p>
                </li>
              ))}
            </ul>

            <h2 className="mt-16 flex items-center gap-3 font-condensed text-4xl md:text-4xl">
              <CalendarClock className="size-8 text-brand-accent-ink" aria-hidden="true" /> Horarios
            </h2>
            <div className="mt-6 overflow-x-auto rounded-3xl border border-line">
              <table className="w-full min-w-[480px] text-left">
                <caption className="sr-only">Horarios de {d.nombre}</caption>
                <thead className="bg-bg-alt text-sm uppercase tracking-wider text-fg-muted">
                  <tr>
                    <th scope="col" className="px-5 py-3">Categoría</th>
                    <th scope="col" className="px-5 py-3">Días</th>
                    <th scope="col" className="px-5 py-3">Horario</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line bg-surface">
                  {d.horarios.map((h) => (
                    <tr key={h.categoria}>
                      <th scope="row" className="px-5 py-4 font-semibold"><Txt>{h.categoria}</Txt></th>
                      <td className="px-5 py-4"><Txt>{h.dias}</Txt></td>
                      <td className="px-5 py-4"><Txt>{h.hora}</Txt></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[2rem] bg-primario p-7 text-white">
              <h2 className="font-condensed text-3xl">Profes</h2>
              <ul className="mt-5 space-y-4">
                {d.profesores.map((p, i) => (
                  <li key={i} className="flex items-center gap-4">
                    <span className="grid size-14 shrink-0 place-items-center rounded-full bg-white/15">
                      <UserRound className="size-6" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block font-semibold"><Txt>{p.nombre}</Txt></span>
                      <span className="text-sm text-white/75">{p.rol}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <a href={d.instagram} target="_blank" rel="noopener noreferrer" className="tap group flex items-center gap-4 rounded-[2rem] border border-line bg-surface p-6 transition-colors hover:border-fg">
              <span className="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white">
                <InstagramIcon size={28} />
              </span>
              <span>
                <span className="block text-sm text-fg-muted">Seguí a {d.nombre} en Instagram</span>
                <span className="font-semicondensed text-xl group-hover:underline">{d.usuarioInstagram}</span>
              </span>
            </a>
            <div className="rounded-[2rem] bg-acento p-7 text-[#141010]">
              <p className="font-condensed text-3xl">¿Arrancamos?</p>
              <p className="mt-2 font-medium">Vení a una clase de prueba sin compromiso.</p>
              <a href={waLink(mensajesWhatsapp.probar(d.nombre))} target="_blank" rel="noopener noreferrer" className={`${btn.oscuro} mt-5 w-full`}>
                <WhatsAppIcon size={20} /> Escribinos
              </a>
            </div>
          </aside>
        </div>

        {/* Galería */}
        <h2 className="mt-24 font-condensed text-giant">Galería</h2>
        <p className="mt-2 text-fg-muted">
          <span className="tag-ejemplo">Ejemplo</span> Fotos de muestra: reemplazar por fotos reales de {d.nombre}, con autorización.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {d.galeria.map((f, i) => (
            <Reveal key={f.src} variant="photo" className={i === 0 ? 'col-span-2 row-span-2' : ''}>
              <SmartImage foto={f} ratio={i === 0 ? 1 : 4 / 5} className="h-full rounded-[1.5rem]" sizes={i === 0 ? '(min-width: 768px) 50vw, 100vw' : '(min-width: 768px) 25vw, 50vw'} />
            </Reveal>
          ))}
        </div>

        {/* Otras disciplinas */}
        <nav aria-label="Otras disciplinas" className="mt-24">
          <h2 className="kicker mb-6 text-fg-muted">Otras disciplinas</h2>
          <ul className="grid gap-3 sm:grid-cols-3">
            {otras.map((o) => (
              <li key={o.slug}>
                <Link to={`/deportes/${o.slug}`} viewTransition={!reduced} className="tap group flex items-center gap-4 rounded-3xl border border-line bg-surface p-3 pr-5 transition-colors hover:border-fg">
                  <img src={imgUrl(o.foto.src, 160, 160)} alt="" width={64} height={64} loading="lazy" className="size-16 rounded-2xl object-cover" />
                  <span className="font-condensed text-3xl">{o.nombre}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {storyOpen && grupo && (
        <Suspense fallback={null}>
          <StoryViewer grupos={[grupo]} inicio={0} onClose={() => setStoryOpen(false)} onVisto={() => {}} />
        </Suspense>
      )}
    </article>
  )
}
