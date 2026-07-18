import type { HabitTargetType, IdentityCategory } from '../models'

export interface HabitInput {
  name: string
  description: string
  identityStatement: string
  identityCategory: IdentityCategory
  targetType: HabitTargetType
  targetCount: number
  minimumVersion: string
  experienceReward: number
}

export type ValidationErrors = Partial<Record<keyof HabitInput, string>>

export function validateHabitInput(input: HabitInput): ValidationErrors {
  const errors: ValidationErrors = {}
  const name = input.name.trim()
  const description = input.description.trim()
  const identityStatement = input.identityStatement.trim()
  const minimumVersion = input.minimumVersion.trim()

  if (!name) {
    errors.name = 'Hãy đặt tên cho thói quen.'
  } else if (name.length > 150) {
    errors.name = 'Tên thói quen tối đa 150 ký tự.'
  }

  if (description.length > 1000) {
    errors.description = 'Mô tả tối đa 1000 ký tự.'
  }

  if (!identityStatement) {
    errors.identityStatement = 'Hãy viết một câu về bản sắc bạn đang xây dựng.'
  } else if (identityStatement.length > 500) {
    errors.identityStatement = 'Câu bản sắc tối đa 500 ký tự.'
  }

  if (!minimumVersion) {
    errors.minimumVersion = 'Hãy mô tả phiên bản tối thiểu của hành động.'
  } else if (minimumVersion.length > 300) {
    errors.minimumVersion = 'Phiên bản tối thiểu tối đa 300 ký tự.'
  }

  if (!Number.isInteger(input.targetCount) || input.targetCount <= 0) {
    errors.targetCount = 'Số lần mục tiêu phải lớn hơn 0.'
  }

  if (!Number.isInteger(input.experienceReward) || input.experienceReward < 1 || input.experienceReward > 100) {
    errors.experienceReward = 'EXP phải là số nguyên từ 1 đến 100.'
  }

  return errors
}
