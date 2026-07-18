<script setup lang="ts">
import { ref, watch } from 'vue'

import { identityCategories, identityCategoryLabels } from '../../constants/identity'
import type { Habit } from '../../models'
import { type HabitInput, validateHabitInput, type ValidationErrors } from '../../utils/validators'

const props = defineProps<{
  habit: Habit | null
}>()

const emit = defineEmits<{
  submit: [input: HabitInput]
  cancel: []
}>()

function emptyForm(): HabitInput {
  return {
    name: '',
    description: '',
    identityStatement: '',
    identityCategory: 'discipline',
    targetType: 'daily',
    targetCount: 1,
    minimumVersion: '',
    experienceReward: 10,
  }
}

function formFromHabit(habit: Habit | null): HabitInput {
  if (!habit) {
    return emptyForm()
  }

  return {
    name: habit.name,
    description: habit.description,
    identityStatement: habit.identityStatement,
    identityCategory: habit.identityCategory,
    targetType: habit.targetType,
    targetCount: habit.targetCount,
    minimumVersion: habit.minimumVersion,
    experienceReward: habit.experienceReward,
  }
}

const form = ref<HabitInput>(formFromHabit(props.habit))
const errors = ref<ValidationErrors>({})
const isSubmitting = ref(false)

watch(
  () => props.habit,
  (habit) => {
    form.value = formFromHabit(habit)
    errors.value = {}
  },
)

function handleSubmit(): void {
  if (isSubmitting.value) {
    return
  }

  errors.value = validateHabitInput(form.value)

  if (Object.keys(errors.value).length > 0) {
    return
  }

  isSubmitting.value = true

  try {
    emit('submit', { ...form.value })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <form class="habit-form" novalidate @submit.prevent="handleSubmit">
    <div class="form-heading">
      <div>
        <p class="eyebrow">{{ habit ? 'Chỉnh sửa' : 'Tạo mới' }}</p>
        <h2>{{ habit ? 'Điều chỉnh thói quen' : 'Thêm một thói quen nhỏ' }}</h2>
      </div>
      <button class="icon-button" type="button" aria-label="Đóng biểu mẫu" @click="emit('cancel')">×</button>
    </div>

    <div class="form-grid">
      <label class="field field--wide">
        <span>Tên thói quen <b aria-hidden="true">*</b></span>
        <input v-model="form.name" type="text" maxlength="150" placeholder="Ví dụ: Học C#" />
        <small v-if="errors.name" class="field-error">{{ errors.name }}</small>
      </label>

      <label class="field field--wide">
        <span>Điều này giúp tôi trở thành...</span>
        <input v-model="form.identityStatement" type="text" maxlength="500" placeholder="Tôi là developer luôn tiến bộ." />
        <small v-if="errors.identityStatement" class="field-error">{{ errors.identityStatement }}</small>
      </label>

      <label class="field field--wide">
        <span>Mô tả</span>
        <textarea v-model="form.description" rows="2" maxlength="1000" placeholder="Vì sao thói quen này có ý nghĩa với bạn?"></textarea>
        <small v-if="errors.description" class="field-error">{{ errors.description }}</small>
      </label>

      <label class="field">
        <span>Nhóm bản sắc</span>
        <select v-model="form.identityCategory">
          <option v-for="category in identityCategories" :key="category" :value="category">
            {{ identityCategoryLabels[category] }}
          </option>
        </select>
      </label>

      <label class="field">
        <span>Mục tiêu</span>
        <div class="inline-fields">
          <select v-model="form.targetType">
            <option value="daily">Mỗi ngày</option>
            <option value="weekly">Mỗi tuần</option>
          </select>
          <input v-model.number="form.targetCount" type="number" min="1" aria-label="Số lần mục tiêu" />
        </div>
        <small v-if="errors.targetCount" class="field-error">{{ errors.targetCount }}</small>
      </label>

      <label class="field field--wide">
        <span>Phiên bản tối thiểu <b aria-hidden="true">*</b></span>
        <input v-model="form.minimumVersion" type="text" maxlength="300" placeholder="Mở project và đọc code trong 2 phút." />
        <small v-if="errors.minimumVersion" class="field-error">{{ errors.minimumVersion }}</small>
      </label>

      <label class="field">
        <span>EXP cơ bản</span>
        <input v-model.number="form.experienceReward" type="number" min="1" max="100" />
        <small v-if="errors.experienceReward" class="field-error">{{ errors.experienceReward }}</small>
      </label>
    </div>

    <div class="form-actions">
      <button class="button button--ghost" type="button" @click="emit('cancel')">Hủy</button>
      <button class="button button--primary" type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? 'Đang lưu...' : habit ? 'Lưu thay đổi' : 'Tạo thói quen' }}
      </button>
    </div>
  </form>
</template>
