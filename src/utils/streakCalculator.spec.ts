import { describe, expect, it } from 'vitest'

import type { HabitLog } from '../models'
import { calculateStreakStats } from './streakCalculator'

function logFor(day: number): HabitLog {
  return {
    id: `log-${day}`,
    habitId: 'habit-1',
    completionType: 'full',
    completedAt: new Date(2026, 6, day, 12).toISOString(),
    note: '',
    durationMinutes: null,
    experienceEarned: 10,
    createdAt: new Date(2026, 6, day, 12).toISOString(),
  }
}

describe('streakCalculator', () => {
  it('counts distinct active days instead of individual logs', () => {
    const stats = calculateStreakStats([logFor(19), logFor(19), logFor(18), logFor(17), logFor(15), logFor(14)], new Date(2026, 6, 19, 18))

    expect(stats.currentStreak).toBe(3)
    expect(stats.longestStreak).toBe(3)
    expect(stats.completedDaysLast7).toBe(5)
    expect(stats.completionRateLast7).toBe(71)
  })

  it('stops the current streak after a missed day without removing history', () => {
    const stats = calculateStreakStats([logFor(17), logFor(16)], new Date(2026, 6, 19, 18))

    expect(stats.currentStreak).toBe(0)
    expect(stats.longestStreak).toBe(2)
  })
})
