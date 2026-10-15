import { Trophy } from 'lucide-react'
import { formatMoney } from '@/lib/game/board'
import type { GameState } from '@/lib/game/types'
import { cn } from '@/lib/utils'
import { Modal } from './modal'
import { PawnToken } from './pawn-token'

const TITLES: Record<NonNullable<GameState['gameOver']>['reason'], { title: string; sub: string }> = {
  collapse: { title: 'Colapso Total', sub: 'A cidade parou. O maior patrimônio sobrevive.' },
  bankruptcy: { title: 'Último de pé', sub: 'Todos os rivais faliram.' },
  'solo-win': { title: 'Cidade salva', sub: 'Você alcançou a meta antes do colapso.' },
  'solo-loss': { title: 'Fim da linha', sub: 'A cidade colapsou antes de você alcançar a meta.' },
}

export function GameOverModal({ state, onRestart, onMenu }: { state: GameState; onRestart: () => void; onMenu: () => void }) {
  if (!state.gameOver) return null
  const { reason, ranking } = state.gameOver
  const copy = TITLES[reason]
  const solo = state.players.length === 1

  return (
    <Modal open label="Fim de jogo" className="w-full max-w-md">
      <div className="animate-rise overflow-hidden rounded-lg border-2 border-gold bg-navy-deep shadow-[0_30px_80px_rgba(0,0,0,0.8)]">
        <div className="relative bg-petrol/60 px-6 py-7 text-center">
          <Trophy className="mx-auto size-10 text-gold" aria-hidden />
          <h2 className="mt-2 font-display text-4xl font-bold uppercase tracking-wide text-cream">{copy.title}</h2>
          <p className="mt-1 text-cream/70">{copy.sub}</p>
        </div>
        <ol className="space-y-2 p-5">
          {ranking.map((r, i) => {
            const p = state.players[r.playerId]
            const winner = i === 0 && !solo
            return (
              <li
                key={r.playerId}
                className={cn(
                  'flex items-center gap-3 rounded-md border px-3 py-2.5',
                  winner ? 'border-gold bg-gold/10' : 'border-cream/10 bg-navy/60',
                )}
              >
                <span className="w-6 font-display text-xl font-bold text-gold">{i + 1}º</span>
                <PawnToken kind={p.pawn} color={p.color} className="w-8" />
                <span className="flex-1 truncate font-display text-lg font-semibold uppercase text-cream">{p.name}</span>
                <span className="font-display text-lg font-bold tabular-nums text-cream">
                  {p.bankrupt ? 'Falido' : formatMoney(r.worth)}
                </span>
              </li>
            )
          })}
        </ol>
        <div className="flex gap-2 px-5 pb-5">
          <button
            type="button"
            onClick={onMenu}
            className="flex-1 rounded-md border border-cream/30 py-3 font-display font-semibold uppercase tracking-wider text-cream transition hover:bg-cream/10"
          >
            Menu inicial
          </button>
          <button
            type="button"
            onClick={onRestart}
            className="flex-[1.3] rounded-md bg-gold py-3 font-display font-bold uppercase tracking-wider text-navy shadow-[0_4px_0_#a9822f] transition hover:brightness-110"
          >
            Jogar novamente
          </button>
        </div>
      </div>
    </Modal>
  )
}
