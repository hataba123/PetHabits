<script setup lang="ts">
import { computed, ref } from 'vue'

import HabitCard from '../components/habits/HabitCard.vue'
import HabitForm from '../components/habits/HabitForm.vue'
import type { Habit } from '../models'
import { useHabitStore } from '../stores/habitStore'
import type { HabitInput } from '../utils/validators'

type HabitFilter = 'all' | 'active' | 'paused'

const habitStore = useHabitStore()
const searchQuery = ref('')
const filter = ref<HabitFilter>('all')
const isFormOpen = ref(false)
const editingHabit = ref<Habit | null>(null)
const feedbackMessage = ref('')

const filteredHabits = computed(() => {
  const query = searchQuery.value.trim().toLocaleLowerCase('vi-VN')

  return habitStore.habits.filter((habit) => {
    const matchesFilter =
      filter.value === 'all' ||
      (filter.value === 'active' && habit.isActive) ||
      (filter.value === 'paused' && !habit.isActive)
    const matchesSearch = !query || habit.name.toLocaleLowerCase('vi-VN').includes(query)

    return matchesFilter && matchesSearch
  })
})

function openCreateForm(): void {
  editingHabit.value = null
  isFormOpen.value = true
}

function openEditForm(habit: Habit): void {
  editingHabit.value = habit
  isFormOpen.value = true
}

function closeForm(): void {
  isFormOpen.value = false
  editingHabit.value = null
}

function saveHabit(input: HabitInput): void {
  if (editingHabit.value) {
    habitStore.updateHabit(editingHabit.value.id, input)
    feedbackMessage.value = 'Đã cập nhật thói quen.'
  } else {
    habitStore.createHabit(input)
    feedbackMessage.value = 'Đã thêm thói quen mới.'
  }

  closeForm()
}

function toggleHabit(habit: Habit): void {
  habitStore.setHabitActive(habit.id, !habit.isActive)
  feedbackMessage.value = habit.isActive ? 'Đã tạm dừng thói quen.' : 'Đã kích hoạt lại thói quen.'
}

function removeHabit(habit: Habit): void {
  if (!window.confirm(`Xóa thói quen “${habit.name}” và lịch sử liên quan?`)) {
    return
  }

  habitStore.deleteHabit(habit.id)
  feedbackMessage.value = 'Đã xóa thói quen.'
}
</script>

<template>
  <section>
    <div class="page-intro page-intro--row">
      <div>
        <p class="eyebrow">Thiết kế hệ thống của bạn</p>
        <h1>Thói quen</h1>
        <p>Những hành động đủ nhỏ để bạn có thể xuất hiện mỗi ngày.</p>
      </div>
      <button class="button button--primary" type="button" @click="openCreateForm">+ Thêm thói quen</button>
    </div>

    <p v-if="feedbackMessage" class="feedback feedback--success" role="status">{{ feedbackMessage }}</p>

    <div class="toolbar">
      <label class="search-field">
        <span class="sr-only">Tìm kiếm thói quen</span>
        <input v-model="searchQuery" type="search" placeholder="Tìm theo tên thói quen..." />
      </label>
      <div class="filter-tabs" aria-label="Lọc thói quen">
        <button v-for="option in (['all', 'active', 'paused'] as HabitFilter[])" :key="option" class="filter-tab" :class="{ 'filter-tab--active': filter === option }" type="button" @click="filter = option">
          {{ option === 'all' ? 'Tất cả' : option === 'active' ? 'Đang làm' : 'Tạm dừng' }}
        </button>
      </div>
    </div>

    <div v-if="filteredHabits.length" class="habit-grid">
      <HabitCard
        v-for="habit in filteredHabits"
        :key="habit.id"
        :habit="habit"
        @edit="openEditForm(habit)"
        @toggle="toggleHabit(habit)"
        @remove="removeHabit(habit)"
      />
    </div>
    <div v-else class="empty-state">
      <span class="empty-state__icon" aria-hidden="true">🌱</span>
      <h2>{{ habitStore.habits.length ? 'Không tìm thấy thói quen' : 'Bắt đầu bằng một bước nhỏ' }}</h2>
      <p>{{ habitStore.habits.length ? 'Thử đổi bộ lọc hoặc từ khóa tìm kiếm.' : 'Một thói quen rõ ràng sẽ giúp bạn dễ dàng xuất hiện hơn.' }}</p>
      <button v-if="!habitStore.habits.length" class="button button--primary" type="button" @click="openCreateForm">Tạo thói quen đầu tiên</button>
    </div>

    <div v-if="isFormOpen" class="modal-backdrop" role="presentation" @click.self="closeForm">
      <div class="modal-panel" role="dialog" aria-modal="true" aria-labelledby="habit-form-title">
        <HabitForm :habit="editingHabit" @submit="saveHabit" @cancel="closeForm" />
      </div>
    </div>
  </section>
</template>
