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

    expect(state.version).toBe(2)
    expect(state.profile.id).toBeTruthy()
    expect(state.habits).toEqual([])
    expect(state.habitLogs).toEqual([])
    expect(state.companion.name).toBe('Mầm')
    expect(state.companion.shape).toBe('cat')
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

    expect(importedState.version).toBe(2)
    expect(() => importState('{"version":2}')).toThrow()
  })

  it('migrates version 1 companions to the default shape', () => {
    const state = createDefaultState()
    const legacyState = {
      ...state,
      version: 1,
      companion: {
        name: state.companion.name,
        totalExperience: state.companion.totalExperience,
        level: state.companion.level,
        currentExperience: state.companion.currentExperience,
        experienceToNextLevel: state.companion.experienceToNextLevel,
        growthStage: state.companion.growthStage,
        happiness: state.companion.happiness,
      },
    }

    const migratedState = importState(JSON.stringify(legacyState))

    expect(migratedState.version).toBe(2)
    expect(migratedState.companion.shape).toBe('cat')
  })

  it('maps a previously saved shape to the closest animal companion', () => {
    const state = createDefaultState()
    const legacyState = {
      ...state,
      companion: { ...state.companion, shape: 'crystal' },
    }

    const migratedState = importState(JSON.stringify(legacyState))

    expect(migratedState.companion.shape).toBe('fox')
  })

  it('clears only the application state key', () => {
    localStorage.setItem(STORAGE_KEY, exportState(createDefaultState()))
    localStorage.setItem('unrelated-key', 'keep')

    clearState()

    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
    expect(localStorage.getItem('unrelated-key')).toBe('keep')
  })
})
