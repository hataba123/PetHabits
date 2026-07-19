import { defineStore } from 'pinia'

import type { AppSettings, AppState, CompanionAnimal, UserProfile } from '../models'
import { isCompanionAnimal } from '../constants/companion'
import {
  clearState,
  createDefaultState,
  loadState,
  saveState,
  validateState,
} from '../services/localStorageService'

export type ProfileUpdate = Pick<UserProfile, 'displayName' | 'futureIdentity'>

export const useAppStore = defineStore('app', {
  state: () => ({
    appState: loadState() as AppState,
    initialized: false,
  }),

  getters: {
    profile: (store): UserProfile => store.appState.profile,
    companion: (store) => store.appState.companion,
    settings: (store): AppSettings => store.appState.settings,
  },

  actions: {
    initialize(): void {
      if (this.initialized) {
        return
      }

      this.appState = loadState()
      this.initialized = true
    },

    updateProfile(updates: ProfileUpdate): boolean {
      const displayName = updates.displayName.trim()
      const futureIdentity = updates.futureIdentity.trim()

      if (displayName.length > 150 || futureIdentity.length > 2000) {
        return false
      }

      this.appState.profile = {
        ...this.appState.profile,
        displayName,
        futureIdentity,
        updatedAt: new Date().toISOString(),
      }
      this.persist()
      return true
    },

    updateCompanionName(name: string): boolean {
      const trimmedName = name.trim()

      if (!trimmedName || trimmedName.length > 80) {
        return false
      }

      this.appState.companion.name = trimmedName
      this.persist()
      return true
    },

    updateCompanionShape(shape: CompanionAnimal): boolean {
      if (!isCompanionAnimal(shape)) {
        return false
      }

      this.appState.companion.shape = shape
      this.persist()
      return true
    },

    updateSettings(settings: Partial<AppSettings>): void {
      this.appState.settings = {
        ...this.appState.settings,
        ...settings,
      }
      this.persist()
    },

    replaceState(nextState: AppState): boolean {
      if (!validateState(nextState)) {
        return false
      }

      this.appState = nextState
      this.persist()
      return true
    },

    resetState(): void {
      this.appState = createDefaultState()
      this.persist()
    },

    clearPersistedState(): void {
      clearState()
      this.appState = createDefaultState()
    },

    persist(): void {
      saveState(this.appState)
    },
  },
})
