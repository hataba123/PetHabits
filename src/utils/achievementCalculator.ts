import type { HabitLog } from '../models'
import { achievementDefinitions } from '../constants/achievements'
import { getLocalDateKeyFromIso } from './dateUtils'
import { calculateStreakStats } from './streakCalculator'

export type AchievementId =
  | 'first-check-in'
  | 'seven-day-streak'
  | 'fifty-sessions'
  | 'habit-thirty-days'

export interface AchievementProgress {
  id: AchievementId
  title: string
  description: string
  encouragement: string
  icon: string
  current: number
  target: number
  isUnlocked: boolean
  reward: (typeof achievementDefinitions)[number]['reward']
}

function getMaximumHabitDayCount(logs: HabitLog[]): number {
  const daysByHabit = new Map<string, Set<string>>()

  for (const log of logs) {
    const dateKey = getLocalDateKeyFromIso(log.completedAt)

    if (!dateKey) {
      continue
    }

    const habitDays = daysByHabit.get(log.habitId) ?? new Set<string>()
    habitDays.add(dateKey)
    daysByHabit.set(log.habitId, habitDays)
  }

  return Math.max(0, ...Array.from(daysByHabit.values(), (days) => days.size))
}

export function calculateAchievementProgress(
  logs: HabitLog[],
  referenceDate: Date = new Date(),
): AchievementProgress[] {
  const streakStats = calculateStreakStats(logs, referenceDate)
  const currentValues: Record<AchievementId, number> = {
    'first-check-in': logs.length > 0 ? 1 : 0,
    'seven-day-streak': streakStats.longestStreak,
    'fifty-sessions': logs.length,
    'habit-thirty-days': getMaximumHabitDayCount(logs),
  }

  return achievementDefinitions.map((achievement) => {
    const current = Math.min(achievement.target, currentValues[achievement.id])

    return {
      ...achievement,
      current,
      isUnlocked: current >= achievement.target,
    }
  })
}
