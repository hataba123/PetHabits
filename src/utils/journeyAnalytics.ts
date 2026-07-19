import type { Habit, HabitLog } from '../models'
import { getLocalDateKey, getLocalDateKeyFromIso } from './dateUtils'
import { calculateStreakStats, type StreakStats } from './streakCalculator'

export type AnalyticsPeriod = number
export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night'

export interface HeatmapCell {
  dateKey: string
  label: string
  completionCount: number
  durationMinutes: number
  intensity: number
}

export interface HabitAnalytics extends StreakStats {
  habitId: string
  completionRate: number
  completedCount: number
  expectedCount: number
  totalDurationMinutes: number
}

export interface WeekSummary {
  startDateKey: string
  endDateKey: string
  completionCount: number
  activeDays: number
  durationMinutes: number
}

export interface WeekComparison {
  current: WeekSummary
  previous: WeekSummary
  completionDelta: number
  completionChangePercent: number
  activeDayDelta: number
  durationDelta: number
}

export interface WeekendSkipInsight {
  habitId: string
  habitName: string
  skippedDays: number
  totalWeekendDays: number
  skipRate: number
}

export interface JourneyInsights {
  strongestTimeOfDay: TimeOfDay | null
  weekendSkip: WeekendSkipInsight | null
}

function dateFromKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function shiftDate(date: Date, offset: number): Date {
  const shiftedDate = new Date(date)
  shiftedDate.setDate(shiftedDate.getDate() + offset)
  return shiftedDate
}

function dateKeysBetween(startDate: Date, numberOfDays: number): string[] {
  return Array.from({ length: numberOfDays }, (_, index) => getLocalDateKey(shiftDate(startDate, index)))
}

function getWindowStart(referenceDate: Date, numberOfDays: number): Date {
  return shiftDate(referenceDate, -(numberOfDays - 1))
}

function getLogsInDateKeys(logs: HabitLog[], dateKeys: Set<string>): HabitLog[] {
  return logs.filter((log) => {
    const dateKey = getLocalDateKeyFromIso(log.completedAt)
    return dateKey !== null && dateKeys.has(dateKey)
  })
}

function getDateLabel(dateKey: string): string {
  const date = dateFromKey(dateKey)
  return new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date)
}

function getExpectedCompletions(habit: Habit, numberOfDays: number): number {
  const periods = habit.targetType === 'daily' ? numberOfDays : Math.ceil(numberOfDays / 7)
  return periods * habit.targetCount
}

function getWeekStart(referenceDate: Date, firstDayOfWeek: 0 | 1): Date {
  const dayOffset = (referenceDate.getDay() - firstDayOfWeek + 7) % 7
  return shiftDate(referenceDate, -dayOffset)
}

function getWeekSummary(logs: HabitLog[], startDate: Date): WeekSummary {
  const dateKeys = dateKeysBetween(startDate, 7)
  const dateKeySet = new Set(dateKeys)
  const logsInWeek = getLogsInDateKeys(logs, dateKeySet)
  const activeDays = new Set(
    logsInWeek
      .map((log) => getLocalDateKeyFromIso(log.completedAt))
      .filter((dateKey): dateKey is string => dateKey !== null),
  )

  return {
    startDateKey: dateKeys[0]!,
    endDateKey: dateKeys[dateKeys.length - 1]!,
    completionCount: logsInWeek.length,
    activeDays: activeDays.size,
    durationMinutes: logsInWeek.reduce((total, log) => total + (log.durationMinutes ?? 0), 0),
  }
}

export function getDateKeysInRange(numberOfDays: AnalyticsPeriod, referenceDate: Date = new Date()): string[] {
  return dateKeysBetween(getWindowStart(referenceDate, numberOfDays), numberOfDays)
}

export function buildHeatmap(
  logs: HabitLog[],
  numberOfDays: AnalyticsPeriod,
  referenceDate: Date = new Date(),
): HeatmapCell[] {
  const dateKeys = getDateKeysInRange(numberOfDays, referenceDate)
  const logsByDate = new Map<string, HabitLog[]>()

  for (const log of logs) {
    const dateKey = getLocalDateKeyFromIso(log.completedAt)

    if (!dateKey) {
      continue
    }

    const dateLogs = logsByDate.get(dateKey) ?? []
    dateLogs.push(log)
    logsByDate.set(dateKey, dateLogs)
  }

  return dateKeys.map((dateKey) => {
    const dateLogs = logsByDate.get(dateKey) ?? []
    const completionCount = dateLogs.length

    return {
      dateKey,
      label: getDateLabel(dateKey),
      completionCount,
      durationMinutes: dateLogs.reduce((total, log) => total + (log.durationMinutes ?? 0), 0),
      intensity: Math.min(4, completionCount),
    }
  })
}

export function calculateHabitAnalytics(
  habit: Habit,
  logs: HabitLog[],
  numberOfDays: AnalyticsPeriod = 30,
  referenceDate: Date = new Date(),
): HabitAnalytics {
  const dateKeys = getDateKeysInRange(numberOfDays, referenceDate)
  const dateKeySet = new Set(dateKeys)
  const habitLogs = getLogsInDateKeys(logs, dateKeySet).filter((log) => log.habitId === habit.id)
  const completedDays = new Set(
    habitLogs
      .map((log) => getLocalDateKeyFromIso(log.completedAt))
      .filter((dateKey): dateKey is string => dateKey !== null),
  ).size
  const expectedCount = getExpectedCompletions(habit, numberOfDays)

  return {
    habitId: habit.id,
    ...calculateStreakStats(logs.filter((log) => log.habitId === habit.id), referenceDate),
    completionRate: expectedCount ? Math.min(100, Math.round((habitLogs.length / expectedCount) * 100)) : 0,
    completedCount: completedDays,
    expectedCount,
    totalDurationMinutes: habitLogs.reduce((total, log) => total + (log.durationMinutes ?? 0), 0),
  }
}

export function calculateWeekComparison(
  logs: HabitLog[],
  referenceDate: Date = new Date(),
  firstDayOfWeek: 0 | 1 = 1,
): WeekComparison {
  const currentStart = getWeekStart(referenceDate, firstDayOfWeek)
  const previousStart = shiftDate(currentStart, -7)
  const current = getWeekSummary(logs, currentStart)
  const previous = getWeekSummary(logs, previousStart)
  const completionDelta = current.completionCount - previous.completionCount

  return {
    current,
    previous,
    completionDelta,
    completionChangePercent: previous.completionCount
      ? Math.round((completionDelta / previous.completionCount) * 100)
      : current.completionCount
        ? 100
        : 0,
    activeDayDelta: current.activeDays - previous.activeDays,
    durationDelta: current.durationMinutes - previous.durationMinutes,
  }
}

function getTimeOfDay(hour: number): TimeOfDay {
  if (hour >= 5 && hour < 12) {
    return 'morning'
  }

  if (hour >= 12 && hour < 18) {
    return 'afternoon'
  }

  if (hour >= 18) {
    return 'evening'
  }

  return 'night'
}

function getWeekendDateKeys(numberOfDays: AnalyticsPeriod, referenceDate: Date): string[] {
  return getDateKeysInRange(numberOfDays, referenceDate).filter((dateKey) => {
    const day = dateFromKey(dateKey).getDay()
    return day === 0 || day === 6
  })
}

export function buildJourneyInsights(
  habits: Habit[],
  logs: HabitLog[],
  referenceDate: Date = new Date(),
  numberOfDays: AnalyticsPeriod = 30,
): JourneyInsights {
  const recentLogs = getLogsInDateKeys(logs, new Set(getDateKeysInRange(numberOfDays, referenceDate)))
  const timeCounts: Record<TimeOfDay, number> = { morning: 0, afternoon: 0, evening: 0, night: 0 }

  for (const log of recentLogs) {
    timeCounts[getTimeOfDay(new Date(log.completedAt).getHours())] += 1
  }

  const strongestTimeOfDay = recentLogs.length
    ? (Object.keys(timeCounts) as TimeOfDay[]).sort((first, second) => timeCounts[second] - timeCounts[first])[0]!
    : null
  const weekendDateKeys = getWeekendDateKeys(numberOfDays, referenceDate)
  const weekendDateSet = new Set(weekendDateKeys)
  const activeHabits = habits.filter((habit) => habit.isActive)
  const weekendSkip = activeHabits
    .map((habit) => {
      const completedWeekendDays = new Set(
        logs
          .filter((log) => log.habitId === habit.id)
          .map((log) => getLocalDateKeyFromIso(log.completedAt))
          .filter((dateKey): dateKey is string => dateKey !== null && weekendDateSet.has(dateKey)),
      ).size
      const skippedDays = weekendDateKeys.length - completedWeekendDays

      return {
        habitId: habit.id,
        habitName: habit.name,
        skippedDays,
        totalWeekendDays: weekendDateKeys.length,
        skipRate: weekendDateKeys.length ? Math.round((skippedDays / weekendDateKeys.length) * 100) : 0,
      }
    })
    .filter((insight) => insight.skippedDays >= 2)
    .sort((first, second) => second.skipRate - first.skipRate || second.skippedDays - first.skippedDays)[0] ?? null

  return { strongestTimeOfDay, weekendSkip }
}

export function formatMinutes(totalMinutes: number): string {
  if (totalMinutes < 60) {
    return `${totalMinutes} phút`
  }

  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return minutes ? `${hours} giờ ${minutes} phút` : `${hours} giờ`
}
