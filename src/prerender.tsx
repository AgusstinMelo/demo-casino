/**
 * Prerender del primer pantallazo (header + hero) para el HTML estático.
 * Lo usa el plugin de vite.config.ts al terminar el build.
 */
import { domMax, LazyMotion } from 'motion/react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { Header } from './components/Header'
import { Hero } from './sections/Hero'

export function render(): string {
  return renderToStaticMarkup(
    <MemoryRouter>
      <LazyMotion features={domMax}>
        <Header />
        <main id="contenido">
          <Hero />
        </main>
      </LazyMotion>
    </MemoryRouter>,
  )
}
