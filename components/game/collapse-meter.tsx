import { COLLAPSE_LEVELS } from '@/lib/game/board'
import { cn } from '@/lib/utils'

export function levelColor(level: number) {
  if (level >= 4) return '#C94A45'
  if (level === 3) return '#E08A3E'
  return '#D4A84F'
}

export function CollapseMeter({ level, points }: { level: number; points: number }) {
  const info = COLLAPSE_LEVELS[level - 1]
  const progress = level >= 5 ? 1 : (points % 20) / 20
  return (
    <div className="w-full" aria-label={`Nível de Colapso ${level} de 5: ${info.name}`} role="group">
      <div className="mb-[2%] flex items-baseline justify-between gap-2">
        <span className="fs-center-sub font-display font-semibold uppercase tracking-[0.2em] text-cream/80">
          Nível de Colapso
        </span>
        <span
          className={cn('fs-center-sub font-display font-bold uppercase tracking-wider', level >= 4 && 'animate-flicker')}
          style={{ color: levelColor(level) }}
        >
          {level} · {info.name}
        </span>
      </div>
      <div className="flex gap-[1.5%]">
        {COLLAPSE_LEVELS.map((l) => {
          const filled = l.level < level ? 1 : l.level === level ? Math.max(progress, 0.08) : 0
          return (
            <div
              key={l.level}
              className="relative h-[calc(var(--cell)*0.14)] flex-1 overflow-hidden rounded-[2px] border border-cream/25 bg-navy-deep/80"
            >
              <div
                className="absolute inset-y-0 left-0 transition-[width] duration-700"
                style={{ width: `${filled * 100}%`, backgroundColor: levelColor(l.level) }}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
