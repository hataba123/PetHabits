import { computed } from 'vue'
import { defineStore } from 'pinia'

import type { HabitCompletionType, HabitLog } from '../models'
import { calculateExperience } from '../utils/experienceCalculator'
import { getLocalDateKeyFromIso } from '../utils/dateUtils'
import { createId } from '../utils/id'
import { calculateStreakStats } from '../utils/streakCalculator'
import { useAppStore } from './appStore'
import { useCompanionStore } from './companionStore'
import { useHabitStore } from './habitStore'

export interface CheckInInput {
  habitId: string
  completionType: HabitCompletionType
  completedAt: string
  note: string
  durationMinutes: number | null
}

export const useCheckInStore = defineStore('checkIns', () => {
  const appStore = useAppStore()
  const habitStore = useHabitStore()
  const companionStore = useCompanionStore()
  const logs = computed(() => appStore.appState.habitLogs)

  function isValidCheckIn(input: CheckInInput): boolean {
    const duration = input.durationMinutes
    const completedTime = new Date(input.completedAt).getTime()

    return (
      Boolean(habitStore.habits.find((habit) => habit.id === input.habitId && habit.isActive)) &&
      !Number.isNaN(completedTime) &&
      input.note.trim().length <= 1000 &&
      (duration === null || (Number.isFinite(duration) && duration >= 0 && duration <= 1440))
    )
  }

  function createCheckIn(input: CheckInInput): HabitLog | null {
    if (!isValidCheckIn(input)) {
      return null
    }

    const isDuplicate = logs.value.some(
      (log) => log.habitId === input.habitId && log.completedAt === input.completedAt,
    )

    if (isDuplicate) {
      return null
    }

    const habit = habitStore.habits.find((candidate) => candidate.id === input.habitId)

    if (!habit) {
      return null
    }

    const log: HabitLog = {
      id: createId(),
      habitId: input.habitId,
      completionType: input.completionType,
      completedAt: input.completedAt,
      note: input.note.trim(),
      durationMinutes: input.durationMinutes,
      experienceEarned: calculateExperience(habit, input.completionType),
      createdAt: new Date().toISOString(),
    }

    appStore.appState.habitLogs.push(log)
    companionStore.syncFromLogs()
    return log
  }

  function undoCheckIn(logId: string): boolean {
    const logIndex = appStore.appState.habitLogs.findIndex((log) => log.id === logId)

    if (logIndex < 0) {
      return false
    }

    appStore.appState.habitLogs.splice(logIndex, 1)
    companionStore.syncFromLogs()
    return true
  }

  function getCompletionCount(habitId: string, dateKey: string): number {
    return logs.value.filter(
      (log) => log.habitId === habitId && getLocalDateKeyFromIso(log.completedAt) === dateKey,
    ).length
  }

  function getLogsForDate(dateKey: string): HabitLog[] {
    return logs.value.filter((log) => getLocalDateKeyFromIso(log.completedAt) === dateKey)
  }

  function getStreakStats(): ReturnType<typeof calculateStreakStats> {
    return calculateStreakStats(logs.value)
  }

  return {
    logs,
    createCheckIn,
    undoCheckIn,
    getCompletionCount,
    getLogsForDate,
    getStreakStats,
  }
})
