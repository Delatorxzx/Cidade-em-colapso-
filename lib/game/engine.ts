import {
  BOARD_SIZE,
  COLLAPSE_RENT_MULT,
  GROUPS,
  JAIL_FINE,
  JAIL_INDEX,
  PAWNS,
  RENT_MULTIPLIERS,
  SOLO_GOAL,
  SPACES,
  START_BONUS,
  formatMoney,
  groupMembers,
} from './board'
import { CRISIS_CARDS, EVENT_CARDS } from './cards'
import type { GameCard, GameSettings, GameState, PropertyState, Tone } from './types'

export type GameAction =
  | { type: 'ROLL'; dice: [number, number] }
  | { type: 'ROLL_DONE'; rand: number }
  | { type: 'STEP'; rand: number }
  | { type: 'BUY' }
  | { type: 'DECLINE' }
  | { type: 'APPLY_CARD'; rand: number }
  | { type: 'END_TURN'; rand: number }
  | { type: 'BUILD'; spaceId: number }
  | { type: 'PAY_JAIL' }
  | { type: 'DISMISS_LEVEL' }

const COLLAPSE_RATE: Record<GameSettings['collapseRate'], number> = {
  lento: 0.6,
  normal: 1,
  rapido: 1.8,
}

const POINTS_PER_LEVEL = 20

export function createGame(names: string[], settings: GameSettings): GameState {
  return {
    players: names.map((name, i) => ({
      id: i,
      name,
      color: PAWNS[i].color,
      pawn: PAWNS[i].kind,
      money: settings.startMoney,
      position: 0,
      inJail: false,
      jailTurns: 0,
      bankrupt: false,
    })),
    current: 0,
    props: SPACES.map(() => ({ owner: null, buildings: 0, damaged: false })),
    phase: 'await-roll',
    dice: [3, 4],
    rollId: 0,
    lastRollDoubles: false,
    doublesCount: 0,
    stepsLeft: 0,
    moveDir: 1,
    collapsePoints: 0,
    collapseLevel: 1,
    levelBanner: null,
    turnId: 1,
    emergencyFund: 0,
    activeCard: null,
    pendingBuy: null,
    log: [{ id: 0, text: `A partida começou. ${names[0]} abre o jogo.`, tone: 'neutral' }],
    logId: 1,
    gameOver: null,
    settings,
  }
}

function seeded(seed: number) {
  let s = Math.floor(seed * 2147483646) + 1
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

function log(state: GameState, text: string, tone: Tone = 'neutral') {
  state.log = [{ id: state.logId, text, tone }, ...state.log].slice(0, 30)
  state.logId += 1
}

export function ownsGroup(props: PropertyState[], spaceId: number, owner: number) {
  const group = SPACES[spaceId].group
  if (!group) return false
  return groupMembers(group).every((id) => props[id].owner === owner)
}

export function rentFor(state: GameState, spaceId: number): number {
  const space = SPACES[spaceId]
  const prop = state.props[spaceId]
  if (prop.owner === null) return 0
  let rent = 0
  if (space.kind === 'property') {
    const base = space.rent ?? 0
    if (prop.buildings > 0) rent = base * RENT_MULTIPLIERS[prop.buildings]
    else rent = ownsGroup(state.props, spaceId, prop.owner) ? base * 2 : base
  } else if (space.kind === 'transit') {
    const owned = SPACES.filter((s) => s.kind === 'transit' && state.props[s.id].owner === prop.owner).length
    rent = 25 * 2 ** (owned - 1)
  } else if (space.kind === 'utility') {
    const owned = SPACES.filter((s) => s.kind === 'utility' && state.props[s.id].owner === prop.owner).length
    rent = (owned === 2 ? 10 : 4) * (state.dice[0] + state.dice[1])
  }
  if (prop.damaged) rent = rent / 2
  return Math.round(rent * COLLAPSE_RENT_MULT[state.collapseLevel])
}

export function netWorth(state: GameState, playerId: number) {
  const player = state.players[playerId]
  let worth = player.money
  state.props.forEach((p, id) => {
    if (p.owner !== playerId) return
    const space = SPACES[id]
    worth += space.price ?? 0
    if (space.group) worth += p.buildings * GROUPS[space.group].buildCost
  })
  return worth
}

export function canBuild(state: GameState, spaceId: number) {
  const space = SPACES[spaceId]
  const prop = state.props[spaceId]
  const player = state.players[state.current]
  if (space.kind !== 'property' || !space.group) return { ok: false, reason: '' }
  if (prop.owner !== player.id) return { ok: false, reason: 'Não é sua propriedade.' }
  if (state.phase !== 'await-roll' && state.phase !== 'await-end')
    return { ok: false, reason: 'Construa no início ou fim do seu turno.' }
  if (!ownsGroup(state.props, spaceId, player.id))
    return { ok: false, reason: `Possua todo o grupo ${GROUPS[space.group].name}.` }
  if (!prop.damaged && prop.buildings >= 4) return { ok: false, reason: 'Já possui uma Torre.' }
  const cost = GROUPS[space.group].buildCost
  if (player.money < cost) return { ok: false, reason: 'Dinheiro insuficiente.' }
  return { ok: true, reason: '', cost, repair: prop.damaged }
}

function rankPlayers(state: GameState) {
  return state.players
    .map((p) => ({ playerId: p.id, worth: p.bankrupt ? -1 : netWorth(state, p.id) }))
    .sort((a, b) => b.worth - a.worth)
}

function endGame(state: GameState, reason: NonNullable<GameState['gameOver']>['reason']) {
  state.phase = 'game-over'
  state.gameOver = { reason, ranking: rankPlayers(state) }
}

function liquidate(state: GameState, playerId: number) {
  const player = state.players[playerId]
  const owned = state.props
    .map((p, id) => ({ p, id }))
    .filter(({ p }) => p.owner === playerId && p.buildings > 0)
    .sort((a, b) => b.p.buildings - a.p.buildings)
  for (const { p, id } of owned) {
    const group = SPACES[id].group
    if (!group) continue
    while (p.buildings > 0 && player.money < 0) {
      p.buildings -= 1
      player.money += GROUPS[group].buildCost / 2
    }
    if (player.money >= 0) break
  }
}

function charge(state: GameState, playerId: number, amount: number, to: number | null) {
  const player = state.players[playerId]
  player.money -= amount
  if (to !== null) state.players[to].money += amount
  if (player.money < 0) liquidate(state, playerId)
  if (player.money < 0) {
    if (to !== null) state.players[to].money += player.money
    player.bankrupt = true
    player.money = 0
    state.props.forEach((p) => {
      if (p.owner === playerId) {
        p.owner = null
        p.buildings = 0
      }
    })
    log(state, `${player.name} faliu e deixa a cidade.`, 'danger')
    const alive = state.players.filter((p) => !p.bankrupt)
    if (state.players.length === 1) endGame(state, 'solo-loss')
    else if (alive.length <= 1) endGame(state, 'bankruptcy')
  }
}

function addCollapse(state: GameState, delta: number, rand: () => number) {
  const before = state.collapseLevel
  state.collapsePoints = Math.max(0, Math.min(POINTS_PER_LEVEL * 4, state.collapsePoints + delta))
  const level = Math.min(5, 1 + Math.floor(state.collapsePoints / POINTS_PER_LEVEL))
  state.collapseLevel = Math.max(before, level)
  if (state.collapseLevel > before) {
    state.levelBanner = state.collapseLevel
    log(state, `Nível de Colapso subiu para ${state.collapseLevel}.`, 'danger')
    if (state.collapseLevel >= 3 && state.collapseLevel < 5) {
      const candidates = SPACES.filter((s) => s.kind === 'property' && !state.props[s.id].damaged)
      for (let i = 0; i < 2 && candidates.length; i++) {
        const pick = candidates.splice(Math.floor(rand() * candidates.length), 1)[0]
        const prop = state.props[pick.id]
        prop.damaged = true
        if (prop.buildings > 0) prop.buildings -= 1
        log(state, `${pick.name} foi danificada.`, 'bad')
      }
    }
    if (state.collapseLevel === 5) endGame(state, state.players.length === 1 ? 'solo-loss' : 'collapse')
  }
}

function drawCard(deck: 'evento' | 'crise', rand: () => number): GameCard {
  const cards = deck === 'evento' ? EVENT_CARDS : CRISIS_CARDS
  return cards[Math.floor(rand() * cards.length)]
}

function sendToJail(state: GameState) {
  const player = state.players[state.current]
  player.position = JAIL_INDEX
  player.inJail = true
  player.jailTurns = 0
  state.lastRollDoubles = false
  state.doublesCount = 0
  state.stepsLeft = 0
  log(state, `${player.name} foi levado para a Zona Interditada.`, 'bad')
}

function finishAction(state: GameState) {
  if (state.phase === 'game-over') return
  const player = state.players[state.current]
  if (player.bankrupt) {
    state.phase = 'await-end'
    return
  }
  if (state.lastRollDoubles && !player.inJail) {
    state.phase = 'await-roll'
    log(state, `Dupla! ${player.name} joga novamente.`, 'good')
  } else {
    state.phase = 'await-end'
  }
}

function resolveLanding(state: GameState, rand: () => number) {
  const player = state.players[state.current]
  const space = SPACES[player.position]
  const prop = state.props[space.id]

  switch (space.kind) {
    case 'property':
    case 'transit':
    case 'utility': {
      if (prop.owner === null) {
        state.pendingBuy = space.id
        state.phase = 'buy'
        return
      }
      if (prop.owner !== player.id && !state.players[prop.owner].bankrupt) {
        const rent = rentFor(state, space.id)
        const owner = state.players[prop.owner]
        log(state, `${player.name} pagou ${formatMoney(rent)} de aluguel a ${owner.name}.`, 'bad')
        charge(state, player.id, rent, owner.id)
      }
      break
    }
    case 'tax': {
      const tax = space.tax ?? 0
      log(state, `${player.name} pagou ${formatMoney(tax)} — ${space.name}.`, 'bad')
      state.emergencyFund += tax
      charge(state, player.id, tax, null)
      break
    }
    case 'evento':
    case 'crise': {
      state.activeCard = drawCard(space.kind, rand)
      state.phase = 'card'
      return
    }
    case 'shelter': {
      if (state.emergencyFund > 0) {
        log(state, `${player.name} recebeu o Fundo de Emergência: ${formatMoney(state.emergencyFund)}.`, 'good')
        player.money += state.emergencyFund
        state.emergencyFund = 0
      } else {
        log(state, `${player.name} descansa no Abrigo Público.`)
      }
      break
    }
    case 'gotojail': {
      sendToJail(state)
      break
    }
    default:
      break
  }
  finishAction(state)
}

function startMove(state: GameState, steps: number) {
  state.moveDir = steps >= 0 ? 1 : -1
  state.stepsLeft = Math.abs(steps)
  state.phase = 'moving'
}

function nextPlayer(state: GameState) {
  const total = state.players.length
  let next = state.current
  for (let i = 0; i < total; i++) {
    next = (next + 1) % total
    if (!state.players[next].bankrupt) break
  }
  state.current = next
}

export function gameReducer(prev: GameState, action: GameAction): GameState {
  if (prev.phase === 'game-over' && action.type !== 'DISMISS_LEVEL') return prev
  const state: GameState = structuredClone(prev)
  const player = state.players[state.current]

  switch (action.type) {
    case 'ROLL': {
      if (state.phase !== 'await-roll') return prev
      state.dice = action.dice
      state.rollId += 1
      state.phase = 'rolling'
      return state
    }
    case 'ROLL_DONE': {
      if (state.phase !== 'rolling') return prev
      const rand = seeded(action.rand)
      const [a, b] = state.dice
      const doubles = a === b
      log(state, `${player.name} tirou ${a} + ${b} = ${a + b}.`)
      if (player.inJail) {
        if (doubles) {
          player.inJail = false
          player.jailTurns = 0
          state.lastRollDoubles = false
          log(state, `${player.name} tirou dupla e saiu da Zona Interditada.`, 'good')
        } else {
          player.jailTurns += 1
          if (player.jailTurns >= 3) {
            log(state, `${player.name} pagou ${formatMoney(JAIL_FINE)} após 3 tentativas.`, 'bad')
            player.inJail = false
            player.jailTurns = 0
            charge(state, player.id, JAIL_FINE, null)
            state.emergencyFund += JAIL_FINE
            if (isOver(state)) return state
          } else {
            log(state, `${player.name} continua na Zona Interditada.`)
            state.lastRollDoubles = false
            state.phase = 'await-end'
            return state
          }
        }
        state.lastRollDoubles = false
        startMove(state, a + b)
        return state
      }
      state.lastRollDoubles = doubles
      if (doubles) {
        state.doublesCount += 1
        if (state.doublesCount >= 3) {
          log(state, `Três duplas seguidas! Excesso de velocidade.`, 'bad')
          sendToJail(state)
          state.phase = 'await-end'
          void rand
          return state
        }
      }
      startMove(state, a + b)
      return state
    }
    case 'STEP': {
      if (state.phase !== 'moving') return prev
      const next = (player.position + state.moveDir + BOARD_SIZE) % BOARD_SIZE
      player.position = next
      state.stepsLeft -= 1
      if (next === 0 && state.moveDir === 1) {
        player.money += START_BONUS
        log(state, `${player.name} passou pelo Início e recebeu ${formatMoney(START_BONUS)}.`, 'good')
      }
      if (state.stepsLeft <= 0) resolveLanding(state, seeded(action.rand))
      return state
    }
    case 'BUY': {
      if (state.phase !== 'buy' || state.pendingBuy === null) return prev
      const space = SPACES[state.pendingBuy]
      const price = space.price ?? 0
      if (player.money < price) return prev
      player.money -= price
      state.props[space.id].owner = player.id
      log(state, `${player.name} comprou ${space.name} por ${formatMoney(price)}.`, 'good')
      state.pendingBuy = null
      finishAction(state)
      return state
    }
    case 'DECLINE': {
      if (state.phase !== 'buy') return prev
      state.pendingBuy = null
      finishAction(state)
      return state
    }
    case 'APPLY_CARD': {
      if (state.phase !== 'card' || !state.activeCard) return prev
      const rand = seeded(action.rand)
      const card = state.activeCard
      const fx = card.effect
      state.activeCard = null
      log(state, `${card.deck === 'crise' ? 'Crise' : 'Evento'}: ${card.title}.`, card.deck === 'crise' ? 'bad' : 'good')

      if (fx.money) {
        if (fx.money > 0) player.money += fx.money
        else {
          state.emergencyFund += -fx.money
          charge(state, player.id, -fx.money, null)
        }
      }
      if (fx.collectEach) {
        state.players.forEach((other) => {
          if (other.id !== player.id && !other.bankrupt && state.phase !== 'game-over')
            charge(state, other.id, fx.collectEach!, player.id)
        })
      }
      if (fx.perBuilding) {
        const count = state.props.reduce((n, p) => (p.owner === player.id ? n + p.buildings : n), 0)
        if (count > 0) {
          state.emergencyFund += count * fx.perBuilding
          charge(state, player.id, count * fx.perBuilding, null)
        }
      }
      if (fx.destroyBuilding) {
        const built = state.props.map((p, id) => ({ p, id })).filter(({ p }) => p.owner === player.id && p.buildings > 0)
        if (built.length) {
          const target = built[Math.floor(rand() * built.length)]
          target.p.buildings -= 1
          log(state, `Uma construção em ${SPACES[target.id].name} foi destruída.`, 'danger')
        }
      }
      if (fx.collapse) addCollapse(state, fx.collapse, rand)
      if (isOver(state)) return state

      if (fx.goJail) {
        sendToJail(state)
        state.phase = 'await-end'
        return state
      }
      if (fx.moveTo !== undefined) {
        const steps = (fx.moveTo - player.position + BOARD_SIZE) % BOARD_SIZE || BOARD_SIZE
        startMove(state, steps)
        return state
      }
      if (fx.nearestTransit) {
        let steps = 1
        while (SPACES[(player.position + steps) % BOARD_SIZE].kind !== 'transit') steps++
        startMove(state, steps)
        return state
      }
      if (fx.moveBy) {
        startMove(state, fx.moveBy)
        return state
      }
      finishAction(state)
      return state
    }
    case 'BUILD': {
      const check = canBuild(state, action.spaceId)
      if (!check.ok || !check.cost) return prev
      const prop = state.props[action.spaceId]
      player.money -= check.cost
      if (check.repair) {
        prop.damaged = false
        log(state, `${player.name} reparou ${SPACES[action.spaceId].name}.`, 'good')
      } else {
        prop.buildings += 1
        log(
          state,
          `${player.name} construiu ${prop.buildings === 4 ? 'uma Torre' : 'uma casa'} em ${SPACES[action.spaceId].name}.`,
          'good',
        )
      }
      return state
    }
    case 'PAY_JAIL': {
      if (state.phase !== 'await-roll' || !player.inJail || player.money < JAIL_FINE) return prev
      player.money -= JAIL_FINE
      state.emergencyFund += JAIL_FINE
      player.inJail = false
      player.jailTurns = 0
      log(state, `${player.name} pagou ${formatMoney(JAIL_FINE)} para sair da Zona Interditada.`)
      return state
    }
    case 'END_TURN': {
      if (state.phase !== 'await-end') return prev
      const rand = seeded(action.rand)
      if (state.players.length === 1 && netWorth(state, player.id) >= SOLO_GOAL) {
        endGame(state, 'solo-win')
        return state
      }
      addCollapse(state, COLLAPSE_RATE[state.settings.collapseRate] * (0.6 + rand() * 0.8), rand)
      if (isOver(state)) return state
      nextPlayer(state)
      state.doublesCount = 0
      state.lastRollDoubles = false
      state.turnId += 1
      state.phase = 'await-roll'
      return state
    }
    case 'DISMISS_LEVEL': {
      if (prev.levelBanner === null) return prev
      return { ...prev, levelBanner: null }
    }
    default:
      return prev
  }
}

function isOver(state: GameState) {
  return state.phase === 'game-over'
}
