import { describe, expect, it } from 'vitest'

import type { HabitLog } from '../models'
import { calculateTotalExperience } from './experienceCalculator'
import { validateHabitInput } from './validators'

describe('core application behavior', () => {
  it('rebuilds total experience from the log history', () => {
    const logs = [
      { experienceEarned: 10 },
      { experienceEarned: 5 },
      { experienceEarned: 25 },
    ] as HabitLog[]

    expect(calculateTotalExperience(logs)).toBe(40)
  })

  it('keeps habit validation errors attached to the relevant fields', () => {
    const errors = validateHabitInput({
      name: '',
      description: '',
      identityStatement: '',
      identityCategory: 'discipline',
      targetType: 'daily',
      targetCount: 0,
      minimumVersion: '',
      experienceReward: 101,
    })

    expect(errors.name).toBeTruthy()
    expect(errors.identityStatement).toBeTruthy()
    expect(errors.targetCount).toBeTruthy()
    expect(errors.experienceReward).toBeTruthy()
  })
})
