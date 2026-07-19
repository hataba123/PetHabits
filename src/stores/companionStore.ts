import { computed } from 'vue'
import { defineStore } from 'pinia'

import type { Companion } from '../models'
import { isCompanionAccessory, isCompanionColor, isCompanionExpression } from '../constants/companion'
import { calculateAchievementProgress, type AchievementProgress } from '../utils/achievementCalculator'
import { calculateTotalExperience } from '../utils/experienceCalculator'
import { calculateCompanionHappiness } from '../utils/happinessCalculator'
import { calculateIdentityScores } from '../utils/identityCalculator'
import { calculateCompanionProgression } from '../utils/progressionCalculator'
import { useAppStore } from './appStore'

export const useCompanionStore = defineStore('companion', () => {
  const appStore = useAppStore()
  const totalExperience = computed(() => calculateTotalExperience(appStore.appState.habitLogs))
  const progression = computed(() => calculateCompanionProgression(totalExperience.value))
  const happiness = computed(() => calculateCompanionHappiness(appStore.appState.habitLogs))
  const achievements = computed<AchievementProgress[]>(() => calculateAchievementProgress(appStore.appState.habitLogs))
  const unlockedRewards = computed(() => achievements.value.filter((achievement) => achievement.isUnlocked).map((achievement) => achievement.reward))
  const identityScores = computed(() => calculateIdentityScores(appStore.appState.habits, appStore.appState.habitLogs))
  const companion = computed<Companion>(() => ({
    ...appStore.appState.companion,
    totalExperience: totalExperience.value,
    happiness: happiness.value,
    ...progression.value,
  }))

  function isRewardUnlocked(type: 'accessory' | 'color' | 'expression', value: string): boolean {
    if ((type === 'accessory' && value === 'none') || (type === 'color' && value === 'natural') || (type === 'expression' && value === 'calm')) {
      return true
    }

    return unlockedRewards.value.some((reward) => reward.type === type && reward.value === value)
  }

  function equipAccessory(accessory: Companion['accessory']): boolean {
    if (!isCompanionAccessory(accessory) || !isRewardUnlocked('accessory', accessory)) {
      return false
    }

    appStore.appState.companion.accessory = accessory
    appStore.persist()
    return true
  }

  function equipColor(color: Companion['color']): boolean {
    if (!isCompanionColor(color) || !isRewardUnlocked('color', color)) {
      return false
    }

    appStore.appState.companion.color = color
    appStore.persist()
    return true
  }

  function equipExpression(expression: Companion['expression']): boolean {
    if (!isCompanionExpression(expression) || !isRewardUnlocked('expression', expression)) {
      return false
    }

    appStore.appState.companion.expression = expression
    appStore.persist()
    return true
  }

  function syncFromLogs(persist = true): void {
    const current = appStore.appState.companion
    const next = companion.value
    const hasChanged =
      current.totalExperience !== next.totalExperience ||
      current.level !== next.level ||
      current.currentExperience !== next.currentExperience ||
      current.experienceToNextLevel !== next.experienceToNextLevel ||
      current.growthStage !== next.growthStage ||
      current.happiness !== next.happiness

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
    happiness,
    achievements,
    unlockedRewards,
    isRewardUnlocked,
    equipAccessory,
    equipColor,
    equipExpression,
    syncFromLogs,
  }
})
