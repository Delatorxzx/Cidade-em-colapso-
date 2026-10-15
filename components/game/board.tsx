import { SPACES, cellCenterPercent, gridPosition } from '@/lib/game/board'
import type { GameState } from '@/lib/game/types'
import { cn } from '@/lib/utils'
import { BoardCenter } from './board-center'
import { BoardTile, CornerTile } from './board-tile'
import { levelColor } from './collapse-meter'
import { PawnToken } from './pawn-token'

const PAWN_OFFSETS = [
  [0, 0],
  [-1.6, -1.2],
  [1.6, -1.2],
  [-1.6, 1.4],
  [1.6, 1.4],
]

interface BoardProps {
  state: GameState
  stepMs: number
  effects: boolean
  hints: boolean
  shake: boolean
  onSelectSpace: (id: number) => void
  onRoll: () => void
  onEndTurn: () => void
  onPayJail: () => void
}

export function Board({ state, stepMs, effects, hints, shake, onSelectSpace, onRoll, onEndTurn, onPayJail }: BoardProps) {
  const level = state.collapseLevel
  const current = state.players[state.current]
  const glow = levelColor(level)

  const occupancy = new Map<number, number[]>()
  state.players.forEach((p) => {
    if (p.bankrupt) return
    occupancy.set(p.position, [...(occupancy.get(p.position) ?? []), p.id])
  })

  return (
    <div
      className={cn('board-frame relative shrink-0 rounded-[6px] p-[0.9%]', shake && 'animate-shake')}
      style={{
        background: 'linear-gradient(145deg, #1b2b3e, #0a121d)',
        boxShadow: `0 0 0 2px #0a121d, 0 0 0 4px ${glow}66, 0 30px 80px rgba(0,0,0,0.7), 0 0 ${level >= 4 ? 60 : 30}px ${glow}${level >= 4 ? '55' : '22'}`,
        transition: 'box-shadow 1s ease',
      }}
    >
      <div className="relative size-full rounded-[3px] border-2 border-gold/70 bg-navy p-[0.4%]">
        <div className="board-grid relative size-full">
          {SPACES.map((space) => {
            const { col, row, side } = gridPosition(space.id)
            const owner = state.props[space.id].owner
            const highlight = !['rolling', 'moving'].includes(state.phase) && current.position === space.id
            return (
              <div key={space.id} className="relative min-h-0 min-w-0" style={{ gridColumn: col + 1, gridRow: row + 1 }}>
                {side === 'corner' ? (
                  <CornerTile space={space} emergencyFund={state.emergencyFund} highlight={highlight} />
                ) : (
                  <BoardTile
                    space={space}
                    prop={state.props[space.id]}
                    side={side}
                    ownerColor={owner !== null ? state.players[owner].color : undefined}
                    highlight={highlight}
                    onSelect={onSelectSpace}
                  />
                )}
              </div>
            )
          })}

          <div className="relative min-h-0 min-w-0" style={{ gridColumn: '2 / 9', gridRow: '2 / 9' }}>
            <BoardCenter
              state={state}
              effects={effects}
              hints={hints}
              onRoll={onRoll}
              onEndTurn={onEndTurn}
              onPayJail={onPayJail}
            />
          </div>

          <div className="pointer-events-none absolute inset-0 z-20">
            {state.players.map((p) => {
              if (p.bankrupt) return null
              const { x, y } = cellCenterPercent(p.position)
              const stack = occupancy.get(p.position) ?? []
              const slot = stack.length > 1 ? stack.indexOf(p.id) + 1 : 0
              const [dx, dy] = PAWN_OFFSETS[Math.min(slot, PAWN_OFFSETS.length - 1)]
              const isCurrent = p.id === state.current
              return (
                <div
                  key={p.id}
                  className="absolute"
                  style={{
                    left: `${x + dx}%`,
                    top: `${y + dy}%`,
                    width: 'calc(var(--cell) * 0.4)',
                    transform: 'translate(-50%, -50%)',
                    transition: `left ${stepMs * 0.85}ms ease-out, top ${stepMs * 0.85}ms ease-out`,
                    zIndex: isCurrent ? 30 : 20,
                  }}
                >
                  <div key={p.position} className={state.phase === 'moving' && isCurrent ? 'animate-hop' : undefined}>
                    <PawnToken kind={p.pawn} color={p.color} active={isCurrent} className="w-full" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
