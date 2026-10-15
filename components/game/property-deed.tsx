import { Hammer, TriangleAlert } from 'lucide-react'
import { BUILDING_LABELS, COLLAPSE_RENT_MULT, GROUPS, RENT_MULTIPLIERS, SPACES, formatMoney } from '@/lib/game/board'
import { canBuild, rentFor } from '@/lib/game/engine'
import type { GameState } from '@/lib/game/types'
import { cn } from '@/lib/utils'
import { SPACE_ICONS } from './icons'

interface PropertyDeedProps {
  state: GameState
  spaceId: number
  mode: 'buy' | 'view'
  onBuy?: () => void
  onDecline?: () => void
  onBuild?: () => void
  onClose?: () => void
}

export function PropertyDeed({ state, spaceId, mode, onBuy, onDecline, onBuild, onClose }: PropertyDeedProps) {
  const space = SPACES[spaceId]
  const prop = state.props[spaceId]
  const group = space.group ? GROUPS[space.group] : null
  const Icon = SPACE_ICONS[space.icon]
  const owner = prop.owner !== null ? state.players[prop.owner] : null
  const player = state.players[state.current]
  const mult = COLLAPSE_RENT_MULT[state.collapseLevel]
  const build = canBuild(state, spaceId)
  const affordable = player.money >= (space.price ?? 0)

  const rows: { label: string; value: string; active?: boolean }[] = []
  if (space.kind === 'property' && space.rent) {
    RENT_MULTIPLIERS.forEach((m, i) => {
      rows.push({
        label: i === 0 ? 'Aluguel' : `Com ${BUILDING_LABELS[i]}`,
        value: formatMoney(space.rent! * m * mult),
        active: owner !== null && prop.buildings === i,
      })
    })
    rows.splice(1, 0, { label: 'Grupo completo', value: formatMoney(space.rent * 2 * mult) })
  } else if (space.kind === 'transit') {
    ;[1, 2, 3, 4].forEach((n) =>
      rows.push({ label: `${n} ${n === 1 ? 'estação' : 'estações'}`, value: formatMoney(25 * 2 ** (n - 1) * mult) }),
    )
  } else if (space.kind === 'utility') {
    rows.push({ label: '1 serviço', value: '4× dados' }, { label: '2 serviços', value: '10× dados' })
  }

  return (
    <div className="animate-deed-in w-[min(88vw,320px)]">
      <div className="paper rounded-md border-2 border-navy p-3 text-navy shadow-[0_24px_60px_rgba(0,0,0,0.65)]">
        <div
          className="relative flex flex-col items-center gap-1 rounded-sm border border-navy/60 px-3 py-3 text-center"
          style={{ backgroundColor: group?.color ?? '#163A4D', color: '#F2E6C9' }}
        >
          {prop.damaged && <div className="hazard-stripes absolute inset-0 rounded-sm opacity-40" aria-hidden />}
          <span className="relative text-[10px] font-semibold uppercase tracking-[0.3em] opacity-85">
            {group ? `Título de posse · ${group.name}` : space.kind === 'transit' ? 'Transporte público' : 'Serviço urbano'}
          </span>
          <span className="relative font-display text-2xl font-bold uppercase leading-tight tracking-wide">{space.name}</span>
        </div>

        <div className="flex items-center justify-center py-3">
          <Icon className="size-10 text-petrol" strokeWidth={1.6} aria-hidden />
        </div>

        <dl className="space-y-1 text-sm">
          {rows.map((r) => (
            <div
              key={r.label}
              className={cn(
                'flex items-center justify-between border-b border-dotted border-navy/25 pb-1',
                r.active && 'font-bold text-petrol',
              )}
            >
              <dt>{r.label}</dt>
              <dd className="font-display font-semibold tabular-nums">{r.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-3 flex items-center justify-between text-xs text-navy/70">
          <span>
            Preço: <strong className="font-display text-sm text-navy">{formatMoney(space.price ?? 0)}</strong>
          </span>
          {group && (
            <span>
              Construção: <strong className="font-display text-sm text-navy">{formatMoney(group.buildCost)}</strong>
            </span>
          )}
        </div>

        {mult > 1 && (
          <p className="mt-2 flex items-center gap-1.5 rounded-sm bg-warning/15 px-2 py-1 text-xs font-medium text-navy">
            <TriangleAlert className="size-3.5 text-warning" aria-hidden />
            Aluguel +{Math.round((mult - 1) * 100)}% pelo Nível de Colapso
          </p>
        )}
        {prop.damaged && (
          <p className="mt-2 flex items-center gap-1.5 rounded-sm bg-danger/15 px-2 py-1 text-xs font-medium text-navy">
            <TriangleAlert className="size-3.5 text-danger" aria-hidden />
            Região danificada: aluguel pela metade até ser reparada.
          </p>
        )}

        <div className="mt-3 border-t-2 border-navy/80 pt-3">
          {mode === 'buy' ? (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onDecline}
                className="flex-1 rounded-md border-2 border-navy/60 py-2.5 font-display text-sm font-semibold uppercase tracking-wider transition hover:bg-navy/5"
              >
                Recusar
              </button>
              <button
                type="button"
                onClick={onBuy}
                disabled={!affordable}
                className="flex-[1.4] rounded-md bg-navy py-2.5 font-display text-sm font-bold uppercase tracking-wider text-gold shadow-[0_3px_0_#0a121d] transition hover:brightness-125 disabled:opacity-40"
              >
                {affordable ? `Comprar ${formatMoney(space.price ?? 0)}` : 'Sem saldo'}
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-center text-xs text-navy/70">
                {owner ? (
                  <>
                    Proprietário: <strong style={{ color: '#101C2C' }}>{owner.name}</strong> · aluguel atual{' '}
                    <strong>{space.kind === 'utility' ? 'varia com os dados' : formatMoney(rentFor(state, spaceId))}</strong>
                  </>
                ) : (
                  'Disponível para compra'
                )}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-md border-2 border-navy/60 py-2 font-display text-sm font-semibold uppercase tracking-wider transition hover:bg-navy/5"
                >
                  Fechar
                </button>
                {owner?.id === player.id && space.kind === 'property' && (
                  <button
                    type="button"
                    onClick={onBuild}
                    disabled={!build.ok}
                    title={build.reason}
                    className="flex flex-[1.4] items-center justify-center gap-1.5 rounded-md bg-navy py-2 font-display text-sm font-bold uppercase tracking-wider text-gold shadow-[0_3px_0_#0a121d] transition hover:brightness-125 disabled:opacity-40"
                  >
                    <Hammer className="size-4" aria-hidden />
                    {build.repair ? `Reparar ${formatMoney(build.cost ?? 0)}` : build.ok ? `Construir ${formatMoney(build.cost ?? 0)}` : 'Construir'}
                  </button>
                )}
              </div>
              {owner?.id === player.id && space.kind === 'property' && !build.ok && build.reason && (
                <p className="text-center text-[11px] text-navy/60">{build.reason}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
