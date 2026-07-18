<script setup lang="ts">
import { computed, ref } from 'vue'

import { identityCategories, identityCategoryLabels } from '../constants/identity'
import { useCheckInStore } from '../stores/checkInStore'
import { useHabitStore } from '../stores/habitStore'
import type { IdentityCategory } from '../models'
import { getLocalDateKeyFromIso } from '../utils/dateUtils'

const checkInStore = useCheckInStore()
const habitStore = useHabitStore()
const fromDate = ref('')
const toDate = ref('')
const habitFilter = ref('all')
const identityFilter = ref<'all' | IdentityCategory>('all')
const feedbackMessage = ref('')

const filteredLogs = computed(() => {
  return checkInStore.logs
    .filter((log) => {
      const dateKey = getLocalDateKeyFromIso(log.completedAt)
      const habit = habitStore.habits.find((candidate) => candidate.id === log.habitId)

      if (!dateKey || !habit) {
        return false
      }

      return (
        (!fromDate.value || dateKey >= fromDate.value) &&
        (!toDate.value || dateKey <= toDate.value) &&
        (habitFilter.value === 'all' || habit.id === habitFilter.value) &&
        (identityFilter.value === 'all' || habit.identityCategory === identityFilter.value)
      )
    })
    .slice()
    .sort((first, second) => second.completedAt.localeCompare(first.completedAt))
})

const totalDuration = computed(() => filteredLogs.value.reduce((total, log) => total + (log.durationMinutes || 0), 0))
const streakStats = computed(() => checkInStore.getStreakStats())

function getHabitName(habitId: string): string {
  return habitStore.habits.find((habit) => habit.id === habitId)?.name || 'Thói quen đã xóa'
}

function formatDateTime(isoDate: string): string {
  return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(isoDate))
}

function removeLog(logId: string): void {
  if (!window.confirm('Xóa lần check-in này? EXP và thống kê sẽ được tính lại.')) {
    return
  }

  checkInStore.undoCheckIn(logId)
  feedbackMessage.value = 'Đã xóa check-in và tính lại tiến trình.'
}
</script>

<template>
  <section>
    <div class="page-intro">
      <p class="eyebrow">Nhìn lại để tiếp tục</p>
      <h1>Hành trình</h1>
      <p>Không phải để phán xét, mà để nhận ra bạn đã xuất hiện nhiều hơn mình nghĩ.</p>
    </div>

    <p v-if="feedbackMessage" class="feedback feedback--success" role="status">{{ feedbackMessage }}</p>

    <div class="journey-stats-grid">
      <div class="journey-stat journey-stat--highlight"><span>Streak hiện tại</span><strong>{{ streakStats.currentStreak }} ngày</strong><small>Một ngày một bước</small></div>
      <div class="journey-stat"><span>Streak dài nhất</span><strong>{{ streakStats.longestStreak }} ngày</strong><small>Kỷ lục của bạn</small></div>
      <div class="journey-stat"><span>7 ngày qua</span><strong>{{ streakStats.completionRateLast7 }}%</strong><small>{{ streakStats.completedDaysLast7 }}/7 ngày hoạt động</small></div>
      <div class="journey-stat"><span>30 ngày qua</span><strong>{{ streakStats.completionRateLast30 }}%</strong><small>{{ streakStats.completedDaysLast30 }}/30 ngày hoạt động</small></div>
    </div>

    <div class="journey-summary"><div><span>Tổng số lần hoàn thành</span><strong>{{ filteredLogs.length }}</strong></div><div><span>Tổng thời gian</span><strong>{{ totalDuration }} phút</strong></div></div>

    <div class="journey-filter-card">
      <div class="form-grid">
        <label class="field"><span>Từ ngày</span><input v-model="fromDate" type="date" /></label>
        <label class="field"><span>Đến ngày</span><input v-model="toDate" type="date" /></label>
        <label class="field"><span>Thói quen</span><select v-model="habitFilter"><option value="all">Tất cả thói quen</option><option v-for="habit in habitStore.habits" :key="habit.id" :value="habit.id">{{ habit.name }}</option></select></label>
        <label class="field"><span>Nhóm bản sắc</span><select v-model="identityFilter"><option value="all">Tất cả nhóm</option><option v-for="category in identityCategories" :key="category" :value="category">{{ identityCategoryLabels[category] }}</option></select></label>
      </div>
    </div>

    <div class="section-heading"><div><span class="eyebrow">Nhật ký</span><h2>Các lần check-in</h2></div><span class="section-count">{{ filteredLogs.length }} kết quả</span></div>

    <div v-if="filteredLogs.length" class="journey-log-list">
      <article v-for="log in filteredLogs" :key="log.id" class="journey-log-row">
        <div class="journey-log-row__marker" aria-hidden="true">✓</div>
        <div class="journey-log-row__content"><div class="journey-log-row__title"><h3>{{ getHabitName(log.habitId) }}</h3><span class="badge badge--green">+{{ log.experienceEarned }} EXP</span></div><p>{{ formatDateTime(log.completedAt) }} · {{ log.completionType === 'full' ? 'Phiên bản đầy đủ' : 'Phiên bản tối thiểu' }}<span v-if="log.durationMinutes !== null"> · {{ log.durationMinutes }} phút</span></p><small v-if="log.note">“{{ log.note }}”</small></div>
        <button class="button button--small button--danger" type="button" @click="removeLog(log.id)">Xóa</button>
      </article>
    </div>
    <div v-else class="empty-state"><span class="empty-state__icon" aria-hidden="true">🪴</span><h2>Chưa có dữ liệu phù hợp</h2><p>Những lần check-in của bạn sẽ tạo nên câu chuyện ở đây.</p></div>
  </section>
</template>
