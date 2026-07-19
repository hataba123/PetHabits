import type { CompanionGrowthStage, CompanionShape } from '../models'

export const companionShapeOptions: ReadonlyArray<{
  value: CompanionShape
  label: string
  description: string
}> = [
  { value: 'orb', label: 'Tròn', description: 'Ấm áp và cân bằng' },
  { value: 'soft-square', label: 'Mềm', description: 'Gọn gàng, thân thiện' },
  { value: 'crystal', label: 'Tinh thể', description: 'Sắc sảo và nổi bật' },
  { value: 'leaf', label: 'Lá', description: 'Tự nhiên, nhẹ nhàng' },
]

export const companionStageEmojis: Record<CompanionGrowthStage, string> = {
  egg: '🥚',
  baby: '🐣',
  teen: '🐾',
  adult: '🦊',
  evolved: '✨',
}

export function isCompanionShape(value: unknown): value is CompanionShape {
  return companionShapeOptions.some((option) => option.value === value)
}
