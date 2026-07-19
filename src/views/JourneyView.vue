<script setup lang="ts">
import { computed, ref } from 'vue'

import { identityCategories, identityCategoryLabels } from '../constants/identity'
import { useAppStore } from '../stores/appStore'
import { useCheckInStore } from '../stores/checkInStore'
import { useHabitStore } from '../stores/habitStore'
import type { Habit, IdentityCategory } from '../models'
import {
  buildHeatmap,
  calculateHabitAnalytics,
  calculateWeekComparison,
  formatMinutes,
  type AnalyticsPeriod,
  type HeatmapCell,
} from '../utils/journeyAnalytics'
import { getLocalDateKeyFromIso } from '../utils/dateUtils'

const appStore = useAppStore()
const checkInStore = useCheckInStore()
const habitStore = useHabitStore()
const fromDate = ref('')
const toDate = ref('')
const habitFilter = ref('all')
const identityFilter = ref<'all' | IdentityCategory>('all')
const feedbackMessage = ref('')
const selectedPeriod = ref<AnalyticsPeriod>(30)
const periodOptions: AnalyticsPeriod[] = [30, 90]

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

const totalDurationAllTime = computed(() => checkInStore.logs.reduce((total, log) => total + (log.durationMinutes ?? 0), 0))
const streakStats = computed(() => checkInStore.getStreakStats())
const heatmap = computed(() => buildHeatmap(checkInStore.logs, selectedPeriod.value))
const heatmapActiveDays = computed(() => heatmap.value.filter((cell) => cell.completionCount > 0).length)
const heatmapGrid = computed<(HeatmapCell | null)[]>(() => {
  const firstCell = heatmap.value[0]

  if (!firstCell) {
    return []
  }

  const [year, month, day] = firstCell.dateKey.split('-').map(Number)
  const firstDay = new Date(year, month - 1, day).getDay()
  const firstDayOfWeek = appStore.settings.firstDayOfWeek
  const paddingCount = (firstDay - firstDayOfWeek + 7) % 7

  return [...Array.from({ length: paddingCount }, () => null), ...heatmap.value]
})
const weekdayLabels = computed(() => {
  const labels = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
  const firstDayOfWeek = appStore.settings.firstDayOfWeek
  return Array.from({ length: 7 }, (_, index) => labels[(firstDayOfWeek + index) % 7])
})
const habitAnalytics = computed(() => {
  return habitStore.activeHabits.map((habit) => ({
    habit,
    stats: calculateHabitAnalytics(habit, checkInStore.logs, selectedPeriod.value),
  }))
})
const weekComparison = computed(() => calculateWeekComparison(checkInStore.logs, new Date(), appStore.settings.firstDayOfWeek))
const weekChartMax = computed(() => Math.max(1, weekComparison.value.current.completionCount, weekComparison.value.previous.completionCount))

function getHabitName(habitId: string): string {
  return habitStore.habits.find((habit) => habit.id === habitId)?.name || 'Thói quen đã xóa'
}

function getHabitTargetLabel(habit: Habit): string {
  return `${habit.targetCount} lần ${habit.targetType === 'daily' ? 'mỗi ngày' : 'mỗi tuần'}`
}

function getHeatmapTitle(cell: HeatmapCell | null): string | undefined {
  if (!cell) {
    return undefined
  }

  const timeLabel = cell.durationMinutes ? ` · ${formatMinutes(cell.durationMinutes)}` : ''
  return `${cell.label}: ${cell.completionCount} lần hoàn thành${timeLabel}`
}

function getWeekBarWidth(completionCount: number): string {
  return `${Math.round((completionCount / weekChartMax.value) * 100)}%`
}

function formatDateKey(dateKey: string): string {
  const [year, month, day] = dateKey.split('-').map(Number)
  return new Intl.DateTimeFormat('vi-VN', { day: 'numeric', month: 'short' }).format(new Date(year, month - 1, day))
}

function formatWeekRange(startDateKey: string, endDateKey: string): string {
  return `${formatDateKey(startDateKey)} – ${formatDateKey(endDateKey)}`
}

function formatSigned(value: number, unit: string): string {
  return `${value > 0 ? '+' : ''}${value} ${unit}`
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
    <div class="page-intro page-intro--row">
      <div>
        <p class="eyebrow">Nhìn lại để tiếp tục</p>
        <h1>Hành trình</h1>
        <p>Không phải để phán xét, mà để nhận ra bạn đã xuất hiện nhiều hơn mình nghĩ.</p>
      </div>
      <div class="journey-period-switch" role="group" aria-label="Khoảng thời gian thống kê">
        <button
          v-for="period in periodOptions"
          :key="period"
          class="filter-tab"
          :class="{ 'filter-tab--active': selectedPeriod === period }"
          type="button"
          @click="selectedPeriod = period"
        >
          {{ period }} ngày
        </button>
      </div>
    </div>

    <p v-if="feedbackMessage" class="feedback feedback--success" role="status">{{ feedbackMessage }}</p>

    <div class="journey-stats-grid">
      <div class="journey-stat journey-stat--highlight"><span>Streak hiện tại</span><strong>{{ streakStats.currentStreak }} ngày</strong><small>Một ngày một bước</small></div>
      <div class="journey-stat"><span>Streak dài nhất</span><strong>{{ streakStats.longestStreak }} ngày</strong><small>Kỷ lục của bạn</small></div>
      <div class="journey-stat"><span>7 ngày qua</span><strong>{{ streakStats.completionRateLast7 }}%</strong><small>{{ streakStats.completedDaysLast7 }}/7 ngày hoạt động</small></div>
      <div class="journey-stat"><span>30 ngày qua</span><strong>{{ streakStats.completionRateLast30 }}%</strong><small>{{ streakStats.completedDaysLast30 }}/30 ngày hoạt động</small></div>
    </div>

    <div class="journey-summary">
      <div><span>Check-in theo bộ lọc</span><strong>{{ filteredLogs.length }}</strong></div>
      <div><span>Tổng thời gian đã đầu tư</span><strong>{{ formatMinutes(totalDurationAllTime) }}</strong></div>
      <div><span>Ngày có hoạt động</span><strong>{{ heatmapActiveDays }}/{{ selectedPeriod }} ngày</strong></div>
    </div>

    <div class="journey-filter-card">
      <div class="form-grid">
        <label class="field"><span>Từ ngày</span><input v-model="fromDate" type="date" /></label>
        <label class="field"><span>Đến ngày</span><input v-model="toDate" type="date" /></label>
        <label class="field"><span>Thói quen</span><select v-model="habitFilter"><option value="all">Tất cả thói quen</option><option v-for="habit in habitStore.habits" :key="habit.id" :value="habit.id">{{ habit.name }}</option></select></label>
        <label class="field"><span>Nhóm bản sắc</span><select v-model="identityFilter"><option value="all">Tất cả nhóm</option><option v-for="category in identityCategories" :key="category" :value="category">{{ identityCategoryLabels[category] }}</option></select></label>
      </div>
    </div>

    <div class="journey-dashboard-grid">
      <article class="journey-panel journey-panel--wide">
        <div class="journey-panel__heading">
          <div><span class="eyebrow">Nhịp xuất hiện</span><h2>Lịch hoạt động {{ selectedPeriod }} ngày</h2></div>
          <span class="section-count">{{ heatmapActiveDays }} ngày có check-in</span>
        </div>
        <div class="journey-heatmap" aria-label="Lịch heatmap hoạt động">
          <div class="journey-heatmap__weekday-row" aria-hidden="true"><span v-for="label in weekdayLabels" :key="label">{{ label }}</span></div>
          <div class="journey-heatmap__grid">
            <span
              v-for="(cell, index) in heatmapGrid"
              :key="cell?.dateKey || `padding-${index}`"
              class="journey-heatmap__cell"
              :class="cell ? `journey-heatmap__cell--${cell.intensity}` : 'journey-heatmap__cell--empty'"
              :title="getHeatmapTitle(cell)"
              :aria-label="getHeatmapTitle(cell)"
            ></span>
          </div>
          <div class="journey-heatmap__legend"><span>Ít</span><i class="journey-heatmap__cell journey-heatmap__cell--0"></i><i class="journey-heatmap__cell journey-heatmap__cell--1"></i><i class="journey-heatmap__cell journey-heatmap__cell--2"></i><i class="journey-heatmap__cell journey-heatmap__cell--3"></i><i class="journey-heatmap__cell journey-heatmap__cell--4"></i><span>Nhiều</span></div>
        </div>
      </article>

      <article class="journey-panel">
        <div class="journey-panel__heading"><div><span class="eyebrow">Nhịp tuần</span><h2>Tuần này và tuần trước</h2></div></div>
        <div class="journey-week-comparison">
          <div class="journey-week-row"><div class="journey-week-row__label"><strong>Tuần này</strong><small>{{ formatWeekRange(weekComparison.current.startDateKey, weekComparison.current.endDateKey) }}</small></div><b>{{ weekComparison.current.completionCount }} lần</b></div>
          <div class="journey-week-bar"><span :style="{ width: getWeekBarWidth(weekComparison.current.completionCount) }"></span></div>
          <div class="journey-week-row"><div class="journey-week-row__label"><strong>Tuần trước</strong><small>{{ formatWeekRange(weekComparison.previous.startDateKey, weekComparison.previous.endDateKey) }}</small></div><b>{{ weekComparison.previous.completionCount }} lần</b></div>
          <div class="journey-week-bar journey-week-bar--muted"><span :style="{ width: getWeekBarWidth(weekComparison.previous.completionCount) }"></span></div>
          <div class="journey-week-deltas"><span>{{ formatSigned(weekComparison.completionDelta, 'lần') }}</span><span>{{ formatSigned(weekComparison.activeDayDelta, 'ngày hoạt động') }}</span><span>{{ formatSigned(weekComparison.durationDelta, 'phút') }}</span></div>
        </div>
      </article>

      <article class="journey-panel journey-panel--wide">
        <div class="journey-panel__heading"><div><span class="eyebrow">Theo từng thói quen</span><h2>Tỷ lệ và streak riêng</h2></div><span class="section-count">{{ selectedPeriod }} ngày gần nhất</span></div>
        <div v-if="habitAnalytics.length" class="journey-habit-performance-list">
          <article v-for="entry in habitAnalytics" :key="entry.habit.id" class="journey-habit-performance">
            <div class="journey-habit-performance__heading"><div><h3>{{ entry.habit.name }}</h3><small>{{ getHabitTargetLabel(entry.habit) }}</small></div><strong>{{ entry.stats.completionRate }}%</strong></div>
            <div class="progress-track journey-habit-performance__track"><span :style="{ width: `${entry.stats.completionRate}%` }"></span></div>
            <div class="journey-habit-performance__metrics"><span><b>{{ entry.stats.currentStreak }}</b><small>streak hiện tại</small></span><span><b>{{ entry.stats.longestStreak }}</b><small>streak dài nhất</small></span><span><b>{{ entry.stats.completionCount }}/{{ entry.stats.expectedCount }}</b><small>lần mục tiêu</small></span><span><b>{{ formatMinutes(entry.stats.totalDurationMinutes) }}</b><small>thời gian</small></span></div>
          </article>
        </div>
        <div v-else class="empty-state empty-state--compact"><h2>Chưa có thói quen hoạt động</h2><p>Hãy tạo một thói quen để xem tiến độ riêng.</p></div>
      </article>
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
