import type { Habit, HabitCompletionType, HabitLog } from '../models'

export function calculateExperience(habit: Habit, completionType: HabitCompletionType): number {
  if (completionType === 'full') {
    return habit.experienceReward
  }

  return Math.max(1, Math.floor(habit.experienceReward * 0.5))
}

export function calculateTotalExperience(logs: HabitLog[]): number {
  return logs.reduce((totalExperience, log) => totalExperience + log.experienceEarned, 0)
}
