'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

const PIPS: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [[28, 28], [72, 72]],
  3: [[26, 26], [50, 50], [74, 74]],
  4: [[28, 28], [72, 28], [28, 72], [72, 72]],
  5: [[26, 26], [74, 26], [50, 50], [26, 74], [74, 74]],
  6: [[28, 24], [72, 24], [28, 50], [72, 50], [28, 76], [72, 76]],
}

function Die({ value, rolling, rollId }: { value: number; rolling: boolean; rollId: number }) {
  const [shown, setShown] = useState(value)

  useEffect(() => {
    if (!rolling) {
      setShown(value)
      return
    }
    const id = setInterval(() => setShown(1 + Math.floor(Math.random() * 6)), 80)
    return () => clearInterval(id)
  }, [rolling, value])

  return (
    <div
      key={rolling ? 'rolling' : `land-${rollId}`}
      className={cn('relative aspect-square w-full', rolling ? 'animate-dice' : 'animate-dice-land')}
    >
      <svg viewBox="0 0 100 100" className="size-full drop-shadow-[0_6px_6px_rgba(0,0,0,0.55)]" aria-hidden>
        <rect x="4" y="8" width="92" height="88" rx="18" fill="#c9b98f" />
        <rect x="4" y="4" width="92" height="88" rx="18" fill="#F2E6C9" stroke="#a9822f" strokeWidth="2" />
        {PIPS[shown].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy - 2} r="8.5" fill="#101C2C" />
        ))}
      </svg>
    </div>
  )
}

export function Dice({ dice, rolling, rollId }: { dice: [number, number]; rolling: boolean; rollId: number }) {
  return (
    <div className="flex items-center gap-[12%]" role="img" aria-label={`Dados: ${dice[0]} e ${dice[1]}`}>
      <div className="w-[44%] -rotate-6">
        <Die value={dice[0]} rolling={rolling} rollId={rollId} />
      </div>
      <div className="w-[44%] rotate-[8deg]">
        <Die value={dice[1]} rolling={rolling} rollId={rollId} />
      </div>
    </div>
  )
}
