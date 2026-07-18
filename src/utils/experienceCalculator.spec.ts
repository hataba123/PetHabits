import { describe, expect, it } from 'vitest'

import type { Habit } from '../models'
import { calculateExperience } from './experienceCalculator'

const habit = {
  experienceReward: 9,
} as Habit

describe('experienceCalculator', () => {
  it('awards the full reward for a full completion', () => {
    expect(calculateExperience(habit, 'full')).toBe(9)
  })

  it('awards floored half reward with a minimum of one', () => {
    expect(calculateExperience(habit, 'minimum')).toBe(4)
    expect(calculateExperience({ experienceReward: 1 } as Habit, 'minimum')).toBe(1)
  })
})
