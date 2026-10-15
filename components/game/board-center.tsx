import { Dice5, Lightbulb, Megaphone, Siren } from 'lucide-react'
import { JAIL_FINE, formatMoney } from '@/lib/game/board'
import type { GameState } from '@/lib/game/types'
import { cn } from '@/lib/utils'
import { CityEffects } from './city-effects'
import { CollapseMeter } from './collapse-meter'
import { Dice } from './dice'
import { PawnToken } from './pawn-token'

const ALERTS = [
  'ALERTA DA DEFESA CIVIL',
  'FALHAS NA REDE ELÉTRICA',
  'EVITE O CENTRO',
  'ABRIGOS ABERTOS',
  'TRANSPORTE SUSPENSO',
]

function Deck({ kind }: { kind: 'evento' | 'crise' }) {
  const isCrisis = kind === 'crise'
  const Icon = isCrisis ? Siren : Megaphone
  return (
    <div
      className={cn('relative aspect-[5/7] w-[calc(var(--cell)*1.15)]', isCrisis ? 'rotate-[14deg]' : '-rotate-[14deg]')}
      aria-hidden
    >
      {[3, 2, 1].map((offset) => (
        <span
          key={offset}
          className={cn(
            'absolute inset-0 rounded-md border',
            isCrisis ? 'border-warning/40 bg-navy' : 'border-gold-dark/50 bg-cream-dark',
          )}
          style={{ transform: `translate(${offset * 2}px, ${offset * 2}px)` }}
        />
      ))}
      <span
        className={cn(
          'absolute inset-0 flex flex-col items-center justify-center gap-[8%] rounded-md border-2 p-[8%] shadow-[0_10px_20px_rgba(0,0,0,0.5)]',
          isCrisis ? 'border-warning bg-navy text-warning' : 'paper border-gold-dark text-navy',
        )}
      >
        <span className={cn('absolute inset-[5%] rounded-sm border', isCrisis ? 'border-warning/40' : 'border-navy/25')} />
        <Icon className="size-[42%]" strokeWidth={1.8} />
        <span className="fs-center-sub font-display font-bold uppercase tracking-[0.2em]">
          {isCrisis ? 'Crise' : 'Evento'}
        </span>
      </span>
    </div>
  )
}

interface BoardCenterProps {
  state: GameState
  effects: boolean
  hints: boolean
  onRoll: () => void
  onEndTurn: () => void
  onPayJail: () => void
}

function hintFor(state: GameState) {
  const player = state.players[state.current]
  if (player.inJail) return 'Tire uma dupla para sair de graça, ou pague a fiança.'
  if (state.phase === 'await-end') return 'Clique em uma propriedade sua para construir antes de encerrar.'
  if (state.collapseLevel >= 3) return 'Regiões danificadas rendem metade. Repare-as clicando nelas.'
  if (state.emergencyFund > 0) return `O Abrigo Público guarda ${formatMoney(state.emergencyFund)} para quem parar lá.`
  return 'Complete um grupo de cores para dobrar o aluguel e liberar construções.'
}

export function BoardCenter({ state, effects, hints, onRoll, onEndTurn, onPayJail }: BoardCenterProps) {
  const player = state.players[state.current]
  const level = state.collapseLevel
  const busy = state.phase === 'rolling' || state.phase === 'moving'
  const latest = state.log[0]

  return (
    <div className="relative size-full overflow-hidden border border-navy/70 bg-navy">
      <CityEffects level={level} effects={effects} />

      {level >= 3 && (
        <div className="absolute inset-x-0 top-0 z-10 overflow-hidden border-b border-warning/60 bg-navy-deep/85 py-[0.6%]">
          <div className="animate-ticker flex w-max whitespace-nowrap">
            {[0, 1].map((k) => (
              <span key={k} className="fs-tile-tiny flex font-display font-semibold uppercase tracking-[0.3em]">
                {ALERTS.map((a) => (
                  <span key={a} className={cn('px-6', level >= 4 ? 'text-danger' : 'text-warning')}>
                    {'▲ '}
                    {a}
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="relative z-10 flex size-full flex-col items-center justify-between px-[6%] pb-[5%] pt-[7%]">
        <div className="text-center">
          <p className="fs-center-sub font-display font-medium uppercase tracking-[0.5em] text-gold text-shadow-strong">
            Jogo de Tabuleiro
          </p>
          <h2 className="fs-center-title font-display font-bold uppercase tracking-wide text-cream text-shadow-strong">
            Cidade <span className="text-gold">em</span> Colapso
          </h2>
        </div>

        <div className="flex w-full items-center justify-between">
          <Deck kind="evento" />
          <div className="flex w-[calc(var(--cell)*1.9)] flex-col items-center gap-[calc(var(--cell)*0.08)]">
            <div className="w-full rounded-xl border border-gold/40 bg-navy-deep/70 p-[12%] shadow-[inset_0_4px_16px_rgba(0,0,0,0.6)] backdrop-blur-sm">
              <Dice dice={state.dice} rolling={state.phase === 'rolling'} rollId={state.rollId} />
            </div>
            {!busy && state.rollId > 0 && (
              <span className="fs-center-sub font-display font-bold tabular-nums text-cream text-shadow-strong">
                {state.dice[0] + state.dice[1]}
                {state.dice[0] === state.dice[1] ? ' · Dupla!' : ''}
              </span>
            )}
          </div>
          <Deck kind="crise" />
        </div>

        <div className="w-full rounded-lg border border-gold/30 bg-navy-deep/80 p-[3.5%] shadow-[0_12px_30px_rgba(0,0,0,0.5)] backdrop-blur-md">
          <div className="flex items-center gap-[3%]">
            <PawnToken kind={player.pawn} color={player.color} className="w-[calc(var(--cell)*0.5)] shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="fs-tile-tiny font-semibold uppercase tracking-[0.25em] text-cream/60">Vez de</p>
              <p className="fs-center-body truncate font-display font-bold uppercase tracking-wide text-cream">
                {player.name}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              {state.phase === 'await-roll' && player.inJail && (
                <button
                  type="button"
                  onClick={onPayJail}
                  disabled={player.money < JAIL_FINE}
                  className="fs-center-sub rounded-md border border-cream/40 px-[calc(var(--cell)*0.18)] py-[calc(var(--cell)*0.09)] font-display font-semibold uppercase tracking-wider text-cream transition hover:bg-cream/10 disabled:opacity-40"
                >
                  Pagar {formatMoney(JAIL_FINE)}
                </button>
              )}
              {state.phase === 'await-end' ? (
                <button
                  type="button"
                  onClick={onEndTurn}
                  className="fs-center-sub rounded-md border border-cream/50 bg-petrol px-[calc(var(--cell)*0.22)] py-[calc(var(--cell)*0.09)] font-display font-bold uppercase tracking-wider text-cream shadow-[0_4px_0_#0a121d] transition hover:brightness-110 active:translate-y-[2px] active:shadow-[0_2px_0_#0a121d]"
                >
                  Encerrar turno
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onRoll}
                  disabled={state.phase !== 'await-roll'}
                  className="fs-center-sub flex items-center gap-2 rounded-md bg-gold px-[calc(var(--cell)*0.22)] py-[calc(var(--cell)*0.09)] font-display font-bold uppercase tracking-wider text-navy shadow-[0_4px_0_#a9822f] transition hover:brightness-110 active:translate-y-[2px] active:shadow-[0_2px_0_#a9822f] disabled:opacity-50"
                >
                  <Dice5 className="size-[1.2em]" aria-hidden />
                  {busy ? 'Movendo…' : player.inJail ? 'Tentar dupla' : 'Lançar dados'}
                </button>
              )}
            </div>
          </div>

          {latest && (
            <p
              key={latest.id}
              className={cn(
                'fs-center-sub animate-rise mt-[2.5%] truncate border-t border-cream/10 pt-[2.5%]',
                latest.tone === 'good' && 'text-gold',
                latest.tone === 'bad' && 'text-warning',
                latest.tone === 'danger' && 'text-danger',
                latest.tone === 'neutral' && 'text-cream/80',
              )}
              aria-live="polite"
            >
              {latest.text}
            </p>
          )}

          <div className="mt-[2.5%]">
            <CollapseMeter level={level} points={state.collapsePoints} />
          </div>

          {hints && (
            <p className="fs-tile-tiny mt-[2.5%] flex items-center gap-1.5 text-cream/60">
              <Lightbulb className="size-[1.3em] shrink-0 text-gold" aria-hidden />
              <span className="truncate">{hintFor(state)}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
