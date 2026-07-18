<script setup lang="ts">
import { identityCategoryLabels } from '../../constants/identity'
import type { Habit } from '../../models'

defineProps<{
  habit: Habit
}>()

const emit = defineEmits<{
  edit: []
  toggle: []
  remove: []
}>()
</script>

<template>
  <article class="habit-card" :class="{ 'habit-card--paused': !habit.isActive }">
    <div class="habit-card__topline">
      <span class="badge" :class="habit.isActive ? 'badge--green' : 'badge--muted'">
        {{ habit.isActive ? 'Đang hoạt động' : 'Đang tạm dừng' }}
      </span>
      <span class="habit-card__exp">+{{ habit.experienceReward }} EXP</span>
    </div>
    <h3>{{ habit.name }}</h3>
    <p class="habit-card__identity">“{{ habit.identityStatement }}”</p>
    <p v-if="habit.description" class="habit-card__description">{{ habit.description }}</p>
    <div class="habit-card__meta">
      <span>{{ identityCategoryLabels[habit.identityCategory] }}</span>
      <span>{{ habit.targetType === 'daily' ? 'Mỗi ngày' : 'Mỗi tuần' }} · {{ habit.targetCount }} lần</span>
    </div>
    <div class="habit-card__actions">
      <button class="button button--small button--ghost" type="button" @click="emit('edit')">Sửa</button>
      <button class="button button--small button--ghost" type="button" @click="emit('toggle')">
        {{ habit.isActive ? 'Tạm dừng' : 'Kích hoạt' }}
      </button>
      <button class="button button--small button--danger" type="button" @click="emit('remove')">Xóa</button>
    </div>
  </article>
</template>
