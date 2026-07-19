import type { AchievementId } from '../utils/achievementCalculator'
import type { CompanionReward } from '../models'

export interface AchievementDefinition {
  id: AchievementId
  title: string
  description: string
  encouragement: string
  icon: string
  target: number
  reward: CompanionReward
}

export const achievementDefinitions: ReadonlyArray<AchievementDefinition> = [
  {
    id: 'first-check-in',
    title: 'Bước đầu tiên',
    description: 'Tạo check-in đầu tiên cho một thói quen.',
    encouragement: 'Bạn đã bắt đầu. Một bước nhỏ cũng là một bước tiến.',
    icon: '🌱',
    target: 1,
    reward: { type: 'accessory', value: 'sprout', label: 'Mầm non' },
  },
  {
    id: 'seven-day-streak',
    title: 'Nhịp đều 7 ngày',
    description: 'Có một chuỗi hoạt động liên tục trong 7 ngày.',
    encouragement: 'Nhịp điệu của bạn đang trở nên vững vàng hơn.',
    icon: '🌤️',
    target: 7,
    reward: { type: 'color', value: 'lavender', label: 'Màu tử đinh hương' },
  },
  {
    id: 'fifty-sessions',
    title: '50 lần xuất hiện',
    description: 'Hoàn thành 50 phiên thói quen, theo cách của bạn.',
    encouragement: 'Mỗi lần xuất hiện đều góp thêm một nét vào câu chuyện của bạn.',
    icon: '🧭',
    target: 50,
    reward: { type: 'expression', value: 'wink', label: 'Biểu cảm nháy mắt' },
  },
  {
    id: 'habit-thirty-days',
    title: 'Một thói quen, 30 ngày',
    description: 'Thực hành cùng một thói quen trong 30 ngày khác nhau.',
    encouragement: 'Sự bền bỉ không cần hoàn hảo, chỉ cần tiếp tục quay lại.',
    icon: '🏡',
    target: 30,
    reward: { type: 'accessory', value: 'crown', label: 'Vương miện mềm' },
  },
]
