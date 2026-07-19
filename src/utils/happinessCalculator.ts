import type { HabitLog } from '../models'
import { calculateStreakStats } from './streakCalculator'

/**
 * Happiness phản ánh nhịp xuất hiện gần đây, không phải điểm phạt.
 * Mỗi ngày bỏ lỡ chỉ làm giảm một phần nhỏ trong cửa sổ 7/30 ngày;
 * lịch sử đã tạo ra vẫn được giữ nguyên.
 */
export function calculateCompanionHappiness(logs: HabitLog[], referenceDate: Date = new Date()): number {
  if (logs.length === 0) {
    return 50
  }

  const stats = calculateStreakStats(logs, referenceDate)
  const recentConsistency = (stats.completedDaysLast7 / 7) * 32
  const steadyConsistency = (stats.completedDaysLast30 / 30) * 18

  return Math.min(100, Math.max(0, Math.round(50 + recentConsistency + steadyConsistency)))
}
