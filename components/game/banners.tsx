import { Siren } from 'lucide-react'
import { COLLAPSE_LEVELS } from '@/lib/game/board'
import type { Player } from '@/lib/game/types'
import { levelColor } from './collapse-meter'
import { PawnToken } from './pawn-token'

export function TurnBanner({ player }: { player: Player }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-[38%] z-40 flex justify-center" aria-hidden>
      <div className="animate-banner flex items-center gap-4 border-y-2 border-gold bg-navy-deep/95 px-10 py-3 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
        <PawnToken kind={player.pawn} color={player.color} className="w-10" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-gold">Próximo turno</p>
          <p className="font-display text-3xl font-bold uppercase tracking-wide text-cream">Vez de {player.name}</p>
        </div>
      </div>
    </div>
  )
}

export function LevelBanner({ level, onDismiss }: { level: number; onDismiss: () => void }) {
  const info = COLLAPSE_LEVELS[level - 1]
  const color = levelColor(level)
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="alert">
      <button type="button" className="absolute inset-0 bg-navy-deep/60" onClick={onDismiss} aria-label="Fechar alerta" />
      <div
        className="animate-rise relative w-full max-w-lg overflow-hidden rounded-lg border-2 bg-navy-deep text-center shadow-[0_30px_80px_rgba(0,0,0,0.8)]"
        style={{ borderColor: color, boxShadow: `0 0 60px ${color}55` }}
      >
        <div className="hazard-stripes h-3" aria-hidden />
        <div className="px-8 py-7">
          <Siren className="emergency-light mx-auto size-10" style={{ color }} aria-hidden />
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.5em] text-cream/70">Nível de Colapso {level}</p>
          <p className="mt-1 font-display text-5xl font-bold uppercase tracking-wide" style={{ color }}>
            {info.name}
          </p>
          <p className="mt-3 text-pretty text-base text-cream/80">{info.text}</p>
        </div>
        <div className="hazard-stripes h-3" aria-hidden />
      </div>
    </div>
  )
}
