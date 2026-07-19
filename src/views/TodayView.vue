<script setup lang="ts">
import { computed, ref } from 'vue'

import CheckInForm from '../components/habits/CheckInForm.vue'
import CompanionAvatar from '../components/CompanionAvatar.vue'
import type { Habit } from '../models'
import { useAppStore } from '../stores/appStore'
import { useCheckInStore, type CheckInInput } from '../stores/checkInStore'
import { useHabitStore } from '../stores/habitStore'
import { getLocalDateKey } from '../utils/dateUtils'

const appStore = useAppStore()
const habitStore = useHabitStore()
const checkInStore = useCheckInStore()
const todayKey = getLocalDateKey()
const selectedHabit = ref<Habit | null>(null)
const feedbackMessage = ref('')

const todayHabits = computed(() => habitStore.activeHabits)
const todayLogs = computed(() => checkInStore.getLogsForDate(todayKey))
const completedCount = computed(() => todayLogs.value.length)
const totalTarget = computed(() => todayHabits.value.reduce((total, habit) => total + habit.targetCount, 0))
const completionPercent = computed(() => (totalTarget.value ? Math.min(100, Math.round((completedCount.value / totalTarget.value) * 100)) : 0))
const greetingName = computed(() => appStore.profile.displayName || 'bạn')

function getHabitCompletionCount(habitId: string): number {
  return checkInStore.getCompletionCount(habitId, todayKey)
}

function openCheckIn(habit: Habit): void {
  selectedHabit.value = habit
}

function closeCheckIn(): void {
  selectedHabit.value = null
}

function saveCheckIn(input: CheckInInput): void {
  const log = checkInStore.createCheckIn(input)

  if (!log) {
    feedbackMessage.value = 'Check-in này đã tồn tại hoặc dữ liệu chưa hợp lệ.'
    return
  }

  feedbackMessage.value = `Tuyệt vời! Bạn vừa nhận +${log.experienceEarned} EXP.`
  closeCheckIn()
}

function getHabitName(habitId: string): string {
  return habitStore.habits.find((habit) => habit.id === habitId)?.name || 'Thói quen đã xóa'
}

function undoCheckIn(logId: string): void {
  if (!window.confirm('Hoàn tác lần check-in này? EXP sẽ được tính lại từ lịch sử.')) {
    return
  }

  checkInStore.undoCheckIn(logId)
  feedbackMessage.value = 'Đã hoàn tác check-in.'
}
</script>

<template>
  <section>
    <div class="today-hero">
      <div class="page-intro">
        <p class="eyebrow">{{ todayKey }}</p>
        <h1>Chào {{ greetingName }} <span aria-hidden="true">✦</span></h1>
        <p>{{ appStore.profile.futureIdentity || 'Mỗi hành động nhỏ là một lá phiếu cho phiên bản bạn muốn trở thành.' }}</p>
      </div>
      <div class="companion-mini" aria-label="Tóm tắt bạn đồng hành">
        <CompanionAvatar :shape="appStore.companion.shape" :growth-stage="appStore.companion.growthStage" :accessory="appStore.companion.accessory" :color="appStore.companion.color" :expression="appStore.companion.expression" variant="mini" :show-status="false" />
        <div><span>Đồng hành cùng</span><strong>{{ appStore.companion.name }}</strong></div>
        <span class="companion-mini__level">Lv. {{ appStore.companion.level }}</span>
      </div>
    </div>

    <p v-if="feedbackMessage" class="feedback feedback--success" role="status">{{ feedbackMessage }}</p>

    <div class="today-progress-card">
      <div class="today-progress-card__heading">
        <div><span class="eyebrow">Tiến độ hôm nay</span><strong>{{ completedCount }}/{{ totalTarget || 0 }} lần hoàn thành</strong></div>
        <b>{{ completionPercent }}%</b>
      </div>
      <div class="progress-track"><span :style="{ width: `${completionPercent}%` }"></span></div>
      <p>{{ completedCount ? 'Bạn đang giữ lời với chính mình.' : 'Chọn một bước nhỏ để bắt đầu ngày hôm nay.' }}</p>
    </div>

    <div class="section-heading"><div><span class="eyebrow">Danh sách hôm nay</span><h2>Những bước nhỏ đang chờ bạn</h2></div><span class="section-count">{{ todayHabits.length }} thói quen</span></div>

    <div v-if="todayHabits.length" class="today-habit-list">
      <article v-for="habit in todayHabits" :key="habit.id" class="today-habit-row">
        <div class="today-habit-row__icon" aria-hidden="true">{{ getHabitCompletionCount(habit.id) >= habit.targetCount ? '✓' : '○' }}</div>
        <div class="today-habit-row__content"><h3>{{ habit.name }}</h3><p>{{ habit.minimumVersion }}</p><small>{{ getHabitCompletionCount(habit.id) }}/{{ habit.targetCount }} {{ habit.targetType === 'daily' ? 'lần hôm nay' : 'lần mục tiêu' }}</small></div>
        <button class="button button--small button--primary" type="button" @click="openCheckIn(habit)">Check-in</button>
      </article>
    </div>
    <div v-else class="empty-state"><span class="empty-state__icon" aria-hidden="true">🌿</span><h2>Chưa có thói quen hoạt động</h2><p>Tạo một thói quen nhỏ để bắt đầu đồng hành cùng mình.</p><RouterLink class="button button--primary" to="/habits">Tạo thói quen</RouterLink></div>

    <div v-if="todayLogs.length" class="today-log-section">
      <div class="section-heading"><div><span class="eyebrow">Đã ghi nhận</span><h2>Những lần xuất hiện hôm nay</h2></div></div>
      <div class="today-log-list">
        <div v-for="log in todayLogs.slice().reverse()" :key="log.id" class="today-log-row">
          <div><strong>{{ getHabitName(log.habitId) }}</strong><span>{{ log.completionType === 'full' ? 'Đầy đủ' : 'Tối thiểu' }} · +{{ log.experienceEarned }} EXP</span></div>
          <button class="button button--small button--ghost" type="button" @click="undoCheckIn(log.id)">Hoàn tác</button>
        </div>
      </div>
    </div>

    <p class="encouragement">“Không cần hoàn hảo. Chỉ cần xuất hiện thêm một lần nữa.”</p>

    <div v-if="selectedHabit" class="modal-backdrop" role="presentation" @click.self="closeCheckIn">
      <div class="modal-panel" role="dialog" aria-modal="true" aria-label="Ghi nhận check-in">
        <CheckInForm :habit="selectedHabit" @submit="saveCheckIn" @cancel="closeCheckIn" />
      </div>
    </div>
  </section>
</template>
