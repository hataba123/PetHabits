import { computed } from 'vue'
import { defineStore } from 'pinia'

import type { Companion } from '../models'
import { calculateTotalExperience } from '../utils/experienceCalculator'
import { calculateIdentityScores } from '../utils/identityCalculator'
import { calculateCompanionProgression } from '../utils/progressionCalculator'
import { useAppStore } from './appStore'

export const useCompanionStore = defineStore('companion', () => {
  const appStore = useAppStore()
  const totalExperience = computed(() => calculateTotalExperience(appStore.appState.habitLogs))
  const progression = computed(() => calculateCompanionProgression(totalExperience.value))
  const identityScores = computed(() => calculateIdentityScores(appStore.appState.habits, appStore.appState.habitLogs))
  const companion = computed<Companion>(() => ({
    ...appStore.appState.companion,
    totalExperience: totalExperience.value,
    ...progression.value,
  }))

  function syncFromLogs(persist = true): void {
    const current = appStore.appState.companion
    const next = companion.value
    const hasChanged =
      current.totalExperience !== next.totalExperience ||
      current.level !== next.level ||
      current.currentExperience !== next.currentExperience ||
      current.experienceToNextLevel !== next.experienceToNextLevel ||
      current.growthStage !== next.growthStage

    if (!hasChanged) {
      return
    }

    appStore.appState.companion = next

    if (persist) {
      appStore.persist()
    }
  }

  return {
    companion,
    totalExperience,
    progression,
    identityScores,
    syncFromLogs,
  }
})
