import type { CompanionGrowthStage } from '../models'

export interface CompanionProgression {
  level: number
  currentExperience: number
  experienceToNextLevel: number
  growthStage: CompanionGrowthStage
}

export function getExperienceRequiredForLevel(level: number): number {
  return 100 + Math.max(1, level) * 50
}

export function getGrowthStage(level: number): CompanionGrowthStage {
  if (level >= 50) {
    return 'evolved'
  }

  if (level >= 30) {
    return 'adult'
  }

  if (level >= 15) {
    return 'teen'
  }

  if (level >= 5) {
    return 'baby'
  }

  return 'egg'
}

export function calculateCompanionProgression(totalExperience: number): CompanionProgression {
  let remainingExperience = Math.max(0, Math.floor(totalExperience))
  let level = 1
  let experienceToNextLevel = getExperienceRequiredForLevel(level)

  while (remainingExperience >= experienceToNextLevel) {
    remainingExperience -= experienceToNextLevel
    level += 1
    experienceToNextLevel = getExperienceRequiredForLevel(level)
  }

  return {
    level,
    currentExperience: remainingExperience,
    experienceToNextLevel,
    growthStage: getGrowthStage(level),
  }
}
