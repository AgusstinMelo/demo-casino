import { useLocation, useNavigate } from 'react-router-dom'
import { scrollToId } from '../lib/scroll'

/**
 * Link a una sección de la home (#id). Si ya estamos en la home hace scroll
 * suave; si no, navega a la home y después scrollea.
 */
export function AnchorLink({
  to,
  children,
  className,
  onNavigate,
  ...rest
}: { to: string; children: React.ReactNode; className?: string; onNavigate?: () => void } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>) {
  const location = useLocation()
  const navigate = useNavigate()
  return (
    <a
      href={`/#${to}`}
      className={className}
      {...rest}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey) return
        e.preventDefault()
        onNavigate?.()
        if (location.pathname === '/') {
          history.replaceState(null, '', `#${to}`)
          scrollToId(to)
        } else {
          navigate(`/#${to}`)
        }
      }}
    >
      {children}
    </a>
  )
}
