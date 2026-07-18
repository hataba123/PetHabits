import type { Habit, HabitLog, IdentityCategory } from '../models'

export interface IdentityScore {
  category: IdentityCategory
  points: number
  percentage: number
}

const categories: IdentityCategory[] = ['knowledge', 'discipline', 'health', 'calm', 'creativity']

export function calculateIdentityScores(habits: Habit[], logs: HabitLog[]): IdentityScore[] {
  const pointsByCategory: Record<IdentityCategory, number> = {
    knowledge: 0,
    discipline: 0,
    health: 0,
    calm: 0,
    creativity: 0,
  }

  for (const log of logs) {
    const habit = habits.find((candidate) => candidate.id === log.habitId)

    if (habit) {
      pointsByCategory[habit.identityCategory] += log.completionType === 'full' ? 1 : 0.5
    }
  }

  const totalPoints = Object.values(pointsByCategory).reduce((sum, points) => sum + points, 0)

  return categories.map((category) => ({
    category,
    points: pointsByCategory[category],
    percentage: totalPoints ? Math.round((pointsByCategory[category] / totalPoints) * 100) : 0,
  }))
}
