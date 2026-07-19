import { describe, expect, it } from 'vitest'

import type { HabitLog } from '../models'
import { calculateCompanionHappiness } from './happinessCalculator'

function createLog(date: Date, index: number): HabitLog {
  return {
    id: `log-${index}`,
    habitId: 'habit-1',
    completionType: 'minimum',
    completedAt: date.toISOString(),
    note: '',
    durationMinutes: null,
    experienceEarned: 5,
    createdAt: date.toISOString(),
  }
}

describe('happinessCalculator', () => {
  it('starts at a welcoming baseline without check-ins', () => {
    expect(calculateCompanionHappiness([], new Date(2026, 6, 19, 12))).toBe(50)
  })

  it('rewards consistent days and softens the effect of one missed day', () => {
    const referenceDate = new Date(2026, 6, 19, 12)
    const consistentLogs = Array.from({ length: 7 }, (_, index) => createLog(new Date(2026, 6, 13 + index, 12), index))
    const oneMissedDayLogs = consistentLogs.slice(0, 6)
    const consistentHappiness = calculateCompanionHappiness(consistentLogs, referenceDate)
    const afterOneMissedDay = calculateCompanionHappiness(oneMissedDayLogs, referenceDate)

    expect(consistentHappiness).toBeGreaterThan(50)
    expect(consistentHappiness - afterOneMissedDay).toBeLessThanOrEqual(6)
  })
})
