import type { IdentityCategory } from '../models'

export const identityCategoryLabels: Record<IdentityCategory, string> = {
  knowledge: 'Trí tuệ',
  discipline: 'Kỷ luật',
  health: 'Sức khỏe',
  calm: 'Bình tĩnh',
  creativity: 'Sáng tạo',
}

export const identityCategories: IdentityCategory[] = [
  'knowledge',
  'discipline',
  'health',
  'calm',
  'creativity',
]
