import { BookOpen, Coins, Lightbulb, Lock, Menu, Settings } from 'lucide-react'
import { GROUPS, SPACES, formatMoney } from '@/lib/game/board'
import { netWorth } from '@/lib/game/engine'
import type { GameState } from '@/lib/game/types'
import { cn } from '@/lib/utils'
import type { InfoTab } from './info-modal'
import { PawnToken } from './pawn-token'

interface PlayerPanelProps {
  state: GameState
  onSelectSpace: (id: number) => void
  onOpenInfo: (tab: InfoTab) => void
  onMenu: () => void
}

function chipColor(id: number) {
  const space = SPACES[id]
  if (space.group) return GROUPS[space.group].color
  return space.kind === 'transit' ? '#101C2C' : '#526273'
}

export function PlayerPanel({ state, onSelectSpace, onOpenInfo, onMenu }: PlayerPanelProps) {
  const toolbar = [
    { label: 'Menu', icon: Menu, onClick: onMenu },
    { label: 'Regras', icon: BookOpen, onClick: () => onOpenInfo('regras') },
    { label: 'Dicas', icon: Lightbulb, onClick: () => onOpenInfo('ajuda') },
    { label: 'Ajustes', icon: Settings, onClick: () => onOpenInfo('config') },
  ]

  return (
    <aside className="flex w-full flex-col gap-3 lg:h-[calc(100dvh-28px)] lg:w-[320px]" aria-label="Jogadores">
      <nav className="grid grid-cols-4 gap-1.5" aria-label="Menu da partida">
        {toolbar.map(({ label, icon: Icon, onClick }) => (
          <button
            key={label}
            type="button"
            onClick={onClick}
            className="flex flex-col items-center gap-1 rounded-md border border-gold/20 bg-petrol/30 py-2 text-[11px] font-semibold uppercase tracking-wider text-cream/80 transition hover:border-gold/50 hover:text-cream"
          >
            <Icon className="size-4 text-gold" aria-hidden />
            {label}
          </button>
        ))}
      </nav>

      <ul className="flex flex-col gap-2">
        {state.players.map((p) => {
          const isCurrent = p.id === state.current && !p.bankrupt
          const owned = state.props.map((pr, id) => ({ pr, id })).filter(({ pr }) => pr.owner === p.id)
          return (
            <li
              key={p.id}
              className={cn(
                'relative rounded-lg border p-3 transition-all duration-500',
                isCurrent
                  ? 'border-gold/70 bg-petrol/60 shadow-[0_0_0_1px_rgba(212,168,79,0.3),0_10px_24px_rgba(0,0,0,0.4)]'
                  : 'border-cream/10 bg-navy/60',
                p.bankrupt && 'opacity-40 grayscale',
              )}
            >
              <div className="flex items-center gap-3">
                <PawnToken kind={p.pawn} color={p.color} className="w-9 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 truncate font-display text-base font-semibold uppercase tracking-wide text-cream">
                    {p.name}
                    {p.inJail && <Lock className="size-3.5 text-warning" aria-label="Na Zona Interditada" />}
                  </p>
                  <p className="text-[11px] uppercase tracking-wider text-cream/50">
                    {p.bankrupt ? 'Falido' : `Patrimônio ${formatMoney(netWorth(state, p.id))}`}
                  </p>
                </div>
                <p className="flex items-center gap-1 font-display text-lg font-bold tabular-nums text-gold">
                  <Coins className="size-4" aria-hidden />
                  {formatMoney(p.money)}
                </p>
              </div>
              {owned.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-1">
                  {owned.map(({ pr, id }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => onSelectSpace(id)}
                      title={SPACES[id].name}
                      aria-label={`Ver ${SPACES[id].name}`}
                      className={cn(
                        'relative h-5 w-4 rounded-[2px] border border-cream/40 transition hover:-translate-y-0.5',
                        pr.damaged && 'outline outline-1 outline-danger',
                      )}
                      style={{ backgroundColor: chipColor(id) }}
                    >
                      {pr.buildings > 0 && (
                        <span className="absolute -right-1 -top-1 flex size-3 items-center justify-center rounded-full bg-cream text-[8px] font-bold text-navy">
                          {pr.buildings === 4 ? 'T' : pr.buildings}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </li>
          )
        })}
      </ul>

      <section className="min-h-0 flex-1 overflow-hidden rounded-lg border border-cream/10 bg-navy/40 p-3" aria-label="Diário da cidade">
        <h2 className="mb-2 font-display text-xs font-semibold uppercase tracking-[0.3em] text-cream/50">Diário da cidade</h2>
        <ol className="space-y-1.5 overflow-y-auto text-sm lg:max-h-full">
          {state.log.slice(0, 8).map((entry, i) => (
            <li
              key={entry.id}
              className={cn(
                'leading-snug',
                i === 0 ? 'opacity-100' : 'opacity-60',
                entry.tone === 'good' && 'text-gold',
                entry.tone === 'bad' && 'text-warning',
                entry.tone === 'danger' && 'text-danger',
                entry.tone === 'neutral' && 'text-cream/80',
              )}
            >
              {entry.text}
            </li>
          ))}
        </ol>
      </section>
    </aside>
  )
}
