import { m, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { useReducedMotion } from '../lib/hooks'
import { supportsScrollTimeline } from '../lib/scroll'

const css = supportsScrollTimeline()

/**
 * Aparición ligada al scroll. Usa CSS scroll-driven animations
 * (animation-timeline: view()) y, donde no hay soporte, Motion.
 */
export function Reveal({ children, className = '', variant = 'reveal' }: { children: React.ReactNode; className?: string; variant?: 'reveal' | 'photo' }) {
  const reduced = useReducedMotion()
  if (reduced) return <div className={className}>{children}</div>
  if (css) return <div className={`${variant === 'photo' ? 'sd-photo' : 'sd-reveal'} ${className}`}>{children}</div>
  return (
    <m.div
      className={className}
      initial={variant === 'photo' ? { opacity: 0.2, scale: 0.88, y: 40 } : { opacity: 0, y: 64 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -15% 0px' }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </m.div>
  )
}

/** Capa que aparece (opacity 0→1) a medida que se scrollea: el color vuelve. */
export function ScrollFadeIn({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'center 0.45'] })
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1])
  if (reduced) return <div className={className}>{children}</div>
  if (css) return <div className={`sd-color ${className}`}>{children}</div>
  return (
    <m.div ref={ref} className={className} style={{ opacity }}>
      {children}
    </m.div>
  )
}
