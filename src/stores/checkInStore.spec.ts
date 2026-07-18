import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

import { useCheckInStore } from './checkInStore'
import { useHabitStore } from './habitStore'
import type { HabitInput } from '../utils/validators'

const habitInput: HabitInput = {
  name: 'Đi bộ',
  description: '',
  identityStatement: 'Tôi là người chăm sóc sức khỏe.',
  identityCategory: 'health',
  targetType: 'daily',
  targetCount: 1,
  minimumVersion: 'Đi bộ 2 phút.',
  experienceReward: 10,
}

describe('checkInStore', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('creates a check-in with calculated experience', () => {
    const habitStore = useHabitStore()
    const checkInStore = useCheckInStore()
    const habit = habitStore.createHabit(habitInput)!
    const completedAt = new Date().toISOString()

    const log = checkInStore.createCheckIn({
      habitId: habit.id,
      completionType: 'minimum',
      completedAt,
      note: 'Đã xuất hiện.',
      durationMinutes: 5,
    })

    expect(log?.experienceEarned).toBe(5)
    expect(checkInStore.logs).toHaveLength(1)
  })

  it('rejects a duplicate timestamp and invalid duration', () => {
    const habitStore = useHabitStore()
    const checkInStore = useCheckInStore()
    const habit = habitStore.createHabit(habitInput)!
    const completedAt = new Date().toISOString()
    const input = { habitId: habit.id, completionType: 'full' as const, completedAt, note: '', durationMinutes: 10 }

    expect(checkInStore.createCheckIn(input)).not.toBeNull()
    expect(checkInStore.createCheckIn(input)).toBeNull()
    expect(checkInStore.createCheckIn({ ...input, completedAt: new Date().toISOString(), durationMinutes: 1441 })).toBeNull()
  })

  it('can undo a check-in', () => {
    const habitStore = useHabitStore()
    const checkInStore = useCheckInStore()
    const habit = habitStore.createHabit(habitInput)!
    const log = checkInStore.createCheckIn({
      habitId: habit.id,
      completionType: 'full',
      completedAt: new Date().toISOString(),
      note: '',
      durationMinutes: null,
    })!

    expect(checkInStore.undoCheckIn(log.id)).toBe(true)
    expect(checkInStore.logs).toHaveLength(0)
  })
})
