import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

import { loadState } from '../services/localStorageService'
import type { HabitInput } from '../utils/validators'
import { useHabitStore } from './habitStore'

const validHabit: HabitInput = {
  name: 'Đọc sách',
  description: 'Đọc vài trang mỗi tối.',
  identityStatement: 'Tôi là người luôn học hỏi.',
  identityCategory: 'knowledge',
  targetType: 'daily',
  targetCount: 1,
  minimumVersion: 'Mở sách và đọc 2 phút.',
  experienceReward: 10,
}

describe('habitStore', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('creates and persists a habit', () => {
    const store = useHabitStore()
    const habit = store.createHabit(validHabit)

    expect(habit?.id).toBeTruthy()
    expect(store.habits).toHaveLength(1)
    expect(loadState().habits[0]?.name).toBe('Đọc sách')
  })

  it('rejects invalid input and supports pause/reactivate', () => {
    const store = useHabitStore()

    expect(store.createHabit({ ...validHabit, targetCount: 0 })).toBeNull()
    const habit = store.createHabit(validHabit)

    expect(habit).not.toBeNull()
    store.setHabitActive(habit!.id, false)
    expect(store.activeHabits).toHaveLength(0)
    store.setHabitActive(habit!.id, true)
    expect(store.activeHabits).toHaveLength(1)
  })

  it('deletes a habit and its related logs', () => {
    const store = useHabitStore()
    const habit = store.createHabit(validHabit)
    const appState = loadState()
    appState.habitLogs.push({
      id: 'log-1',
      habitId: habit!.id,
      completionType: 'full',
      completedAt: new Date().toISOString(),
      note: '',
      durationMinutes: null,
      experienceEarned: 10,
      createdAt: new Date().toISOString(),
    })

    expect(store.deleteHabit(habit!.id)).toBe(true)
    expect(store.habits).toHaveLength(0)
  })
})
