import { computed } from 'vue'
import { defineStore } from 'pinia'

import type { Habit } from '../models'
import { createId } from '../utils/id'
import { type HabitInput, validateHabitInput } from '../utils/validators'
import { useAppStore } from './appStore'
import { useCompanionStore } from './companionStore'

export const useHabitStore = defineStore('habits', () => {
  const appStore = useAppStore()
  const companionStore = useCompanionStore()
  const habits = computed(() => appStore.appState.habits)
  const activeHabits = computed(() => habits.value.filter((habit) => habit.isActive))

  function createHabit(input: HabitInput): Habit | null {
    if (Object.keys(validateHabitInput(input)).length > 0) {
      return null
    }

    const now = new Date().toISOString()
    const habit: Habit = {
      id: createId(),
      name: input.name.trim(),
      description: input.description.trim(),
      identityStatement: input.identityStatement.trim(),
      identityCategory: input.identityCategory,
      targetType: input.targetType,
      targetCount: input.targetCount,
      minimumVersion: input.minimumVersion.trim(),
      experienceReward: input.experienceReward,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    }

    appStore.appState.habits.push(habit)
    appStore.persist()
    return habit
  }

  function updateHabit(id: string, input: HabitInput): boolean {
    if (Object.keys(validateHabitInput(input)).length > 0) {
      return false
    }

    const habit = appStore.appState.habits.find((candidate) => candidate.id === id)

    if (!habit) {
      return false
    }

    Object.assign(habit, {
      ...input,
      name: input.name.trim(),
      description: input.description.trim(),
      identityStatement: input.identityStatement.trim(),
      minimumVersion: input.minimumVersion.trim(),
      updatedAt: new Date().toISOString(),
    })
    appStore.persist()
    return true
  }

  function setHabitActive(id: string, isActive: boolean): void {
    const habit = appStore.appState.habits.find((candidate) => candidate.id === id)

    if (!habit || habit.isActive === isActive) {
      return
    }

    habit.isActive = isActive
    habit.updatedAt = new Date().toISOString()
    appStore.persist()
  }

  function deleteHabit(id: string): boolean {
    const habitIndex = appStore.appState.habits.findIndex((habit) => habit.id === id)

    if (habitIndex < 0) {
      return false
    }

    appStore.appState.habits.splice(habitIndex, 1)
    appStore.appState.habitLogs = appStore.appState.habitLogs.filter((log) => log.habitId !== id)
    companionStore.syncFromLogs(false)
    appStore.persist()
    return true
  }

  return {
    habits,
    activeHabits,
    createHabit,
    updateHabit,
    setHabitActive,
    deleteHabit,
  }
})
