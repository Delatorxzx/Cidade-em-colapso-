import { ArrowLeft, TriangleAlert } from 'lucide-react'
import { GROUPS, JAIL_FINE, START_BONUS, formatMoney } from '@/lib/game/board'
import type { PropertyState, Space } from '@/lib/game/types'
import { cn } from '@/lib/utils'
import { SPACE_ICONS } from './icons'

type Side = 'bottom' | 'left' | 'top' | 'right'

interface BoardTileProps {
  space: Space
  prop: PropertyState
  side: Side
  ownerColor?: string
  highlight?: boolean
  onSelect?: (id: number) => void
}

function Buildings({ count, vertical }: { count: number; vertical: boolean }) {
  if (count === 0) return null
  return (
    <div className={cn('flex items-center justify-center gap-[6%]', vertical && 'flex-col')} aria-hidden>
      {count === 4 ? (
        <span className="block h-[70%] w-[22%] min-w-1.5 rounded-[2px] border border-navy/70 bg-gold shadow-[0_1px_0_rgba(0,0,0,0.4)]" style={vertical ? { width: '70%', height: '22%' } : undefined} />
      ) : (
        Array.from({ length: count }).map((_, i) => (
          <span
            key={i}
            className="block aspect-square w-[18%] min-w-1 rounded-[2px] border border-navy/70 bg-cream shadow-[0_1px_0_rgba(0,0,0,0.4)]"
            style={vertical ? { width: '55%' } : undefined}
          />
        ))
      )}
    </div>
  )
}

export function BoardTile({ space, prop, side, ownerColor, highlight, onSelect }: BoardTileProps) {
  const Icon = SPACE_ICONS[space.icon]
  const vertical = side === 'left' || side === 'right'
  const group = space.group ? GROUPS[space.group] : null
  const isDanger = space.kind === 'crise'
  const isOwnable = space.kind === 'property' || space.kind === 'transit' || space.kind === 'utility'

  const directionClass = {
    bottom: 'flex-col',
    top: 'flex-col-reverse',
    left: 'flex-row-reverse',
    right: 'flex-row',
  }[side]

  const ownerEdge = {
    bottom: 'inset-x-0 bottom-0 h-[7%]',
    top: 'inset-x-0 top-0 h-[7%]',
    left: 'inset-y-0 left-0 w-[7%]',
    right: 'inset-y-0 right-0 w-[7%]',
  }[side]

  const priceLabel =
    space.kind === 'tax' ? `Pague ${formatMoney(space.tax ?? 0)}` : space.price ? formatMoney(space.price) : null

  const content = (
    <div
      className={cn(
        'paper relative flex size-full overflow-hidden border border-navy/60 text-navy',
        directionClass,
        prop.damaged && 'brightness-[0.82] saturate-50',
      )}
    >
      {group && (
        <div
          className={cn(
            'relative flex shrink-0 items-center justify-center border-navy/60',
            vertical ? 'h-full w-[20%]' : 'h-[22%] w-full',
            side === 'bottom' && 'border-b',
            side === 'top' && 'border-t',
            side === 'left' && 'border-l',
            side === 'right' && 'border-r',
          )}
          style={{ backgroundColor: group.color, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25)' }}
        >
          {prop.damaged && <div className="hazard-stripes absolute inset-0 opacity-80" aria-hidden />}
          <div className={cn('relative flex size-full items-center justify-center', vertical ? 'py-[10%]' : 'px-[10%]')}>
            <Buildings count={prop.buildings} vertical={vertical} />
          </div>
        </div>
      )}

      <div
        className={cn(
          'relative flex min-h-0 min-w-0 flex-1 items-center justify-between gap-[4%]',
          vertical ? 'flex-col px-[6%] py-[6%]' : 'flex-col px-[5%] py-[7%]',
          !group && 'justify-center',
        )}
      >
        <span className="fs-tile-name block w-full text-balance text-center font-display font-semibold uppercase tracking-wide">
          {space.name}
        </span>
        <Icon
          className={cn(
            'shrink-0',
            vertical ? 'size-[34%]' : 'size-[30%]',
            isDanger ? 'text-danger' : space.kind === 'evento' ? 'text-gold-dark' : 'text-petrol',
          )}
          strokeWidth={1.8}
          aria-hidden
        />
        {priceLabel && (
          <span className="fs-tile-price block font-display font-bold tabular-nums tracking-wide text-navy">
            {priceLabel}
          </span>
        )}
      </div>

      {prop.damaged && (
        <span
          className="absolute right-[4%] top-[30%] flex size-[24%] items-center justify-center rounded-full bg-danger text-cream shadow"
          title="Região danificada"
        >
          <TriangleAlert className="size-[70%]" aria-hidden />
        </span>
      )}

      {isOwnable && ownerColor && (
        <span
          className={cn('absolute', ownerEdge)}
          style={{ backgroundColor: ownerColor, boxShadow: '0 0 0 1px rgba(16,28,44,0.6)' }}
          aria-hidden
        />
      )}

      {highlight && <span className="pointer-events-none absolute inset-0 ring-[3px] ring-inset ring-gold" aria-hidden />}
    </div>
  )

  if (!isOwnable || !onSelect) return content

  return (
    <button
      type="button"
      onClick={() => onSelect(space.id)}
      className="block size-full cursor-pointer transition-transform hover:z-10 hover:scale-[1.04] focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-gold"
      aria-label={`${space.name}${space.price ? `, ${formatMoney(space.price)}` : ''}${prop.owner !== null ? ', com dono' : ', à venda'}${prop.damaged ? ', danificada' : ''}`}
    >
      {content}
    </button>
  )
}

interface CornerTileProps {
  space: Space
  emergencyFund: number
  highlight?: boolean
}

export function CornerTile({ space, emergencyFund, highlight }: CornerTileProps) {
  const Icon = SPACE_ICONS[space.icon]

  if (space.kind === 'start') {
    return (
      <div className="relative flex size-full flex-col items-center justify-center gap-[5%] overflow-hidden border border-navy/60 bg-gold p-[8%] text-center text-navy">
        <span className="fs-tile-tiny font-semibold uppercase tracking-[0.15em]">Receba {formatMoney(START_BONUS)}</span>
        <span className="fs-corner font-display text-[1.9em] font-bold uppercase tracking-wider">Início</span>
        <ArrowLeft className="size-[38%]" strokeWidth={2.6} aria-hidden />
        {highlight && <span className="pointer-events-none absolute inset-0 ring-[3px] ring-inset ring-cream" aria-hidden />}
      </div>
    )
  }

  if (space.kind === 'jail') {
    return (
      <div className="paper relative flex size-full overflow-hidden border border-navy/60 text-navy">
        <div className="hazard-stripes absolute inset-y-0 left-0 w-[16%]" aria-hidden />
        <div className="hazard-stripes absolute inset-x-0 bottom-0 h-[16%]" aria-hidden />
        <div className="absolute bottom-[16%] left-[16%] right-0 top-0 flex flex-col items-center justify-center gap-[6%] bg-urban p-[6%] text-center text-cream">
          <Icon className="size-[34%]" strokeWidth={1.8} aria-hidden />
          <span className="fs-corner font-display font-bold uppercase tracking-wide">Zona Interditada</span>
          <span className="fs-tile-tiny uppercase tracking-wider text-cream/80">Fiança {formatMoney(JAIL_FINE)}</span>
        </div>
        <span className="fs-tile-tiny absolute bottom-[1%] left-[18%] font-display font-semibold uppercase tracking-widest text-cream">
          Visitante
        </span>
        {highlight && <span className="pointer-events-none absolute inset-0 ring-[3px] ring-inset ring-gold" aria-hidden />}
      </div>
    )
  }

  const isGoJail = space.kind === 'gotojail'
  return (
    <div
      className={cn(
        'relative flex size-full flex-col items-center justify-center gap-[5%] overflow-hidden border border-navy/60 p-[8%] text-center',
        isGoJail ? 'bg-navy text-cream' : 'paper text-navy',
      )}
    >
      <Icon
        className={cn('size-[36%]', isGoJail ? 'text-warning' : 'text-petrol')}
        strokeWidth={1.8}
        aria-hidden
      />
      <span className="fs-corner font-display font-bold uppercase tracking-wide">{space.name}</span>
      <span className={cn('fs-tile-tiny uppercase tracking-wider', isGoJail ? 'text-cream/70' : 'text-navy/70')}>
        {isGoJail ? 'Vá para a Zona Interditada' : `Fundo: ${formatMoney(emergencyFund)}`}
      </span>
      {highlight && <span className="pointer-events-none absolute inset-0 ring-[3px] ring-inset ring-gold" aria-hidden />}
    </div>
  )
}
