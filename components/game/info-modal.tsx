'use client'

import { X } from 'lucide-react'
import { useState } from 'react'
import { COLLAPSE_LEVELS, JAIL_FINE, SOLO_GOAL, START_BONUS, formatMoney } from '@/lib/game/board'
import type { GameSettings } from '@/lib/game/types'
import { cn } from '@/lib/utils'
import { Modal } from './modal'

export type InfoTab = 'como-jogar' | 'regras' | 'ajuda' | 'config'

const TABS: { id: InfoTab; label: string }[] = [
  { id: 'como-jogar', label: 'Como jogar' },
  { id: 'regras', label: 'Regras' },
  { id: 'ajuda', label: 'Ajuda' },
  { id: 'config', label: 'Configurações' },
]

interface InfoModalProps {
  open: boolean
  initialTab: InfoTab
  onClose: () => void
  settings: GameSettings
  onSettingsChange: (s: GameSettings) => void
  inGame?: boolean
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h3 className="font-display text-lg font-semibold uppercase tracking-wide text-navy">{title}</h3>
      <div className="space-y-2 text-[15px] leading-relaxed text-navy/80">{children}</div>
    </section>
  )
}

function HowToPlay() {
  return (
    <div className="space-y-5">
      <Section title="Objetivo">
        <p>
          Seja o jogador com o maior patrimônio quando a cidade chegar ao Colapso Total — ou seja o último a não
          falir. No modo solo, alcance {formatMoney(SOLO_GOAL)} de patrimônio antes do colapso.
        </p>
      </Section>
      <Section title="Seu turno">
        <ol className="list-decimal space-y-1 pl-5">
          <li>Lance os dois dados e mova seu peão no sentido anti-horário.</li>
          <li>Caiu em um bairro livre? Compre o título de posse ou recuse.</li>
          <li>Caiu em bairro de outro jogador? Pague o aluguel.</li>
          <li>Cartas de Evento e Crise mudam o rumo da partida.</li>
          <li>Construa casas nos seus grupos completos e encerre o turno.</li>
        </ol>
      </Section>
      <Section title="O colapso">
        <p>
          A cada turno o Nível de Colapso avança. Cartas de Crise aceleram o processo. Quanto mais alto o nível, maiores
          os aluguéis e maior o risco de danos às regiões.
        </p>
      </Section>
    </div>
  )
}

function Rules() {
  return (
    <div className="space-y-5">
      <Section title="Dinheiro e propriedades">
        <ul className="list-disc space-y-1 pl-5">
          <li>Passar pelo Início rende {formatMoney(START_BONUS)}.</li>
          <li>Grupo de cores completo dobra o aluguel do terreno.</li>
          <li>Construa até 3 casas e depois uma Torre — de forma livre, sem ordem entre bairros.</li>
          <li>Transportes: aluguel dobra a cada estação que você possui.</li>
          <li>Serviços urbanos: 4× os dados (10× com os dois).</li>
        </ul>
      </Section>
      <Section title="Zona Interditada">
        <p>
          Enviado pelo Toque de Recolher, por carta ou por três duplas seguidas. Saia tirando uma dupla, pagando{' '}
          {formatMoney(JAIL_FINE)} ou automaticamente após três turnos (com a fiança).
        </p>
      </Section>
      <Section title="Abrigo Público">
        <p>Impostos e multas vão para o fundo de emergência. Quem parar no Abrigo leva tudo.</p>
      </Section>
      <Section title="Níveis de colapso">
        <ul className="space-y-1.5">
          {COLLAPSE_LEVELS.map((l) => (
            <li key={l.level} className="flex gap-2">
              <span className="font-display font-semibold text-navy">
                {l.level}. {l.name}
              </span>
              <span>— {l.text}</span>
            </li>
          ))}
        </ul>
      </Section>
      <Section title="Falência">
        <p>
          Sem dinheiro para pagar, suas construções e propriedades são vendidas pela metade do valor. Se ainda assim não
          bastar, você está fora.
        </p>
      </Section>
    </div>
  )
}

function Help() {
  return (
    <div className="space-y-5">
      <Section title="Dicas estratégicas">
        <ul className="list-disc space-y-1 pl-5">
          <li>Grupos baratos completos rendem cedo: construa rápido antes do colapso.</li>
          <li>Guarde reserva para aluguéis altos nos níveis 4 e 5.</li>
          <li>Regiões danificadas rendem metade. Repare pagando o custo de construção.</li>
          <li>Transportes são estáveis e não sofrem dano.</li>
        </ul>
      </Section>
      <Section title="Controles">
        <ul className="list-disc space-y-1 pl-5">
          <li>Clique em qualquer casa do tabuleiro para ver o título de posse.</li>
          <li>Clique nas suas propriedades para construir ou reparar.</li>
          <li>As fichas ao lado do seu nome também abrem os títulos.</li>
          <li>Esc fecha janelas.</li>
        </ul>
      </Section>
    </div>
  )
}

function Segmented<T extends string | number>({
  label,
  value,
  options,
  onChange,
  disabled,
}: {
  label: string
  value: T
  options: { value: T; label: string }[]
  onChange: (v: T) => void
  disabled?: boolean
}) {
  return (
    <fieldset className={cn('space-y-2', disabled && 'opacity-50')} disabled={disabled}>
      <legend className="font-display text-sm font-semibold uppercase tracking-wider text-navy">{label}</legend>
      <div className="flex gap-1 rounded-md border border-navy/20 bg-navy/5 p-1">
        {options.map((o) => (
          <button
            key={String(o.value)}
            type="button"
            onClick={() => onChange(o.value)}
            aria-pressed={value === o.value}
            className={cn(
              'flex-1 rounded px-2 py-1.5 text-sm font-semibold transition',
              value === o.value ? 'bg-navy text-gold shadow' : 'text-navy/70 hover:bg-navy/10',
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4">
      <span className="font-display text-sm font-semibold uppercase tracking-wider text-navy">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn('relative h-6 w-11 rounded-full transition', checked ? 'bg-navy' : 'bg-navy/25')}
      >
        <span
          className={cn(
            'absolute top-0.5 size-5 rounded-full bg-cream shadow transition-all',
            checked ? 'left-[22px] bg-gold' : 'left-0.5',
          )}
        />
      </button>
    </label>
  )
}

export function SettingsForm({
  settings,
  onChange,
  inGame,
}: {
  settings: GameSettings
  onChange: (s: GameSettings) => void
  inGame?: boolean
}) {
  const set = <K extends keyof GameSettings>(key: K, value: GameSettings[K]) => onChange({ ...settings, [key]: value })
  return (
    <div className="space-y-5">
      <Segmented
        label="Velocidade da animação"
        value={settings.speed}
        onChange={(v) => set('speed', v)}
        options={[
          { value: 'lenta', label: 'Lenta' },
          { value: 'normal', label: 'Normal' },
          { value: 'rapida', label: 'Rápida' },
        ]}
      />
      <Segmented
        label="Dinheiro inicial"
        value={settings.startMoney}
        onChange={(v) => set('startMoney', v)}
        disabled={inGame}
        options={[
          { value: 1000, label: '$1.000' },
          { value: 1500, label: '$1.500' },
          { value: 2000, label: '$2.000' },
        ]}
      />
      <Segmented
        label="Ritmo do colapso"
        value={settings.collapseRate}
        onChange={(v) => set('collapseRate', v)}
        disabled={inGame}
        options={[
          { value: 'lento', label: 'Lento' },
          { value: 'normal', label: 'Normal' },
          { value: 'rapido', label: 'Rápido' },
        ]}
      />
      {inGame && <p className="text-xs text-navy/60">Dinheiro inicial e ritmo do colapso valem para a próxima partida.</p>}
      <div className="space-y-3 border-t border-navy/15 pt-4">
        <Toggle label="Efeitos visuais" checked={settings.effects} onChange={(v) => set('effects', v)} />
        <Toggle label="Dicas durante o jogo" checked={settings.hints} onChange={(v) => set('hints', v)} />
      </div>
    </div>
  )
}

export function InfoModal({ open, initialTab, onClose, settings, onSettingsChange, inGame }: InfoModalProps) {
  const [tab, setTab] = useState<InfoTab>(initialTab)
  const [lastInitial, setLastInitial] = useState(initialTab)
  if (lastInitial !== initialTab) {
    setLastInitial(initialTab)
    setTab(initialTab)
  }

  return (
    <Modal open={open} onClose={onClose} label="Informações do jogo" className="w-full max-w-xl">
      <div className="paper animate-rise flex max-h-[86dvh] flex-col overflow-hidden rounded-lg border-2 border-navy shadow-[0_30px_80px_rgba(0,0,0,0.7)]">
        <div className="flex items-center justify-between bg-navy px-5 py-3">
          <h2 className="font-display text-xl font-bold uppercase tracking-wider text-cream">
            Cidade <span className="text-gold">em</span> Colapso
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-cream/70 transition hover:bg-cream/10 hover:text-cream"
            aria-label="Fechar"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="flex border-b-2 border-navy/80 bg-cream-dark" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'flex-1 px-2 py-2.5 font-display text-xs font-semibold uppercase tracking-wider transition sm:text-sm',
                tab === t.id ? 'bg-navy text-gold' : 'text-navy/70 hover:bg-navy/10',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="overflow-y-auto p-5" role="tabpanel">
          {tab === 'como-jogar' && <HowToPlay />}
          {tab === 'regras' && <Rules />}
          {tab === 'ajuda' && <Help />}
          {tab === 'config' && <SettingsForm settings={settings} onChange={onSettingsChange} inGame={inGame} />}
        </div>
      </div>
    </Modal>
  )
}
