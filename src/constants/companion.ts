import type {
  CompanionAnimal,
  CompanionShape,
  LegacyCompanionShape,
} from '../models'

export const companionAnimalOptions: ReadonlyArray<{
  value: CompanionAnimal
  label: string
  description: string
}> = [
  { value: 'cat', label: 'Mèo Miu', description: 'Tò mò và tinh nghịch' },
  { value: 'fox', label: 'Cáo Nâu', description: 'Nhanh nhẹn, giàu năng lượng' },
  { value: 'bunny', label: 'Thỏ Bông', description: 'Dịu dàng và luôn khích lệ' },
  { value: 'panda', label: 'Gấu trúc Mây', description: 'Bình tĩnh và bền bỉ' },
  { value: 'dog', label: 'Cún Nắng', description: 'Trung thành và tràn đầy niềm vui' },
  { value: 'koala', label: 'Koala Gió', description: 'Êm dịu, chậm rãi và an yên' },
  { value: 'penguin', label: 'Cánh cụt Băng', description: 'Ấm áp, kiên trì và đáng tin' },
  { value: 'otter', label: 'Rái cá Suối', description: 'Tinh nghịch, gần gũi và lạc quan' },
]

const legacyShapeToAnimal: Record<LegacyCompanionShape, CompanionAnimal> = {
  orb: 'cat',
  'soft-square': 'bunny',
  crystal: 'fox',
  leaf: 'panda',
}

export function isCompanionAnimal(value: unknown): value is CompanionAnimal {
  return companionAnimalOptions.some((option) => option.value === value)
}

export function isCompanionShape(value: unknown): value is CompanionShape {
  return isCompanionAnimal(value) || (typeof value === 'string' && Object.hasOwn(legacyShapeToAnimal, value))
}

export function toCompanionAnimal(value: CompanionShape): CompanionAnimal {
  return isCompanionAnimal(value) ? value : legacyShapeToAnimal[value]
}
