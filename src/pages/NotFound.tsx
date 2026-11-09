import { Link } from 'react-router-dom'
import { sitio } from '../content'
import { Escudo } from '../components/Escudo'
import { btn } from '../components/ui'
import { useSeo } from '../lib/seo'

export default function NotFound() {
  useSeo({ titulo: `Página no encontrada · ${sitio.nombre}`, descripcion: sitio.seo.descripcion })
  return (
    <section className="grid min-h-[80svh] place-items-center px-4 pt-28 text-center">
      <div>
        <Escudo className="mx-auto h-28 w-auto" title="" />
        <h1 className="mt-6 font-condensed text-giant">Pelota afuera</h1>
        <p className="mt-3 text-lg text-fg-muted">La página que buscás no existe. Volvamos a la cancha.</p>
        <Link to="/" className={`${btn.primario} mt-8`}>
          Ir al inicio
        </Link>
      </div>
    </section>
  )
}
