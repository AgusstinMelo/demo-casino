type P = { className?: string; size?: number }

export function InstagramIcon({ className, size = 20 }: P) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.6" cy="6.4" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function FacebookIcon({ className, size = 20 }: P) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true" fill="currentColor">
      <path d="M13.5 21.5v-7.8h2.6l.4-3.1h-3v-2c0-.9.3-1.5 1.5-1.5h1.6V4.3a21 21 0 0 0-2.3-.1c-2.3 0-3.9 1.4-3.9 4v2.3H7.8v3.1h2.6v7.9Z" />
    </svg>
  )
}

export function WhatsAppIcon({ className, size = 20 }: P) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true" fill="currentColor">
      <path d="M12.04 2.5a9.43 9.43 0 0 0-8.1 14.26L2.5 21.5l4.86-1.4A9.43 9.43 0 1 0 12.04 2.5Zm0 17.2c-1.5 0-2.95-.41-4.22-1.18l-.3-.18-2.88.83.85-2.8-.2-.31a7.77 7.77 0 1 1 6.75 3.64Zm4.26-5.82c-.23-.12-1.38-.68-1.6-.76-.21-.08-.37-.12-.52.12-.16.23-.6.76-.74.91-.13.16-.27.18-.5.06a6.36 6.36 0 0 1-3.15-2.75c-.24-.41.24-.38.68-1.27.08-.15.04-.29-.02-.4-.06-.12-.52-1.26-.72-1.72-.19-.45-.38-.39-.52-.4h-.45a.86.86 0 0 0-.62.3 2.6 2.6 0 0 0-.82 1.94 4.5 4.5 0 0 0 .95 2.4c.12.15 1.64 2.5 3.97 3.51 1.47.64 2.05.69 2.79.58.45-.07 1.38-.56 1.57-1.11.2-.55.2-1.02.14-1.12-.06-.1-.21-.16-.44-.27Z" />
    </svg>
  )
}

export function RedIcon({ tipo, className, size }: P & { tipo: 'instagram' | 'facebook' }) {
  return tipo === 'facebook' ? <FacebookIcon className={className} size={size} /> : <InstagramIcon className={className} size={size} />
}
