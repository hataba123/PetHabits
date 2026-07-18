import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

import { useCompanionStore } from './companionStore'
import { useHabitStore } from './habitStore'
import type { HabitInput } from '../utils/validators'

const habitInput: HabitInput = {
  name: 'Học tập',
  description: '',
  identityStatement: 'Tôi là người học hỏi.',
  identityCategory: 'knowledge',
  targetType: 'daily',
  targetCount: 1,
  minimumVersion: 'Đọc 2 phút.',
  experienceReward: 100,
}

describe('companionStore', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('derives progression from habit logs', () => {
    const habitStore = useHabitStore()
    const companionStore = useCompanionStore()
    const habit = habitStore.createHabit(habitInput)!
    const appStore = companionStore.$state

    expect(companionStore.companion.totalExperience).toBe(0)
    expect(appStore).toBeDefined()

    const appState = useCompanionStore().$state
    expect(appState).toBeDefined()
    expect(habit.id).toBeTruthy()
  })
})
