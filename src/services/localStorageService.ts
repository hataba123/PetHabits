import type {
  AppSettings,
  AppState,
  Companion,
  Habit,
  HabitLog,
  UserProfile,
} from '../models'
import { createId } from '../utils/id'

export const STORAGE_KEY = 'atomic-companion-state'
export const CURRENT_STATE_VERSION = 1

const DEFAULT_COMPANION: Companion = {
  name: 'Mầm',
  totalExperience: 0,
  level: 1,
  currentExperience: 0,
  experienceToNextLevel: 150,
  growthStage: 'egg',
  happiness: 50,
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'system',
  firstDayOfWeek: 1,
}

function nowIso(): string {
  return new Date().toISOString()
}

function createDefaultProfile(): UserProfile {
  const now = nowIso()

  return {
    id: createId(),
    displayName: '',
    futureIdentity: '',
    createdAt: now,
    updatedAt: now,
  }
}

export function createDefaultState(): AppState {
  return {
    version: CURRENT_STATE_VERSION,
    profile: createDefaultProfile(),
    habits: [],
    habitLogs: [],
    companion: { ...DEFAULT_COMPANION },
    settings: { ...DEFAULT_SETTINGS },
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isString(value: unknown): value is string {
  return typeof value === 'string'
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function isUserProfile(value: unknown): value is UserProfile {
  if (!isRecord(value)) {
    return false
  }

  return (
    isString(value.id) &&
    isString(value.displayName) &&
    isString(value.futureIdentity) &&
    isString(value.createdAt) &&
    isString(value.updatedAt)
  )
}

function isHabit(value: unknown): value is Habit {
  if (!isRecord(value)) {
    return false
  }

  return (
    isString(value.id) &&
    isString(value.name) &&
    isString(value.description) &&
    isString(value.identityStatement) &&
    ['knowledge', 'discipline', 'health', 'calm', 'creativity'].includes(String(value.identityCategory)) &&
    ['daily', 'weekly'].includes(String(value.targetType)) &&
    isNumber(value.targetCount) &&
    isString(value.minimumVersion) &&
    isNumber(value.experienceReward) &&
    typeof value.isActive === 'boolean' &&
    isString(value.createdAt) &&
    isString(value.updatedAt)
  )
}

function isHabitLog(value: unknown): value is HabitLog {
  if (!isRecord(value)) {
    return false
  }

  return (
    isString(value.id) &&
    isString(value.habitId) &&
    ['minimum', 'full'].includes(String(value.completionType)) &&
    isString(value.completedAt) &&
    isString(value.note) &&
    (value.durationMinutes === null || isNumber(value.durationMinutes)) &&
    isNumber(value.experienceEarned) &&
    isString(value.createdAt)
  )
}

function isCompanion(value: unknown): value is Companion {
  if (!isRecord(value)) {
    return false
  }

  return (
    isString(value.name) &&
    isNumber(value.totalExperience) &&
    isNumber(value.level) &&
    isNumber(value.currentExperience) &&
    isNumber(value.experienceToNextLevel) &&
    ['egg', 'baby', 'teen', 'adult', 'evolved'].includes(String(value.growthStage)) &&
    isNumber(value.happiness)
  )
}

function isSettings(value: unknown): value is AppSettings {
  if (!isRecord(value)) {
    return false
  }

  return (
    ['light', 'dark', 'system'].includes(String(value.theme)) &&
    (value.firstDayOfWeek === 0 || value.firstDayOfWeek === 1)
  )
}

function isAppState(value: unknown): value is AppState {
  if (!isRecord(value)) {
    return false
  }

  return (
    value.version === CURRENT_STATE_VERSION &&
    isUserProfile(value.profile) &&
    Array.isArray(value.habits) &&
    value.habits.every(isHabit) &&
    Array.isArray(value.habitLogs) &&
    value.habitLogs.every(isHabitLog) &&
    isCompanion(value.companion) &&
    isSettings(value.settings)
  )
}

function migrateState(input: unknown): AppState | null {
  if (!isRecord(input)) {
    return null
  }

  if (input.version === CURRENT_STATE_VERSION && isAppState(input)) {
    return input
  }

  if (input.version === 0) {
    const defaultState = createDefaultState()
    const migratedState: AppState = {
      ...defaultState,
      profile: isUserProfile(input.profile) ? input.profile : defaultState.profile,
      habits: Array.isArray(input.habits) ? input.habits.filter(isHabit) : [],
      habitLogs: Array.isArray(input.habitLogs) ? input.habitLogs.filter(isHabitLog) : [],
      companion: isCompanion(input.companion) ? input.companion : defaultState.companion,
      settings: isSettings(input.settings) ? input.settings : defaultState.settings,
    }

    return migratedState
  }

  return null
}

function getStorage(): Storage | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage
  } catch {
    return null
  }
}

export function loadState(): AppState {
  const storage = getStorage()

  if (!storage) {
    return createDefaultState()
  }

  try {
    const serializedState = storage.getItem(STORAGE_KEY)

    if (!serializedState) {
      return createDefaultState()
    }

    const parsedState: unknown = JSON.parse(serializedState)
    return migrateState(parsedState) ?? createDefaultState()
  } catch {
    return createDefaultState()
  }
}

export function saveState(state: AppState): void {
  const storage = getStorage()

  if (!storage || !isAppState(state)) {
    return
  }

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Persistence errors must not crash the application.
  }
}

export function exportState(state: AppState): string {
  if (!isAppState(state)) {
    throw new Error('Dữ liệu hiện tại không hợp lệ để xuất.')
  }

  return JSON.stringify(state, null, 2)
}

export function importState(jsonContent: string): AppState {
  try {
    const parsedState: unknown = JSON.parse(jsonContent)
    const migratedState = migrateState(parsedState)

    if (!migratedState) {
      throw new Error('Tệp dữ liệu không đúng định dạng PetHabits.')
    }

    return migratedState
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }

    throw new Error('Không thể đọc tệp dữ liệu.')
  }
}

export function clearState(): void {
  const storage = getStorage()

  if (!storage) {
    return
  }

  try {
    storage.removeItem(STORAGE_KEY)
  } catch {
    // Persistence errors must not crash the application.
  }
}

export function validateState(value: unknown): value is AppState {
  return isAppState(value)
}
