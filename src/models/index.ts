export type ThemeMode = 'light' | 'dark' | 'system'

export type IdentityCategory = 'knowledge' | 'discipline' | 'health' | 'calm' | 'creativity'

export type HabitTargetType = 'daily' | 'weekly'

export type HabitCompletionType = 'minimum' | 'full'

export type CompanionGrowthStage = 'egg' | 'baby' | 'teen' | 'adult' | 'evolved'

export type CompanionAnimal = 'cat' | 'fox' | 'bunny' | 'panda' | 'dog' | 'koala' | 'penguin' | 'otter'

/** Các giá trị cũ được giữ lại để đọc được dữ liệu đã lưu trước đây. */
export type LegacyCompanionShape = 'orb' | 'soft-square' | 'crystal' | 'leaf'

export type CompanionShape = CompanionAnimal | LegacyCompanionShape

export interface UserProfile {
  id: string
  displayName: string
  futureIdentity: string
  createdAt: string
  updatedAt: string
}

export interface Habit {
  id: string
  name: string
  description: string
  identityStatement: string
  identityCategory: IdentityCategory
  targetType: HabitTargetType
  targetCount: number
  minimumVersion: string
  experienceReward: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface HabitLog {
  id: string
  habitId: string
  completionType: HabitCompletionType
  completedAt: string
  note: string
  durationMinutes: number | null
  experienceEarned: number
  createdAt: string
}

export interface Companion {
  name: string
  shape: CompanionShape
  totalExperience: number
  level: number
  currentExperience: number
  experienceToNextLevel: number
  growthStage: CompanionGrowthStage
  happiness: number
}

export interface AppSettings {
  theme: ThemeMode
  firstDayOfWeek: 0 | 1
}

export interface AppState {
  version: number
  profile: UserProfile
  habits: Habit[]
  habitLogs: HabitLog[]
  companion: Companion
  settings: AppSettings
}
