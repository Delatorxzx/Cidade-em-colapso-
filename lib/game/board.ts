import type { GroupId, PawnKind, Space } from './types'

export const BOARD_SIZE = 32
export const START_BONUS = 200
export const JAIL_INDEX = 8
export const JAIL_FINE = 50
export const SOLO_GOAL = 2500

export const GROUPS: Record<GroupId, { name: string; color: string; buildCost: number }> = {
  A: { name: 'Periferia', color: '#8B6B4A', buildCost: 50 },
  B: { name: 'Zona Industrial', color: '#5B7C99', buildCost: 50 },
  C: { name: 'Centro Velho', color: '#3E7C7A', buildCost: 100 },
  D: { name: 'Orla Portuária', color: '#6E7F4E', buildCost: 100 },
  E: { name: 'Distrito Médico', color: '#7A5C7E', buildCost: 150 },
  F: { name: 'Skyline', color: '#2F5D8A', buildCost: 150 },
  G: { name: 'Bairro Nobre', color: '#B08D3C', buildCost: 200 },
  H: { name: 'Alta Cúpula', color: '#4A4E69', buildCost: 200 },
}

export const SPACES: Space[] = [
  { id: 0, kind: 'start', name: 'Início', icon: 'flag' },
  { id: 1, kind: 'property', name: 'Vila Operária', icon: 'house', group: 'A', price: 60, rent: 4 },
  { id: 2, kind: 'evento', name: 'Evento', icon: 'megaphone' },
  { id: 3, kind: 'property', name: 'Beco do Mercado', icon: 'store', group: 'A', price: 60, rent: 4 },
  { id: 4, kind: 'tax', name: 'Imposto de Emergência', icon: 'receipt', tax: 150 },
  { id: 5, kind: 'transit', name: 'Metrô Linha Norte', icon: 'train', price: 200 },
  { id: 6, kind: 'property', name: 'Rua das Fábricas', icon: 'factory', group: 'B', price: 100, rent: 6 },
  { id: 7, kind: 'property', name: 'Bairro Ferroviário', icon: 'warehouse', group: 'B', price: 120, rent: 8 },
  { id: 8, kind: 'jail', name: 'Zona Interditada', icon: 'lock' },
  { id: 9, kind: 'property', name: 'Praça Central', icon: 'trees', group: 'C', price: 140, rent: 10 },
  { id: 10, kind: 'utility', name: 'Usina Elétrica', icon: 'zap', price: 150 },
  { id: 11, kind: 'property', name: 'Av. do Comércio', icon: 'landmark', group: 'C', price: 160, rent: 12 },
  { id: 12, kind: 'crise', name: 'Crise', icon: 'siren' },
  { id: 13, kind: 'property', name: 'Porto Velho', icon: 'anchor', group: 'D', price: 180, rent: 14 },
  { id: 14, kind: 'transit', name: 'Metrô Linha Leste', icon: 'train', price: 200 },
  { id: 15, kind: 'property', name: 'Docas do Sul', icon: 'ship', group: 'D', price: 200, rent: 16 },
  { id: 16, kind: 'shelter', name: 'Abrigo Público', icon: 'tent' },
  { id: 17, kind: 'property', name: 'Distrito Hospitalar', icon: 'hospital', group: 'E', price: 220, rent: 18 },
  { id: 18, kind: 'evento', name: 'Evento', icon: 'megaphone' },
  { id: 19, kind: 'property', name: 'Centro Financeiro', icon: 'building2', group: 'E', price: 240, rent: 20 },
  { id: 20, kind: 'utility', name: 'Estação de Água', icon: 'droplets', price: 150 },
  { id: 21, kind: 'property', name: 'Torre Panorama', icon: 'building', group: 'F', price: 260, rent: 22 },
  { id: 22, kind: 'transit', name: 'Metrô Linha Sul', icon: 'train', price: 200 },
  { id: 23, kind: 'property', name: 'Jardins Altos', icon: 'hotel', group: 'F', price: 280, rent: 24 },
  { id: 24, kind: 'gotojail', name: 'Toque de Recolher', icon: 'siren' },
  { id: 25, kind: 'property', name: 'Alameda Imperial', icon: 'castle', group: 'G', price: 300, rent: 26 },
  { id: 26, kind: 'crise', name: 'Crise', icon: 'siren' },
  { id: 27, kind: 'property', name: 'Bulevar do Rio', icon: 'waves', group: 'G', price: 320, rent: 28 },
  { id: 28, kind: 'transit', name: 'Metrô Linha Oeste', icon: 'train', price: 200 },
  { id: 29, kind: 'tax', name: 'Taxa de Luxo', icon: 'gem', tax: 100 },
  { id: 30, kind: 'property', name: 'Colina dos Magnatas', icon: 'crown', group: 'H', price: 350, rent: 35 },
  { id: 31, kind: 'property', name: 'Palácio do Governo', icon: 'landmark', group: 'H', price: 400, rent: 50 },
]

export const RENT_MULTIPLIERS = [1, 5, 14, 32, 45]
export const BUILDING_LABELS = ['Terreno', '1 Casa', '2 Casas', '3 Casas', 'Torre']
export const COLLAPSE_RENT_MULT = [1, 1, 1.15, 1.35, 1.6, 1.6]

export const COLLAPSE_LEVELS = [
  { level: 1, name: 'Estável', text: 'A cidade funciona, com rachaduras discretas.' },
  { level: 2, name: 'Tensão', text: 'Falhas de energia e protestos isolados.' },
  { level: 3, name: 'Alerta', text: 'Regiões danificadas. Aluguéis sobem 35%.' },
  { level: 4, name: 'Emergência', text: 'Sirenes por toda parte. Aluguéis sobem 60%.' },
  { level: 5, name: 'Colapso Total', text: 'A cidade parou. Vence o maior patrimônio.' },
]

export const PAWNS: { kind: PawnKind; label: string; color: string }[] = [
  { kind: 'engenheira', label: 'Engenheira', color: '#D4A84F' },
  { kind: 'empresario', label: 'Empresário', color: '#F2E6C9' },
  { kind: 'medica', label: 'Médica', color: '#4FB3A9' },
  { kind: 'mecanico', label: 'Mecânico', color: '#7FA3D6' },
  { kind: 'reporter', label: 'Repórter', color: '#B98BC0' },
]

const TRACKS = [1.6, 1, 1, 1, 1, 1, 1, 1, 1.6]
const TRACK_TOTAL = TRACKS.reduce((a, b) => a + b, 0)

export function gridPosition(index: number): { col: number; row: number; side: 'corner' | 'bottom' | 'left' | 'top' | 'right' } {
  if (index === 0) return { col: 8, row: 8, side: 'corner' }
  if (index < 8) return { col: 8 - index, row: 8, side: 'bottom' }
  if (index === 8) return { col: 0, row: 8, side: 'corner' }
  if (index < 16) return { col: 0, row: 8 - (index - 8), side: 'left' }
  if (index === 16) return { col: 0, row: 0, side: 'corner' }
  if (index < 24) return { col: index - 16, row: 0, side: 'top' }
  if (index === 24) return { col: 8, row: 0, side: 'corner' }
  return { col: 8, row: index - 24, side: 'right' }
}

function trackCenter(i: number) {
  let offset = 0
  for (let k = 0; k < i; k++) offset += TRACKS[k]
  return ((offset + TRACKS[i] / 2) / TRACK_TOTAL) * 100
}

export function cellCenterPercent(index: number) {
  const { col, row } = gridPosition(index)
  return { x: trackCenter(col), y: trackCenter(row) }
}

export function groupMembers(group: GroupId) {
  return SPACES.filter((s) => s.group === group).map((s) => s.id)
}

export function formatMoney(value: number) {
  return `$${Math.round(value).toLocaleString('pt-BR')}`
}
