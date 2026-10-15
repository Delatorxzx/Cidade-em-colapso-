'use client'

import { useState } from 'react'
import type { GameSettings } from '@/lib/game/types'
import { GameScreen } from './game-screen'
import { InfoModal, type InfoTab } from './info-modal'
import { SetupScreen } from './setup-screen'
import { TitleScreen } from './title-screen'

const DEFAULT_SETTINGS: GameSettings = {
  speed: 'normal',
  startMoney: 1500,
  collapseRate: 'normal',
  effects: true,
  hints: true,
}

type Screen = { name: 'title' } | { name: 'setup' } | { name: 'game'; names: string[]; key: number }

export function GameApp() {
  const [screen, setScreen] = useState<Screen>({ name: 'title' })
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [info, setInfo] = useState<{ open: boolean; tab: InfoTab }>({ open: false, tab: 'como-jogar' })

  if (screen.name === 'game') {
    return (
      <GameScreen
        key={screen.key}
        names={screen.names}
        settings={settings}
        onSettingsChange={setSettings}
        onExit={() => setScreen({ name: 'title' })}
        onRestart={() => setScreen({ ...screen, key: screen.key + 1 })}
      />
    )
  }

  return (
    <>
      {screen.name === 'title' ? (
        <TitleScreen onNewGame={() => setScreen({ name: 'setup' })} onOpenInfo={(tab) => setInfo({ open: true, tab })} />
      ) : (
        <SetupScreen
          startMoney={settings.startMoney}
          onBack={() => setScreen({ name: 'title' })}
          onStart={(names) => setScreen({ name: 'game', names, key: Date.now() })}
        />
      )}
      <InfoModal
        open={info.open}
        initialTab={info.tab}
        onClose={() => setInfo((i) => ({ ...i, open: false }))}
        settings={settings}
        onSettingsChange={setSettings}
      />
    </>
  )
}
