import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { createServer, defineConfig, type Plugin } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import { contacto, disciplinas, hero, redes, sitio } from './src/content.ts'

/* -----------------------------------------------------------------------------
 * SEO estático: WhatsApp, Facebook e Instagram no ejecutan JavaScript al armar
 * la vista previa de un link. Por eso generamos en el build un HTML por página
 * con su título, descripción e imagen Open Graph propios.
 * -------------------------------------------------------------------------- */
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
const unsplash = (src: string, w: number) => `${src}?auto=format&fit=crop&w=${w}&h=${Math.round(w * 0.5625)}&q=70`
const real = (s: string) => (s && !s.includes('[COMPLETAR') ? s : undefined)

function seoBlock(p: { titulo: string; descripcion: string; path: string; imagen: string; heroSrc: string; heroAnchos?: number[]; preloadHero?: boolean }) {
  const url = sitio.url + p.path
  const img = sitio.url + p.imagen
  const widths = [640, 960, 1280, 1600, 2000]
  const local = !p.heroSrc.startsWith('http') && !!p.heroAnchos?.length
  const srcset = local
    ? p.heroAnchos!.map((w) => `${p.heroSrc.replace(/\.\w+$/, '')}-${w}.avif ${w}w`).join(', ')
    : widths.map((w) => `${unsplash(p.heroSrc, w)} ${w}w`).join(', ')
  return `<!--seo:start-->
    <title>${esc(p.titulo)}</title>
    <meta name="description" content="${esc(p.descripcion)}" />
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${esc(sitio.nombre)}" />
    <meta property="og:locale" content="es_AR" />
    <meta property="og:title" content="${esc(p.titulo)}" />
    <meta property="og:description" content="${esc(p.descripcion)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${img}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${esc(p.titulo)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(p.titulo)}" />
    <meta name="twitter:description" content="${esc(p.descripcion)}" />
    <meta name="twitter:image" content="${img}" />
    ${p.preloadHero === false ? "" : `<link rel="preload" as="image"${local ? ' type="image/avif"' : ''} imagesrcset="${srcset}" imagesizes="100vw" fetchpriority="high" />`}
    <!--seo:end-->`
}

const clubLd = {
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

function casinoSeo(): Plugin {
  let outDir = 'dist'
  // En la home el <img> del hero ya viene en el HTML prerenderizado: no hace falta preload
  const home = { preloadHero: false, titulo: sitio.seo.titulo, descripcion: sitio.seo.descripcion, path: '/', imagen: sitio.seo.imagen, heroSrc: hero.foto.src }
  return {
    name: 'casino-seo',
    configResolved(c) {
      outDir = resolve(c.root, c.build.outDir)
    },
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        // Precarga de las fuentes críticas (evita saltos de layout al cargar la tipografía)
        const fonts = Object.keys(ctx.bundle ?? {}).filter((f) => /(montserrat-latin-wght-normal)-.*\.woff2$/.test(f))
        const preload = fonts.map((f) => `<link rel="preload" href="/${f}" as="font" type="font/woff2" crossorigin />`).join('\n    ')
        return html
          .replace('<!--SEO-->', seoBlock(home) + (preload ? '\n    ' + preload : ''))
          .replace('<!--JSONLD-->', `<script type="application/ld+json">${JSON.stringify(clubLd)}</script>`)
      },
    },
    generateBundle() {
      const urls = ['/', ...disciplinas.map((d) => `/deportes/${d.slug}`)]
      const hoy = new Date().toISOString().slice(0, 10)
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
          .map((u) => `  <url><loc>${sitio.url}${u}</loc><lastmod>${hoy}</lastmod><priority>${u === '/' ? '1.0' : '0.8'}</priority></url>`)
          .join('\n')}\n</urlset>\n`,
      })
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `User-agent: *\nAllow: /\n\nSitemap: ${sitio.url}/sitemap.xml\n` })
    },
    closeBundle: {
      order: 'pre',
      sequential: true,
      async handler() {
        const indexPath = resolve(outDir, 'index.html')
        let base: string
        try {
          base = readFileSync(indexPath, 'utf8')
        } catch {
          return
        }
        // Páginas por disciplina (sin el prerender del hero de la home)
        for (const d of disciplinas) {
          const html = base.replace(
            /<!--seo:start-->[\s\S]*?<!--seo:end-->/,
            seoBlock({ titulo: d.seo.titulo, descripcion: d.seo.descripcion, path: `/deportes/${d.slug}`, imagen: `/og/${d.slug}.png`, heroSrc: d.foto.src, heroAnchos: d.foto.anchos }),
          )
          const file = resolve(outDir, 'deportes', `${d.slug}.html`)
          mkdirSync(dirname(file), { recursive: true })
          writeFileSync(file, html)
        }
        // Prerender del primer pantallazo de la home: se pinta antes de que cargue JS (mejor LCP)
        const server = await createServer({ configFile: false, logLevel: 'error', server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom', optimizeDeps: { noDiscovery: true, include: [] }, plugins: [react()] })
        try {
          const mod = (await server.ssrLoadModule('/src/prerender.tsx')) as { render: () => string }
          const shell = mod.render()
          writeFileSync(indexPath, base.replace('<div id="root"></div>', `<div id="root"><div data-shell>${shell}</div></div>`))
        } catch (e) {
          console.warn('[casino-seo] No se pudo prerenderizar el hero:', e)
        } finally {
          await server.close()
        }
      },
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    casinoSeo(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false,
      includeAssets: ['escudo.svg', 'icons/apple-touch-icon.png'],
      manifest: {
        id: '/',
        name: sitio.nombre,
        short_name: sitio.nombreCorto,
        description: sitio.seo.descripcion,
        lang: 'es-AR',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#cc0033',
        theme_color: '#cc0033',
        categories: ['sports', 'lifestyle'],
        icons: [
          { src: '/icons/pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/pwa-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
        shortcuts: [
          { name: 'Agenda', url: '/#agenda', icons: [{ src: '/icons/pwa-192.png', sizes: '192x192' }] },
          { name: 'Hacete socio', url: '/#socios', icons: [{ src: '/icons/pwa-192.png', sizes: '192x192' }] },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,woff2}', 'icons/*.png'],
        globIgnores: ['og/**'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/og\//, /\.[a-z0-9]+$/i],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/images\.unsplash\.com\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'fotos',
              expiration: { maxEntries: 150, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  build: {
    target: 'es2022',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/scheduler')) return 'react'
          if (id.includes('node_modules/react-router')) return 'router'
        },
      },
    },
  },
})
