import { describe, expect, it } from 'vitest'

import type { HabitLog } from '../models'
import { calculateAchievementProgress } from './achievementCalculator'

function createLog(habitId: string, date: Date, index: number): HabitLog {
  return {
    id: `log-${index}`,
    habitId,
    completionType: 'full',
    completedAt: date.toISOString(),
    note: '',
    durationMinutes: null,
    experienceEarned: 10,
    createdAt: date.toISOString(),
  }
}

describe('achievementCalculator', () => {
  it('unlocks the first check-in and keeps later rewards locked', () => {
    const referenceDate = new Date(2026, 6, 19, 12)
    const progress = calculateAchievementProgress([createLog('habit-1', referenceDate, 1)], referenceDate)

    expect(progress.find((achievement) => achievement.id === 'first-check-in')?.isUnlocked).toBe(true)
    expect(progress.find((achievement) => achievement.id === 'fifty-sessions')?.current).toBe(1)
    expect(progress.find((achievement) => achievement.id === 'seven-day-streak')?.isUnlocked).toBe(false)
  })

  it('uses the longest streak and unique habit days for milestones', () => {
    const referenceDate = new Date(2026, 6, 19, 12)
    const logs = Array.from({ length: 30 }, (_, index) => {
      const date = new Date(2026, 5, 20 + index, 12)
      return createLog('habit-1', date, index)
    })

    const progress = calculateAchievementProgress(logs, referenceDate)

    expect(progress.find((achievement) => achievement.id === 'seven-day-streak')?.isUnlocked).toBe(true)
    expect(progress.find((achievement) => achievement.id === 'habit-thirty-days')?.isUnlocked).toBe(true)
    expect(progress.find((achievement) => achievement.id === 'fifty-sessions')?.current).toBe(30)
  })
})
