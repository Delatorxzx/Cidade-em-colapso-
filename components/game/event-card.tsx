import { Megaphone, Siren } from 'lucide-react'
import type { GameCard } from '@/lib/game/types'
import { cn } from '@/lib/utils'

export function EventCard({ card, onApply }: { card: GameCard; onApply: () => void }) {
  const isCrisis = card.deck === 'crise'
  const Icon = isCrisis ? Siren : Megaphone
  const collapse = card.effect.collapse ?? 0

  return (
    <div className="animate-card-flip w-[min(84vw,300px)]">
      <div
        className={cn(
          'relative aspect-[5/7] rounded-xl border-[3px] p-3 shadow-[0_30px_70px_rgba(0,0,0,0.7)]',
          isCrisis ? 'border-warning bg-navy text-cream' : 'paper border-gold-dark text-navy',
        )}
      >
        <div
          className={cn(
            'flex h-full flex-col items-center rounded-lg border px-5 py-6 text-center',
            isCrisis ? 'border-warning/40' : 'border-navy/25',
          )}
        >
          <span
            className={cn(
              'font-display text-xs font-semibold uppercase tracking-[0.4em]',
              isCrisis ? 'text-warning' : 'text-gold-dark',
            )}
          >
            Carta de {isCrisis ? 'Crise' : 'Evento'}
          </span>
          <span
            className={cn(
              'mt-5 flex size-20 items-center justify-center rounded-full border-2',
              isCrisis ? 'border-warning/60 bg-danger/15 text-warning' : 'border-navy/20 bg-gold/20 text-navy',
            )}
          >
            <Icon className="size-10" strokeWidth={1.6} aria-hidden />
          </span>
          <h3 className="mt-5 text-balance font-display text-2xl font-bold uppercase leading-tight tracking-wide">
            {card.title}
          </h3>
          <p className={cn('mt-3 text-pretty text-base leading-snug', isCrisis ? 'text-cream/85' : 'text-navy/80')}>
            {card.text}
          </p>
          {collapse !== 0 && (
            <span
              className={cn(
                'mt-auto rounded-full px-3 py-1 font-display text-xs font-semibold uppercase tracking-wider',
                collapse > 0 ? 'bg-danger text-cream' : 'bg-petrol text-cream',
              )}
            >
              Colapso {collapse > 0 ? `+${collapse}` : collapse}
            </span>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={onApply}
        autoFocus
        className="mt-4 w-full rounded-md bg-gold py-3 font-display text-base font-bold uppercase tracking-wider text-navy shadow-[0_4px_0_#a9822f] transition hover:brightness-110 active:translate-y-[2px]"
      >
        Continuar
      </button>
    </div>
  )
}
