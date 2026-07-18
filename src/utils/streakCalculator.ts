import type { HabitLog } from '../models'
import { getLocalDateKey, getLocalDateKeyFromIso } from './dateUtils'

export interface StreakStats {
  currentStreak: number
  longestStreak: number
  completedDaysLast7: number
  completedDaysLast30: number
  completionRateLast7: number
  completionRateLast30: number
}

function dateFromKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function shiftDateKey(dateKey: string, offset: number): string {
  const date = dateFromKey(dateKey)
  date.setDate(date.getDate() + offset)
  return getLocalDateKey(date)
}

function dayDifference(firstDateKey: string, secondDateKey: string): number {
  const difference = dateFromKey(secondDateKey).getTime() - dateFromKey(firstDateKey).getTime()
  return Math.round(difference / 86_400_000)
}

export function getActiveDayKeys(logs: HabitLog[]): string[] {
  return Array.from(
    new Set(
      logs
        .map((log) => getLocalDateKeyFromIso(log.completedAt))
        .filter((dateKey): dateKey is string => dateKey !== null),
    ),
  ).sort()
}

export function calculateStreakStats(logs: HabitLog[], referenceDate: Date = new Date()): StreakStats {
  const activeDayKeys = getActiveDayKeys(logs)
  const activeDays = new Set(activeDayKeys)
  const todayKey = getLocalDateKey(referenceDate)
  let currentStreak = 0

  while (activeDays.has(shiftDateKey(todayKey, -currentStreak))) {
    currentStreak += 1
  }

  let longestStreak = 0
  let runningStreak = 0

  for (let index = 0; index < activeDayKeys.length; index += 1) {
    if (index === 0 || dayDifference(activeDayKeys[index - 1]!, activeDayKeys[index]!) !== 1) {
      runningStreak = 1
    } else {
      runningStreak += 1
    }

    longestStreak = Math.max(longestStreak, runningStreak)
  }

  const countDaysInWindow = (days: number): number => {
    return Array.from({ length: days }, (_, index) => shiftDateKey(todayKey, -index)).filter((key) => activeDays.has(key)).length
  }
  const completedDaysLast7 = countDaysInWindow(7)
  const completedDaysLast30 = countDaysInWindow(30)

  return {
    currentStreak,
    longestStreak,
    completedDaysLast7,
    completedDaysLast30,
    completionRateLast7: Math.round((completedDaysLast7 / 7) * 100),
    completionRateLast30: Math.round((completedDaysLast30 / 30) * 100),
  }
}
