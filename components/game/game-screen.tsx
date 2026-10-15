'use client'

import { useCallback, useEffect, useReducer, useState } from 'react'
import { createGame, gameReducer } from '@/lib/game/engine'
import type { GameSettings } from '@/lib/game/types'
import { LevelBanner, TurnBanner } from './banners'
import { Board } from './board'
import { EventCard } from './event-card'
import { GameOverModal } from './game-over'
import { InfoModal, type InfoTab } from './info-modal'
import { Modal } from './modal'
import { PlayerPanel } from './player-panel'
import { PropertyDeed } from './property-deed'

const SPEEDS: Record<GameSettings['speed'], { step: number; roll: number }> = {
  lenta: { step: 380, roll: 1200 },
  normal: { step: 230, roll: 850 },
  rapida: { step: 120, roll: 500 },
}

const rollDie = () => 1 + Math.floor(Math.random() * 6)

interface GameScreenProps {
  names: string[]
  settings: GameSettings
  onSettingsChange: (s: GameSettings) => void
  onExit: () => void
  onRestart: () => void
}

export function GameScreen({ names, settings, onSettingsChange, onExit, onRestart }: GameScreenProps) {
  const [state, dispatch] = useReducer(gameReducer, undefined, () => createGame(names, settings))
  const [viewing, setViewing] = useState<number | null>(null)
  const [info, setInfo] = useState<{ open: boolean; tab: InfoTab }>({ open: false, tab: 'regras' })
  const [confirmExit, setConfirmExit] = useState(false)
  const speed = SPEEDS[settings.speed]

  useEffect(() => {
    if (state.phase === 'rolling') {
      const t = setTimeout(() => dispatch({ type: 'ROLL_DONE', rand: Math.random() }), speed.roll)
      return () => clearTimeout(t)
    }
    if (state.phase === 'moving') {
      const t = setTimeout(() => dispatch({ type: 'STEP', rand: Math.random() }), speed.step)
      return () => clearTimeout(t)
    }
  }, [state.phase, state.stepsLeft, speed.roll, speed.step])

  useEffect(() => {
    if (state.levelBanner === null) return
    const t = setTimeout(() => dispatch({ type: 'DISMISS_LEVEL' }), 3200)
    return () => clearTimeout(t)
  }, [state.levelBanner])

  const roll = useCallback(() => dispatch({ type: 'ROLL', dice: [rollDie(), rollDie()] }), [])
  const endTurn = useCallback(() => dispatch({ type: 'END_TURN', rand: Math.random() }), [])
  const payJail = useCallback(() => dispatch({ type: 'PAY_JAIL' }), [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== 'Space' || e.repeat) return
      const target = e.target as HTMLElement
      if (target.closest('button, input, [role="dialog"]')) return
      if (state.phase === 'await-roll') {
        e.preventDefault()
        roll()
      } else if (state.phase === 'await-end') {
        e.preventDefault()
        endTurn()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [state.phase, roll, endTurn])

  const current = state.players[state.current]

  return (
    <main className="table-surface flex min-h-dvh flex-col items-center gap-3 p-2 lg:h-dvh lg:flex-row lg:items-center lg:justify-center lg:gap-5 lg:overflow-hidden lg:p-3.5">
      <h1 className="sr-only">Cidade em Colapso — partida em andamento</h1>
      <Board
        state={state}
        stepMs={speed.step}
        effects={settings.effects}
        hints={settings.hints}
        shake={settings.effects && state.levelBanner !== null}
        onSelectSpace={setViewing}
        onRoll={roll}
        onEndTurn={endTurn}
        onPayJail={payJail}
      />
      <PlayerPanel
        state={state}
        onSelectSpace={setViewing}
        onOpenInfo={(tab) => setInfo({ open: true, tab })}
        onMenu={() => setConfirmExit(true)}
      />

      {state.turnId > 0 && state.phase === 'await-roll' && <TurnBanner key={state.turnId} player={current} />}

      <Modal open={state.phase === 'buy' && state.pendingBuy !== null} label="Comprar propriedade">
        {state.pendingBuy !== null && (
          <PropertyDeed
            state={state}
            spaceId={state.pendingBuy}
            mode="buy"
            onBuy={() => dispatch({ type: 'BUY' })}
            onDecline={() => dispatch({ type: 'DECLINE' })}
          />
        )}
      </Modal>

      <Modal open={state.phase === 'card' && state.activeCard !== null} label="Carta">
        {state.activeCard && (
          <EventCard
            key={state.activeCard.id + state.turnId}
            card={state.activeCard}
            onApply={() => dispatch({ type: 'APPLY_CARD', rand: Math.random() })}
          />
        )}
      </Modal>

      <Modal
        open={viewing !== null && state.phase !== 'buy' && state.phase !== 'card'}
        onClose={() => setViewing(null)}
        label="Título de posse"
      >
        {viewing !== null && (
          <PropertyDeed
            state={state}
            spaceId={viewing}
            mode="view"
            onClose={() => setViewing(null)}
            onBuild={() => dispatch({ type: 'BUILD', spaceId: viewing })}
          />
        )}
      </Modal>

      <InfoModal
        open={info.open}
        initialTab={info.tab}
        onClose={() => setInfo((i) => ({ ...i, open: false }))}
        settings={settings}
        onSettingsChange={onSettingsChange}
        inGame
      />

      <Modal open={confirmExit} onClose={() => setConfirmExit(false)} label="Sair da partida" className="w-full max-w-sm">
        <div className="paper animate-rise rounded-lg border-2 border-navy p-6 text-center text-navy shadow-[0_30px_80px_rgba(0,0,0,0.7)]">
          <h2 className="font-display text-2xl font-bold uppercase tracking-wide">Sair da partida?</h2>
          <p className="mt-2 text-navy/70">O progresso desta partida será perdido.</p>
          <div className="mt-5 flex gap-2">
            <button
              type="button"
              onClick={() => setConfirmExit(false)}
              className="flex-1 rounded-md border-2 border-navy/60 py-2.5 font-display font-semibold uppercase tracking-wider transition hover:bg-navy/5"
            >
              Continuar
            </button>
            <button
              type="button"
              onClick={onExit}
              className="flex-1 rounded-md bg-navy py-2.5 font-display font-bold uppercase tracking-wider text-gold transition hover:brightness-125"
            >
              Sair
            </button>
          </div>
        </div>
      </Modal>

      {state.levelBanner !== null && (
        <LevelBanner level={state.levelBanner} onDismiss={() => dispatch({ type: 'DISMISS_LEVEL' })} />
      )}

      {state.phase === 'game-over' && state.levelBanner === null && (
        <GameOverModal state={state} onRestart={onRestart} onMenu={onExit} />
      )}
    </main>
  )
}
