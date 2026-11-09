/** Clases compartidas de botones y chips (Tailwind). */
const base =
  'tap inline-flex whitespace-nowrap items-center justify-center gap-2 rounded-full font-semibold transition-[background-color,color,box-shadow,transform] duration-300 select-none disabled:opacity-50 disabled:pointer-events-none'

export const btn = {
  /* `cursor-swap`: el cursor personalizado muestra estos botones con fondo y texto intercambiados */
  primario: `${base} cursor-swap bg-secundario text-white px-6 py-3.5 shadow-[0_10px_30px_-10px_var(--color-secundario)] hover:bg-secundario-700`,
  acento: `${base} bg-acento text-[#141010] px-6 py-3.5 hover:brightness-105`,
  oscuro: `${base} cursor-swap bg-primario text-white px-6 py-3.5 hover:bg-primario-700`,
  claro: `${base} cursor-swap bg-white text-primario px-6 py-3.5 hover:bg-acento-200`,
  contorno: `${base} border border-current px-6 py-3.5 hover:bg-fg hover:text-bg`,
  contornoClaro: `${base} border border-white/60 text-white px-6 py-3.5 hover:bg-white hover:text-primario`,
  chico: `${base} px-4 py-2 text-sm`,
  icono: `${base} size-11 shrink-0`,
  whatsapp: `${base} bg-[#0f7a3f] text-white px-5 py-3 hover:bg-[#0b6333]`,
  /** Botón lleno de la tarjeta de la cita (Centro Cultural): invierte colores en modo oscuro */
  cita: `${base} cursor-swap bg-[var(--cita-fg)] text-[var(--cita-btn)] px-6 py-3.5 hover:opacity-90`,
}

export const chip = (activo: boolean) =>
  `tap rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-300 ${
    activo ? 'border-primario bg-primario text-white dark:border-acento dark:bg-acento dark:text-[#141010]' : 'border-line bg-surface text-fg hover:border-fg'
  }`
