/**
 * El build prerenderiza el header y el hero dentro de #root (ver
 * src/prerender.tsx y vite.config.ts) para que se pinten sin esperar a
 * JavaScript. Al montar, React los reemplaza por el mismo marcado: en ese caso
 * no repetimos las animaciones de entrada.
 */
export const isServer = typeof document === 'undefined'
export const hadShell = !isServer && !!document.querySelector('[data-shell]')
