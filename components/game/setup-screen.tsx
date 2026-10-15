'use client'

import Image from 'next/image'
import { ArrowLeft, Play } from 'lucide-react'
import { useState } from 'react'
import { PAWNS, SOLO_GOAL, formatMoney } from '@/lib/game/board'
import { cn } from '@/lib/utils'
import { PawnToken } from './pawn-token'

const DEFAULT_NAMES = ['Ana', 'Bruno', 'Carla', 'Diego', 'Elisa']

interface SetupScreenProps {
  startMoney: number
  onBack: () => void
  onStart: (names: string[]) => void
}

export function SetupScreen({ startMoney, onBack, onStart }: SetupScreenProps) {
  const [count, setCount] = useState(2)
  const [names, setNames] = useState(DEFAULT_NAMES)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    onStart(names.slice(0, count).map((n, i) => n.trim() || `Jogador ${i + 1}`))
  }

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-navy-deep p-4">
      <div className="absolute inset-0 opacity-30" aria-hidden>
        <Image src="/images/hero.png" alt="" fill sizes="100vw" className="object-cover blur-sm" />
        <div className="absolute inset-0 bg-navy-deep/70" />
      </div>

      <form
        onSubmit={submit}
        className="paper animate-rise relative w-full max-w-lg rounded-lg border-2 border-navy text-navy shadow-[0_30px_80px_rgba(0,0,0,0.7)]"
      >
        <div className="flex items-center gap-3 bg-navy px-5 py-4">
          <button
            type="button"
            onClick={onBack}
            className="rounded p-1 text-cream/70 transition hover:bg-cream/10 hover:text-cream"
            aria-label="Voltar"
          >
            <ArrowLeft className="size-5" />
          </button>
          <h1 className="font-display text-2xl font-bold uppercase tracking-wider text-cream">Nova partida</h1>
        </div>

        <div className="space-y-6 p-5">
          <fieldset>
            <legend className="font-display text-sm font-semibold uppercase tracking-wider">Número de jogadores</legend>
            <div className="mt-2 flex gap-1.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setCount(n)}
                  aria-pressed={count === n}
                  className={cn(
                    'flex-1 rounded-md border-2 py-2.5 font-display text-xl font-bold transition',
                    count === n ? 'border-navy bg-navy text-gold' : 'border-navy/20 text-navy/60 hover:border-navy/50',
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
            <p className="mt-2 text-sm text-navy/70">
              {count === 1
                ? `Modo solo: alcance ${formatMoney(SOLO_GOAL)} de patrimônio antes do Colapso Total.`
                : 'Partida local: passem o dispositivo a cada turno.'}
            </p>
          </fieldset>

          <fieldset className="space-y-2">
            <legend className="font-display text-sm font-semibold uppercase tracking-wider">Jogadores</legend>
            {PAWNS.slice(0, count).map((pawn, i) => (
              <div key={pawn.kind} className="flex items-center gap-3 rounded-md border border-navy/15 bg-cream/60 p-2">
                <PawnToken kind={pawn.kind} color={pawn.color} className="w-10 shrink-0" />
                <div className="flex-1">
                  <label htmlFor={`player-${i}`} className="text-[11px] font-semibold uppercase tracking-wider text-navy/60">
                    {pawn.label}
                  </label>
                  <input
                    id={`player-${i}`}
                    value={names[i]}
                    maxLength={14}
                    onChange={(e) => setNames((prev) => prev.map((v, j) => (j === i ? e.target.value : v)))}
                    className="block w-full bg-transparent font-display text-lg font-semibold uppercase tracking-wide outline-none placeholder:text-navy/30"
                    placeholder={`Jogador ${i + 1}`}
                  />
                </div>
              </div>
            ))}
          </fieldset>

          <p className="text-sm text-navy/70">
            Cada jogador começa com <strong className="text-navy">{formatMoney(startMoney)}</strong>. Ajuste em
            Configurações.
          </p>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-3 rounded-md bg-navy py-4 font-display text-lg font-bold uppercase tracking-[0.15em] text-gold shadow-[0_4px_0_#0a121d] transition hover:brightness-125 active:translate-y-[2px]"
          >
            <Play className="size-5 fill-gold" aria-hidden />
            Começar partida
          </button>
        </div>
      </form>
    </main>
  )
}
