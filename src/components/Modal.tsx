import { AnimatePresence, m } from 'motion/react'
import { X } from 'lucide-react'
import { createPortal } from 'react-dom'
import { useFocusTrap, useLockBody } from '../lib/hooks'

/** Modal accesible con efecto vidrio: foco atrapado, Escape para cerrar. */
export function Modal({
  open,
  onClose,
  title,
  children,
  className = '',
}: {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  className?: string
}) {
  useLockBody(open)
  const ref = useFocusTrap<HTMLDivElement>(open, onClose)
  return createPortal(
    <AnimatePresence>
      {open && (
        <m.div className="fixed inset-0 z-[90] grid place-items-end sm:place-items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button type="button" aria-label="Cerrar" tabIndex={-1} className="absolute inset-0 bg-black/55" onClick={onClose} />
          <m.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            data-lenis-prevent
            className={`glass relative m-0 max-h-[92dvh] w-full overflow-y-auto rounded-t-[2rem] p-6 shadow-2xl sm:m-4 sm:max-w-lg sm:rounded-[2rem] sm:p-8 ${className}`}
            initial={{ y: 40, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <h2 className="font-semicondensed text-2xl leading-tight">{title}</h2>
              <button type="button" onClick={onClose} className="tap grid size-10 shrink-0 place-items-center rounded-full bg-fg/10 hover:bg-fg/20" aria-label="Cerrar" data-autofocus>
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>
            {children}
          </m.div>
        </m.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
