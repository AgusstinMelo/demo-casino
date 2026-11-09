import { LazyMotion } from 'motion/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { registerSW } from 'virtual:pwa-register'
import { Layout } from './App'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import './styles/index.css'

// Las features de animación de Motion se descargan aparte (bundle inicial más liviano)
const loadFeatures = () => import('./lib/motion-features').then((r) => r.default)

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'deportes/:slug', lazy: async () => ({ Component: (await import('./pages/SportPage')).default }) },
      { path: '*', element: <NotFound /> },
    ],
  },
])

const mount = () =>
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <LazyMotion features={loadFeatures} strict>
        <RouterProvider router={router} />
      </LazyMotion>
    </StrictMode>,
  )

// Si el HTML trae el hero prerenderizado, dejamos que se pinte primero (mejor LCP)
if (document.querySelector('[data-shell]')) requestAnimationFrame(() => setTimeout(mount, 0))
else mount()

if ('serviceWorker' in navigator && import.meta.env.PROD) registerSW({ immediate: true })
