import { describe, expect, it } from 'vitest'

import {
  calculateCompanionProgression,
  getExperienceRequiredForLevel,
  getGrowthStage,
} from './progressionCalculator'

describe('progressionCalculator', () => {
  it('uses the required experience formula', () => {
    expect(getExperienceRequiredForLevel(1)).toBe(150)
    expect(getExperienceRequiredForLevel(4)).toBe(300)
  })

  it('supports multiple level-ups from one experience reward', () => {
    const progression = calculateCompanionProgression(150 + 200 + 250)

    expect(progression.level).toBe(4)
    expect(progression.currentExperience).toBe(0)
    expect(progression.experienceToNextLevel).toBe(300)
  })

  it('maps levels to growth stages', () => {
    expect(getGrowthStage(1)).toBe('egg')
    expect(getGrowthStage(5)).toBe('baby')
    expect(getGrowthStage(15)).toBe('teen')
    expect(getGrowthStage(30)).toBe('adult')
    expect(getGrowthStage(50)).toBe('evolved')
  })
})
