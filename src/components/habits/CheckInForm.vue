<script setup lang="ts">
import { ref } from 'vue'

import type { Habit, HabitCompletionType } from '../../models'
import { getDateTimeLocalValue } from '../../utils/dateUtils'
import type { CheckInInput } from '../../stores/checkInStore'

defineProps<{
  habit: Habit
}>()

const emit = defineEmits<{
  submit: [input: CheckInInput]
  cancel: []
}>()

const completionType = ref<HabitCompletionType>('full')
const completedAt = ref(getDateTimeLocalValue())
const durationMinutes = ref<number | null>(null)
const note = ref('')
const errorMessage = ref('')
const isSaving = ref(false)

function handleSubmit(habit: Habit): void {
  if (isSaving.value) {
    return
  }

  const completedDate = new Date(completedAt.value)
  const duration = durationMinutes.value

  if (Number.isNaN(completedDate.getTime())) {
    errorMessage.value = 'Hãy chọn thời điểm thực hiện hợp lệ.'
    return
  }

  if (duration !== null && (duration < 0 || duration > 1440)) {
    errorMessage.value = 'Thời lượng phải từ 0 đến 1440 phút.'
    return
  }

  if (note.value.trim().length > 1000) {
    errorMessage.value = 'Ghi chú tối đa 1000 ký tự.'
    return
  }

  errorMessage.value = ''
  isSaving.value = true

  try {
    emit('submit', {
      habitId: habit.id,
      completionType: completionType.value,
      completedAt: completedDate.toISOString(),
      note: note.value,
      durationMinutes: duration,
    })
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <form class="habit-form" novalidate @submit.prevent="handleSubmit(habit)">
    <div class="form-heading">
      <div>
        <p class="eyebrow">Ghi nhận tiến trình</p>
        <h2>{{ habit.name }}</h2>
      </div>
      <button class="icon-button" type="button" aria-label="Đóng biểu mẫu" @click="emit('cancel')">×</button>
    </div>

    <div class="check-in-options">
      <label class="completion-option" :class="{ 'completion-option--selected': completionType === 'minimum' }">
        <input v-model="completionType" type="radio" value="minimum" />
        <span><b>Phiên bản tối thiểu</b><small>+{{ Math.max(1, Math.floor(habit.experienceReward * 0.5)) }} EXP</small></span>
      </label>
      <label class="completion-option" :class="{ 'completion-option--selected': completionType === 'full' }">
        <input v-model="completionType" type="radio" value="full" />
        <span><b>Phiên bản đầy đủ</b><small>+{{ habit.experienceReward }} EXP</small></span>
      </label>
    </div>

    <div class="form-grid">
      <label class="field">
        <span>Thời điểm thực hiện</span>
        <input v-model="completedAt" type="datetime-local" />
      </label>
      <label class="field">
        <span>Thời lượng (phút)</span>
        <input v-model.number="durationMinutes" type="number" min="0" max="1440" placeholder="Không bắt buộc" />
      </label>
      <label class="field field--wide">
        <span>Ghi chú</span>
        <textarea v-model="note" rows="3" maxlength="1000" placeholder="Bạn nhận thấy điều gì sau lần này?"></textarea>
      </label>
    </div>

    <p v-if="errorMessage" class="feedback feedback--error" role="alert">{{ errorMessage }}</p>

    <div class="form-actions">
      <button class="button button--ghost" type="button" @click="emit('cancel')">Hủy</button>
      <button class="button button--primary" type="submit" :disabled="isSaving">
        {{ isSaving ? 'Đang ghi nhận...' : 'Lưu check-in' }}
      </button>
    </div>
  </form>
</template>
