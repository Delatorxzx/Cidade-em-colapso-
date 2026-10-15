export type GroupId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H'

export type SpaceKind =
  | 'start'
  | 'property'
  | 'transit'
  | 'utility'
  | 'tax'
  | 'evento'
  | 'crise'
  | 'jail'
  | 'shelter'
  | 'gotojail'

export type IconKey =
  | 'house'
  | 'store'
  | 'factory'
  | 'warehouse'
  | 'trees'
  | 'landmark'
  | 'anchor'
  | 'ship'
  | 'hospital'
  | 'building'
  | 'building2'
  | 'hotel'
  | 'castle'
  | 'waves'
  | 'crown'
  | 'gem'
  | 'train'
  | 'zap'
  | 'droplets'
  | 'receipt'
  | 'scroll'
  | 'siren'
  | 'flag'
  | 'lock'
  | 'tent'
  | 'megaphone'

export interface Space {
  id: number
  kind: SpaceKind
  name: string
  icon: IconKey
  group?: GroupId
  price?: number
  rent?: number
  tax?: number
}

export interface PropertyState {
  owner: number | null
  buildings: number
  damaged: boolean
}

export type PawnKind = 'engenheira' | 'empresario' | 'medica' | 'mecanico' | 'reporter'

export interface Player {
  id: number
  name: string
  color: string
  pawn: PawnKind
  money: number
  position: number
  inJail: boolean
  jailTurns: number
  bankrupt: boolean
}

export interface CardEffect {
  money?: number
  collapse?: number
  moveTo?: number
  moveBy?: number
  goJail?: boolean
  collectEach?: number
  perBuilding?: number
  destroyBuilding?: boolean
  nearestTransit?: boolean
}

export interface GameCard {
  id: string
  deck: 'evento' | 'crise'
  title: string
  text: string
  effect: CardEffect
}

export type Phase =
  | 'await-roll'
  | 'rolling'
  | 'moving'
  | 'buy'
  | 'card'
  | 'await-end'
  | 'game-over'

export type Tone = 'neutral' | 'good' | 'bad' | 'danger'

export interface LogEntry {
  id: number
  text: string
  tone: Tone
}

export interface GameOver {
  reason: 'collapse' | 'bankruptcy' | 'solo-win' | 'solo-loss'
  ranking: { playerId: number; worth: number }[]
}

export interface GameSettings {
  speed: 'lenta' | 'normal' | 'rapida'
  startMoney: number
  collapseRate: 'lento' | 'normal' | 'rapido'
  effects: boolean
  hints: boolean
}

export interface GameState {
  players: Player[]
  current: number
  props: PropertyState[]
  phase: Phase
  dice: [number, number]
  rollId: number
  lastRollDoubles: boolean
  doublesCount: number
  stepsLeft: number
  moveDir: 1 | -1
  collapsePoints: number
  collapseLevel: number
  levelBanner: number | null
  turnId: number
  emergencyFund: number
  activeCard: GameCard | null
  pendingBuy: number | null
  log: LogEntry[]
  logId: number
  gameOver: GameOver | null
  settings: GameSettings
}
