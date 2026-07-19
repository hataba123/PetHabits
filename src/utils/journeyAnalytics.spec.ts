import { describe, expect, it } from 'vitest'

import type { Habit, HabitLog } from '../models'
import {
  buildHeatmap,
  buildJourneyInsights,
  calculateHabitAnalytics,
  calculateWeekComparison,
  formatMinutes,
} from './journeyAnalytics'

const habit: Habit = {
  id: 'habit-1',
  name: 'Đọc sách',
  description: '',
  identityStatement: '',
  identityCategory: 'knowledge',
  targetType: 'daily',
  targetCount: 1,
  minimumVersion: 'Đọc một trang.',
  experienceReward: 10,
  isActive: true,
  createdAt: new Date(2026, 5, 1).toISOString(),
  updatedAt: new Date(2026, 5, 1).toISOString(),
}

function logFor(day: number, habitId = habit.id, hour = 8, durationMinutes: number | null = 10): HabitLog {
  const completedAt = new Date(2026, 6, day, hour).toISOString()
  return {
    id: `log-${habitId}-${day}-${hour}`,
    habitId,
    completionType: 'full',
    completedAt,
    note: '',
    durationMinutes,
    experienceEarned: 10,
    createdAt: completedAt,
  }
}

describe('journeyAnalytics', () => {
  it('builds a heatmap with completion intensity and invested time', () => {
    const heatmap = buildHeatmap([logFor(19), logFor(18), logFor(18, habit.id, 9, 5)], 3, new Date(2026, 6, 19, 18))

    expect(heatmap.map((cell) => cell.completionCount)).toEqual([0, 2, 1])
    expect(heatmap.map((cell) => cell.intensity)).toEqual([0, 2, 1])
    expect(heatmap[1]?.durationMinutes).toBe(15)
  })

  it('calculates per-habit rate and streak independently', () => {
    const logs = [logFor(19), logFor(18), logFor(17), logFor(19, 'habit-2')]
    const stats = calculateHabitAnalytics(habit, logs, 3, new Date(2026, 6, 19, 18))

    expect(stats.completionRate).toBe(100)
    expect(stats.completedCount).toBe(3)
    expect(stats.currentStreak).toBe(3)
    expect(stats.totalDurationMinutes).toBe(30)
  })

  it('compares the current week with the previous week', () => {
    const comparison = calculateWeekComparison(
      [logFor(6), logFor(7), logFor(19)],
      new Date(2026, 6, 19, 18),
      1,
    )

    expect(comparison.current.completionCount).toBe(1)
    expect(comparison.previous.completionCount).toBe(2)
    expect(comparison.completionDelta).toBe(-1)
    expect(comparison.activeDayDelta).toBe(-1)
  })

  it('finds the strongest time and a habit often skipped on weekends', () => {
    const logs = [logFor(13, habit.id, 8), logFor(14, habit.id, 9), logFor(15, habit.id, 8)]
    const insights = buildJourneyInsights([habit], logs, new Date(2026, 6, 19, 18), 30)

    expect(insights.strongestTimeOfDay).toBe('morning')
    expect(insights.weekendSkip?.habitName).toBe('Đọc sách')
    expect(insights.weekendSkip?.skipRate).toBeGreaterThan(50)
  })

  it('formats invested time for a compact summary', () => {
    expect(formatMinutes(45)).toBe('45 phút')
    expect(formatMinutes(125)).toBe('2 giờ 5 phút')
  })
})
