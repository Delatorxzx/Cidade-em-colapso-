import type { GameCard } from './types'

export const EVENT_CARDS: GameCard[] = [
  { id: 'e1', deck: 'evento', title: 'Investimento Estrangeiro', text: 'Um fundo internacional aposta na reconstrução. Receba $150.', effect: { money: 150 } },
  { id: 'e2', deck: 'evento', title: 'Restituição de Imposto', text: 'A prefeitura devolve cobranças indevidas. Receba $80.', effect: { money: 80 } },
  { id: 'e3', deck: 'evento', title: 'Mutirão Comunitário', text: 'Vizinhos se unem para consertar ruas. O colapso recua.', effect: { collapse: -6 } },
  { id: 'e4', deck: 'evento', title: 'Volta ao Início', text: 'Avance até o Início e receba o bônus de $200.', effect: { moveTo: 0 } },
  { id: 'e5', deck: 'evento', title: 'Multa de Trânsito', text: 'Avançou o sinal no meio do caos. Pague $50.', effect: { money: -50 } },
  { id: 'e6', deck: 'evento', title: 'Linha Expressa', text: 'Avance até a estação de metrô mais próxima.', effect: { nearestTransit: true } },
  { id: 'e7', deck: 'evento', title: 'Festival na Praça', text: 'Você organiza o festival. Cada jogador paga $20 a você.', effect: { collectEach: 20 } },
  { id: 'e8', deck: 'evento', title: 'Seguro Residencial', text: 'O seguro cobre seus prejuízos. Receba $100.', effect: { money: 100 } },
  { id: 'e9', deck: 'evento', title: 'Vistoria Urbana', text: 'Reforce suas estruturas. Pague $25 por construção.', effect: { perBuilding: 25 } },
  { id: 'e10', deck: 'evento', title: 'Atalho pela Avenida', text: 'O trânsito liberou. Avance 3 casas.', effect: { moveBy: 3 } },
]

export const CRISIS_CARDS: GameCard[] = [
  { id: 'c1', deck: 'crise', title: 'Apagão Geral', text: 'A rede elétrica cai em toda a cidade. Pague $40.', effect: { money: -40, collapse: 10 } },
  { id: 'c2', deck: 'crise', title: 'Enchente no Porto', text: 'A água sobe pelas ruas. Recue 3 casas.', effect: { moveBy: -3, collapse: 8 } },
  { id: 'c3', deck: 'crise', title: 'Greve dos Transportes', text: 'Ônibus e metrô param. A tensão aumenta.', effect: { collapse: 6 } },
  { id: 'c4', deck: 'crise', title: 'Saques no Centro', text: 'Lojas são invadidas. Pague $100 em prejuízos.', effect: { money: -100, collapse: 5 } },
  { id: 'c5', deck: 'crise', title: 'Toque de Recolher', text: 'Você foi pego na rua. Vá direto para a Zona Interditada.', effect: { goJail: true, collapse: 4 } },
  { id: 'c6', deck: 'crise', title: 'Ajuda Humanitária', text: 'Comboios chegam com suprimentos. Receba $120.', effect: { money: 120, collapse: -4 } },
  { id: 'c7', deck: 'crise', title: 'Incêndio em Edifício', text: 'Uma de suas construções é destruída pelo fogo.', effect: { destroyBuilding: true, collapse: 8 } },
  { id: 'c8', deck: 'crise', title: 'Queda da Ponte', text: 'A principal ligação da cidade desaba.', effect: { collapse: 12 } },
  { id: 'c9', deck: 'crise', title: 'Mercado Paralelo', text: 'Você lucra com a escassez. Receba $200.', effect: { money: 200, collapse: 6 } },
  { id: 'c10', deck: 'crise', title: 'Força-Tarefa', text: 'Você financia equipes de resgate. Pague $60.', effect: { money: -60, collapse: -8 } },
]
