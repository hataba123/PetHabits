<script setup lang="ts">
import { computed } from 'vue'

import { identityCategoryLabels } from '../constants/identity'
import { useCompanionStore } from '../stores/companionStore'

const companionStore = useCompanionStore()
const companion = computed(() => companionStore.companion)
const progressPercent = computed(() => Math.min(100, Math.round((companion.value.currentExperience / companion.value.experienceToNextLevel) * 100)))
const stageLabels = {
  egg: 'Trứng',
  baby: 'Thú con',
  teen: 'Thiếu niên',
  adult: 'Trưởng thành',
  evolved: 'Tiến hóa',
} as const
const stageEmoji = {
  egg: '🥚',
  baby: '🐣',
  teen: '🐾',
  adult: '🦊',
  evolved: '✨',
} as const
</script>

<template>
  <section>
    <div class="page-intro">
      <p class="eyebrow">Mỗi lần xuất hiện đều được ghi nhận</p>
      <h1>Bạn đồng hành</h1>
      <p>Tiến trình của bạn đang nuôi lớn {{ companion.name }} theo cách rất riêng.</p>
    </div>

    <div class="companion-hero-card">
      <div class="companion-orb" aria-hidden="true"><span>{{ stageEmoji[companion.growthStage] }}</span><i></i></div>
      <div class="companion-hero-card__content"><span class="eyebrow">Giai đoạn {{ stageLabels[companion.growthStage] }}</span><h2>{{ companion.name }}</h2><p>{{ companion.level >= 5 ? 'Bạn đang xây dựng một nhịp sống ngày càng vững vàng.' : 'Một người bạn nhỏ đang lớn lên cùng từng bước của bạn.' }}</p></div>
      <div class="level-pill"><span>Level</span><strong>{{ companion.level }}</strong></div>
    </div>

    <div class="stats-grid">
      <div class="stat-card"><span>Tổng EXP</span><strong>{{ companion.totalExperience }}</strong><small>Từ {{ companionStore.totalExperience === 0 ? 0 : 'lịch sử' }} hoàn thành</small></div>
      <div class="stat-card"><span>EXP hiện tại</span><strong>{{ companion.currentExperience }} <small>/ {{ companion.experienceToNextLevel }}</small></strong><small>Còn {{ companion.experienceToNextLevel - companion.currentExperience }} EXP để lên level</small></div>
      <div class="stat-card"><span>Giai đoạn</span><strong>{{ stageLabels[companion.growthStage] }}</strong><small>Level {{ companion.level }}</small></div>
    </div>

    <div class="progress-card"><div class="progress-card__heading"><span>Tiến tới level tiếp theo</span><b>{{ progressPercent }}%</b></div><div class="progress-track"><span :style="{ width: `${progressPercent}%` }"></span></div><p>{{ companion.currentExperience }}/{{ companion.experienceToNextLevel }} EXP · Cứ tiếp tục với một bước đủ nhỏ.</p></div>

    <div class="section-heading"><div><span class="eyebrow">Bản sắc đang lớn lên</span><h2>Những phẩm chất bạn đang rèn</h2></div></div>
    <div class="identity-list">
      <div v-for="score in companionStore.identityScores" :key="score.category" class="identity-row"><div class="identity-row__label"><span>{{ identityCategoryLabels[score.category] }}</span><b>{{ score.points }} điểm</b></div><div class="progress-track"><span :style="{ width: `${score.percentage}%` }"></span></div></div>
    </div>

    <p class="encouragement">“Bạn không cần thay đổi toàn bộ cuộc đời trong một ngày. Chỉ cần chọn hành động tiếp theo.”</p>
  </section>
</template>
