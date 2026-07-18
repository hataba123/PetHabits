import { describe, expect, it } from 'vitest'

import type { Habit, HabitLog } from '../models'
import { calculateIdentityScores } from './identityCalculator'

const habit = { id: 'habit-1', identityCategory: 'health' } as Habit
const logs = [
  { habitId: 'habit-1', completionType: 'full' },
  { habitId: 'habit-1', completionType: 'minimum' },
] as HabitLog[]

describe('identityCalculator', () => {
  it('derives points and relative percentage from logs', () => {
    const healthScore = calculateIdentityScores([habit], logs).find((score) => score.category === 'health')

    expect(healthScore?.points).toBe(1.5)
    expect(healthScore?.percentage).toBe(100)
  })
})
