import { ArrowUpRight } from 'lucide-react'
import { useState } from 'react'
import { AVATAR_EN_VIVO, contacto, novedades, redes, type Red } from '../content'
import { RedIcon, WhatsAppIcon } from '../components/BrandIcons'
import { SectionHeading } from '../components/Kinetic'
import { btn } from '../components/ui'
import { imgUrl } from '../lib/img'
import { waLink } from '../lib/wa'

/**
 * Foto de perfil con respaldo en cadena:
 *   1. en vivo desde unavatar.io (solo si AVATAR_EN_VIVO está activo)
 *   2. copia local en public/redes/ (r.avatar)
 *   3. foto del club (r.foto), como estaba antes
 * Si una falla (onError), pasa a la siguiente.
 */
function Avatar({ red: r }: { red: Red }) {
  const fuentes = [
    AVATAR_EN_VIVO && r.usuarioRed ? `https://unavatar.io/${r.tipo}/${r.usuarioRed}?fallback=false` : null,
    r.avatar ?? null,
  ].filter((s): s is string => !!s)
  const [i, setI] = useState(0)

  if (i < fuentes.length) {
    // Foto de perfil real: círculo como en la red, con el ícono chico en la esquina
    return (
      <span className="relative size-12 shrink-0">
        <img src={fuentes[i]} alt="" width={48} height={48} loading="lazy" onError={() => setI((n) => n + 1)} className="size-full rounded-full border border-line bg-bg-alt object-cover" />
        <span className="absolute -bottom-0.5 -right-0.5 grid size-5 place-items-center rounded-full bg-surface text-fg ring-1 ring-line">
          <RedIcon tipo={r.tipo} size={12} />
        </span>
      </span>
    )
  }
  return (
    <span className="relative size-12 shrink-0 overflow-hidden rounded-xl">
      <img src={r.foto.src.startsWith('http') ? imgUrl(r.foto.src, 96, 96) : r.foto.src} alt="" width={48} height={48} loading="lazy" className="size-full object-cover" />
      <span className="absolute inset-0 grid place-items-center bg-black/35 text-white">
        <RedIcon tipo={r.tipo} size={18} />
      </span>
    </span>
  )
}

/** Redes: una fila compacta con las cuentas del club + el canal de WhatsApp. */
export default function Social() {
  return (
    <section className="py-16 md:py-24" aria-labelledby="redes-titulo">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeading kicker="Redes" titulo="Seguinos" bajada="Cada disciplina tiene su cuenta. Seguí la tuya y no te pierdas nada." id="redes-titulo" size="huge" />

        <ul className="mt-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {redes.map((r) => (
            <li key={r.id}>
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="tap group flex items-center gap-3 rounded-2xl border border-line bg-surface p-2.5 pr-4 transition-colors hover:border-primario"
              >
                <Avatar red={r} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">{r.nombre}</span>
                  <span className="block truncate text-xs text-fg-muted">{r.usuario}</span>
                </span>
                <ArrowUpRight className="size-4 shrink-0 text-fg-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primario" aria-hidden="true" />
              </a>
            </li>
          ))}
          {/* Si las cuentas llenan filas completas, el canal ocupa una fila entera abajo */}
          <li className={redes.length % 4 === 0 ? 'sm:col-span-2 lg:col-span-4' : 'sm:col-span-2 lg:col-span-1'}>
            <a
              href={contacto.canalWhatsapp || waLink('¡Hola! Quiero sumarme al canal de WhatsApp del club.')}
              target="_blank"
              rel="noopener noreferrer"
              className={`${btn.whatsapp} h-full w-full rounded-2xl`}
              title={novedades.canalTexto}
            >
              <WhatsAppIcon size={20} /> {novedades.canalTitulo}
            </a>
          </li>
        </ul>
        {!contacto.canalWhatsapp && (
          <p className="mt-3 text-xs text-fg-muted">
            <span className="ph">[COMPLETAR: link del canal de WhatsApp]</span>
          </p>
        )}
      </div>
    </section>
  )
}
