import { lazy, Suspense, useCallback, useMemo, useState } from 'react'
import { claveVisto, useHistorias } from '../lib/historias'
import { imgUrl } from '../lib/img'

const StoryViewer = lazy(() => import('./StoryViewer'))
const KEY = 'casino-historias-vistas'

const leerVistas = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]') as string[]
  } catch {
    return []
  }
}

/**
 * Fila de historias estilo Instagram. El visor se descarga recién al tocar.
 * Una disciplina sin historias activas se ve en gris y no se abre.
 */
export function StoriesRow() {
  const grupos = useHistorias()
  // Solo los grupos con historias entran al visor (al pasar de uno a otro se saltean los vacíos)
  const activos = useMemo(() => grupos.filter((g) => g.historias.length > 0), [grupos])
  const [abierto, setAbierto] = useState<number | null>(null)
  const [vistas, setVistas] = useState<string[]>(leerVistas)

  const marcar = useCallback(
    (id: string) => {
      const g = activos.find((x) => x.id === id)
      if (!g) return
      const clave = claveVisto(g)
      setVistas((v) => {
        if (v.includes(clave)) return v
        // Solo guardamos la última clave de cada grupo
        const n = [...v.filter((k) => !k.startsWith(`${g.id}:`)), clave]
        try {
          localStorage.setItem(KEY, JSON.stringify(n))
        } catch {
          /* noop */
        }
        return n
      })
    },
    [activos],
  )

  return (
    <>
      <div className="mx-auto max-w-7xl md:px-4">
        <ul className="no-scrollbar flex gap-3 overflow-x-auto px-4 py-2 md:gap-5" aria-label="Historias del club">
          {grupos.map((g) => {
            const activo = g.historias.length > 0
            const visto = vistas.includes(claveVisto(g))
            return (
              <li key={g.id} className="shrink-0">
                <button
                  type="button"
                  className={`group flex w-[4.5rem] flex-col items-center gap-1.5 md:w-20 ${activo ? 'tap' : 'cursor-default opacity-55'}`}
                  data-cursor="neutro"
                  disabled={!activo}
                  onClick={() => setAbierto(activos.indexOf(g))}
                  onPointerEnter={activo ? () => import('./StoryViewer') : undefined}
                  aria-label={activo ? `Ver historias de ${g.nombre}${visto ? ' (vistas)' : ''}` : `${g.nombre}: sin historias por ahora`}
                >
                  <span
                    className={`story-ring grid size-[4.25rem] place-items-center rounded-full p-[3px] transition-transform duration-300 md:size-[4.75rem] ${activo ? 'group-hover:scale-105' : ''}`}
                    data-seen={!activo || visto}
                  >
                    <span className="grid size-full place-items-center rounded-full bg-primario-700 p-[2px]">
                      <img src={imgUrl(g.portada.src, 160, 160)} alt="" width={80} height={80} className={`size-full rounded-full object-cover ${activo ? '' : 'grayscale'}`} loading="lazy" decoding="async" />
                    </span>
                  </span>
                  <span className="w-full truncate text-center text-xs font-semibold text-white drop-shadow">{g.nombre}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
      {abierto !== null && activos.length > 0 && (
        <Suspense fallback={<div className="fixed inset-0 z-[95] grid place-items-center bg-black/90"><div className="skeleton h-[80dvh] w-[min(92vw,45dvh)] rounded-3xl opacity-30" /></div>}>
          <StoryViewer grupos={activos} inicio={Math.min(abierto, activos.length - 1)} onClose={() => setAbierto(null)} onVisto={marcar} />
        </Suspense>
      )}
    </>
  )
}
