import { Download, Printer } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Modal } from './Modal'
import { btn } from './ui'

/** QR del evento para proyectar o imprimir en carteles. La librería se carga recién al abrir. */
export function QrModal({ open, onClose, url, titulo }: { open: boolean; onClose: () => void; url: string; titulo: string }) {
  const [data, setData] = useState<string>('')
  useEffect(() => {
    if (!open) return
    let alive = true
    import('qrcode').then((QR) =>
      QR.toDataURL(url, { width: 640, margin: 2, errorCorrectionLevel: 'M', color: { dark: '#cc0033', light: '#ffffff' } }).then((d) => alive && setData(d)),
    )
    return () => {
      alive = false
    }
  }, [open, url])

  const imprimir = () => {
    const w = window.open('', '_blank', 'width=600,height=800')
    if (!w) return
    w.document.write(
      `<!doctype html><html lang="es-AR"><head><meta charset="utf-8"><title>${titulo}</title><style>body{font-family:system-ui,sans-serif;text-align:center;padding:40px}img{width:70%;max-width:420px}h1{font-size:28px}</style></head><body><h1>${titulo}</h1><img src="${data}" alt="Código QR"><p>Escaneá para ver el evento</p><p>${url}</p><script>onload=()=>print()</script></body></html>`,
    )
    w.document.close()
  }

  return (
    <Modal open={open} onClose={onClose} title="Código QR del evento">
      <p className="mb-4 text-sm text-fg-muted">{titulo}</p>
      <div className="mx-auto grid aspect-square w-full max-w-xs place-items-center rounded-3xl bg-white p-3">
        {data ? <img src={data} alt={`Código QR que lleva a ${url}`} width={320} height={320} className="h-full w-full" /> : <div className="skeleton h-full w-full rounded-2xl" />}
      </div>
      <p className="mt-3 break-all text-center text-xs text-fg-muted">{url}</p>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <a href={data || undefined} download="qr-evento-casino.png" className={`${btn.oscuro} ${btn.chico}`} aria-disabled={!data}>
          <Download className="size-4" aria-hidden="true" /> Descargar
        </a>
        <button type="button" onClick={imprimir} disabled={!data} className={`${btn.contorno} ${btn.chico}`}>
          <Printer className="size-4" aria-hidden="true" /> Imprimir
        </button>
      </div>
    </Modal>
  )
}
