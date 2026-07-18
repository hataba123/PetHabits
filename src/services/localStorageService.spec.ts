import { beforeEach, describe, expect, it } from 'vitest'

import {
  clearState,
  createDefaultState,
  exportState,
  importState,
  loadState,
  saveState,
  STORAGE_KEY,
} from './localStorageService'

describe('localStorageService', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns a complete default state when storage is empty', () => {
    const state = loadState()

    expect(state.version).toBe(1)
    expect(state.profile.id).toBeTruthy()
    expect(state.habits).toEqual([])
    expect(state.habitLogs).toEqual([])
    expect(state.companion.name).toBe('Mầm')
  })

  it('saves and loads a state with the single application key', () => {
    const state = createDefaultState()
    state.profile.displayName = 'Lợi'

    saveState(state)

    expect(localStorage.getItem(STORAGE_KEY)).toBeTruthy()
    expect(loadState().profile.displayName).toBe('Lợi')
  })

  it('falls back safely when stored JSON is corrupted', () => {
    localStorage.setItem(STORAGE_KEY, '{not-json')

    expect(loadState().habits).toEqual([])
  })

  it('validates imported data before it can be saved', () => {
    const state = createDefaultState()
    const importedState = importState(exportState(state))

    expect(importedState.version).toBe(1)
    expect(() => importState('{"version":1}')).toThrow()
  })

  it('clears only the application state key', () => {
    localStorage.setItem(STORAGE_KEY, exportState(createDefaultState()))
    localStorage.setItem('unrelated-key', 'keep')

    clearState()

    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
    expect(localStorage.getItem('unrelated-key')).toBe('keep')
  })
})
