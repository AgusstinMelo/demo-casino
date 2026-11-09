import { useState } from 'react'
import type { Foto } from '../content'
import { imgUrl, srcSet, tinyUrl } from '../lib/img'

type Props = {
  foto: Foto
  /** ancho / alto (ej. 4/5). Define el recorte y evita saltos de layout (CLS). */
  ratio?: number
  sizes?: string
  widths?: number[]
  priority?: boolean
  className?: string
  imgClassName?: string
  /** Tratamiento: duotono suave (por defecto), blanco y negro, sepia o sin tratamiento */
  tratamiento?: 'club' | 'bn' | 'sepia' | 'none'
  grano?: boolean
  /** Ocupa todo el contenedor (absolute inset-0) */
  fill?: boolean
  style?: React.CSSProperties
  cursor?: boolean
}

/**
 * Imagen responsive con srcset, formatos modernos (AVIF/WebP vía Unsplash),
 * dimensiones fijas y blur-up (miniatura borrosa mientras carga).
 */
export function SmartImage({
  foto,
  ratio = 4 / 5,
  sizes = '(min-width: 1024px) 40vw, 90vw',
  widths = [360, 540, 720, 960, 1280],
  priority = false,
  className = '',
  imgClassName = '',
  tratamiento = 'club',
  grano = false,
  fill = false,
  style,
  cursor = true,
}: Props) {
  const [loaded, setLoaded] = useState(false)
  const h = 1 / ratio
  const base = widths[Math.min(2, widths.length - 1)]
  const local = !!foto.anchos?.length && !foto.src.startsWith('http')
  const localBase = foto.src.replace(/\.\w+$/, '')
  const localSet = (ext: string) => foto.anchos!.map((w) => `${localBase}-${w}.${ext} ${w}w`).join(', ')
  const img = (
    <img
      src={local ? foto.src : imgUrl(foto.src, base, Math.round(base * h))}
      srcSet={local ? undefined : srcSet(foto.src, widths, h)}
      sizes={local ? undefined : sizes}
      alt={foto.alt}
      width={base}
      height={Math.round(base * h)}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding={priority ? 'sync' : 'async'}
      onLoad={() => setLoaded(true)}
      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${imgClassName}`}
      style={{ opacity: priority || loaded || local ? 1 : 0, objectPosition: foto.posicion }}
    />
  )
  // Las fotos propias del club se muestran con sus colores reales (sepia y b/n se respetan)
  const efectivo = local && tratamiento === 'club' ? 'none' : tratamiento
  const trat = efectivo === 'club' ? 'foto-club' : efectivo === 'bn' ? 'foto-club foto-bn' : efectivo === 'sepia' ? 'foto-club foto-sepia' : `overflow-hidden ${fill ? '' : 'relative'}`
  return (
    <div
      className={`${trat} ${grano ? 'grano' : ''} ${fill ? 'absolute inset-0' : ''} ${className}`}
      style={{ ...(fill ? {} : { aspectRatio: String(ratio) }), ...style }}
      data-cursor={cursor ? 'foto' : undefined}
    >
      {!priority && !local && (
        <img
          src={tinyUrl(foto.src, h)}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full scale-110 object-cover blur-xl transition-opacity duration-700"
          style={{ opacity: loaded ? 0 : 1 }}
          decoding="async"
        />
      )}
      {local ? (
        // Foto propia del club: <picture> con AVIF y WebP en varios anchos (ver scripts/optimizar-fotos.mjs)
        <picture>
          <source type="image/avif" srcSet={localSet('avif')} sizes={sizes} />
          <source type="image/webp" srcSet={localSet('webp')} sizes={sizes} />
          {img}
        </picture>
      ) : (
        img
      )}
    </div>
  )
}
