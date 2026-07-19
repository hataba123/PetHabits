import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

import { loadState, STORAGE_KEY } from '../services/localStorageService'
import { useAppStore } from './appStore'

describe('appStore', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('loads the persisted state once when initialized', () => {
    const appStore = useAppStore()
    expect(appStore.initialized).toBe(false)

    appStore.initialize()

    expect(appStore.initialized).toBe(true)
    expect(appStore.profile.id).toBeTruthy()
  })

  it('updates the profile and saves it through the service', () => {
    const appStore = useAppStore()
    appStore.initialize()

    expect(appStore.updateProfile({ displayName: '  Lợi  ', futureIdentity: 'Developer bền bỉ' })).toBe(true)

    expect(loadState().profile.displayName).toBe('Lợi')
    expect(loadState().profile.futureIdentity).toBe('Developer bền bỉ')
    expect(localStorage.getItem(STORAGE_KEY)).toBeTruthy()
  })

  it('does not persist invalid companion names', () => {
    const appStore = useAppStore()
    appStore.initialize()
    const originalName = appStore.companion.name

    expect(appStore.updateCompanionName('')).toBe(false)
    expect(appStore.companion.name).toBe(originalName)
  })

  it('updates and persists a valid companion shape', () => {
    const appStore = useAppStore()
    appStore.initialize()

    expect(appStore.updateCompanionShape('crystal')).toBe(true)
    expect(appStore.companion.shape).toBe('crystal')
    expect(loadState().companion.shape).toBe('crystal')
    expect(appStore.updateCompanionShape('invalid' as never)).toBe(false)
  })
})
