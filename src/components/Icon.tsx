import {
  Baby,
  CookingPot,
  Drama,
  Eye,
  GraduationCap,
  HandHeart,
  Handshake,
  HeartHandshake,
  House,
  Music,
  Package,
  Palette,
  PartyPopper,
  Sparkles,
  Sprout,
  Store,
  Ticket,
  Trophy,
  Sun,
  Users,
  Waves,
  Vote,
  type LucideIcon,
} from 'lucide-react'

/** Íconos referenciados por nombre desde content.ts */
const MAP: Record<string, LucideIcon> = {
  Baby,
  CookingPot,
  Drama,
  Eye,
  GraduationCap,
  HandHeart,
  Handshake,
  HeartHandshake,
  House,
  Music,
  Package,
  Palette,
  PartyPopper,
  Sparkles,
  Sprout,
  Store,
  Ticket,
  Trophy,
  Sun,
  Users,
  Waves,
  Vote,
}

export function Icon({ name, className, size = 24 }: { name: string; className?: string; size?: number }) {
  const C = MAP[name] ?? Sparkles
  return <C className={className} size={size} aria-hidden="true" strokeWidth={1.75} />
}
