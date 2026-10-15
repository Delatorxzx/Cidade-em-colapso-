import { cn } from '@/lib/utils'
import type { PawnKind } from '@/lib/game/types'
import { PAWN_ICONS } from './icons'

interface PawnTokenProps {
  kind: PawnKind
  color: string
  className?: string
  active?: boolean
}

export function PawnToken({ kind, color, className, active }: PawnTokenProps) {
  const Icon = PAWN_ICONS[kind]
  return (
    <span className={cn('relative inline-flex aspect-square items-center justify-center', className)}>
      <span
        aria-hidden
        className="absolute inset-x-[8%] bottom-[-10%] h-[30%] rounded-[50%] bg-black/50 blur-[2px]"
      />
      <span
        className={cn(
          'relative flex size-full items-center justify-center rounded-full border-2 border-navy/80',
          active && 'ring-2 ring-cream ring-offset-1 ring-offset-navy',
        )}
        style={{
          background: `radial-gradient(circle at 32% 28%, rgba(255,255,255,0.75), ${color} 38%, color-mix(in srgb, ${color} 55%, #101C2C) 100%)`,
          boxShadow: `inset 0 -3px 0 rgba(0,0,0,0.3), 0 3px 0 color-mix(in srgb, ${color} 40%, #0a121d)`,
        }}
      >
        <Icon className="size-[55%] text-navy" strokeWidth={2.4} aria-hidden />
      </span>
    </span>
  )
}
