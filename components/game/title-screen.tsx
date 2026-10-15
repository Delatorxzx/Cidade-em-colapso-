import Image from 'next/image'
import { BookOpen, CircleHelp, Play, ScrollText, Settings } from 'lucide-react'
import type { InfoTab } from './info-modal'

interface TitleScreenProps {
  onNewGame: () => void
  onOpenInfo: (tab: InfoTab) => void
}

export function TitleScreen({ onNewGame, onOpenInfo }: TitleScreenProps) {
  const secondary = [
    { label: 'Como jogar', icon: BookOpen, tab: 'como-jogar' as const },
    { label: 'Regras', icon: ScrollText, tab: 'regras' as const },
    { label: 'Configurações', icon: Settings, tab: 'config' as const },
    { label: 'Ajuda', icon: CircleHelp, tab: 'ajuda' as const },
  ]

  return (
    <main className="relative flex min-h-dvh items-end overflow-hidden bg-navy-deep md:items-center">
      <div className="absolute inset-0" aria-hidden>
        <Image
          src="/images/hero.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="animate-slow-zoom object-cover object-[70%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-deep via-navy-deep/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-transparent to-navy-deep/40" />
        <div
          className="emergency-light absolute inset-0"
          style={{ background: 'radial-gradient(circle at 55% 75%, rgba(201,74,69,0.18), transparent 35%)' }}
        />
      </div>

      <div className="relative z-10 w-full max-w-xl px-6 pb-12 pt-24 md:px-14 md:py-16">
        <p className="animate-rise font-display text-sm font-medium uppercase tracking-[0.5em] text-gold">
          Jogo de tabuleiro · 1 a 5 jogadores
        </p>
        <h1
          className="animate-rise mt-3 font-display text-6xl font-bold uppercase leading-[0.88] tracking-wide text-cream text-shadow-strong md:text-8xl"
          style={{ animationDelay: '80ms' }}
        >
          Cidade
          <br />
          <span className="text-gold">em</span> Colapso
        </h1>
        <p
          className="animate-rise mt-5 max-w-md text-pretty text-lg leading-relaxed text-cream/80"
          style={{ animationDelay: '160ms' }}
        >
          Compre bairros, construa e cobre aluguel enquanto a cidade desmorona ao seu redor. Quando o colapso chegar, só o
          maior patrimônio sobrevive.
        </p>

        <div className="animate-rise mt-9 flex flex-col gap-3" style={{ animationDelay: '240ms' }}>
          <button
            type="button"
            onClick={onNewGame}
            className="flex items-center justify-center gap-3 rounded-md bg-gold px-8 py-4 font-display text-xl font-bold uppercase tracking-[0.15em] text-navy shadow-[0_5px_0_#a9822f,0_20px_40px_rgba(0,0,0,0.5)] transition hover:brightness-110 active:translate-y-[3px] active:shadow-[0_2px_0_#a9822f] sm:self-start"
          >
            <Play className="size-5 fill-navy" aria-hidden />
            Novo jogo
          </button>
          <nav className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap" aria-label="Menu principal">
            {secondary.map(({ label, icon: Icon, tab }) => (
              <button
                key={tab}
                type="button"
                onClick={() => onOpenInfo(tab)}
                className="flex items-center justify-center gap-2 rounded-md border border-cream/25 bg-navy/50 px-4 py-2.5 font-display text-sm font-semibold uppercase tracking-wider text-cream/90 backdrop-blur-sm transition hover:border-gold/60 hover:text-cream"
              >
                <Icon className="size-4 text-gold" aria-hidden />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </main>
  )
}
