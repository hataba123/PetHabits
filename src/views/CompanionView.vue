<script setup lang="ts">
import { computed, ref } from 'vue'

import CompanionAvatar from '../components/CompanionAvatar.vue'
import {
  companionAccessoryOptions,
  companionColorOptions,
  companionExpressionOptions,
} from '../constants/companion'
import { identityCategoryLabels } from '../constants/identity'
import type { CompanionAccessory, CompanionColor, CompanionExpression, CompanionRewardType } from '../models'
import { useCompanionStore } from '../stores/companionStore'

const companionStore = useCompanionStore()
const companion = computed(() => companionStore.companion)
const progressPercent = computed(() => Math.min(100, Math.round((companion.value.currentExperience / companion.value.experienceToNextLevel) * 100)))
const happinessPercent = computed(() => companion.value.happiness)
const unlockedAchievementCount = computed(() => companionStore.achievements.filter((achievement) => achievement.isUnlocked).length)
const customizationFeedback = ref('')
const stageLabels = {
  egg: 'Trứng',
  baby: 'Thú con',
  teen: 'Thiếu niên',
  adult: 'Trưởng thành',
  evolved: 'Tiến hóa',
} as const

const rewardTypeLabels: Record<CompanionRewardType, string> = {
  accessory: 'phụ kiện',
  color: 'màu sắc',
  expression: 'biểu cảm',
}

function isRewardUnlocked(type: CompanionRewardType, value: string): boolean {
  return companionStore.isRewardUnlocked(type, value)
}

function selectAccessory(value: CompanionAccessory): void {
  if (companionStore.equipAccessory(value)) {
    customizationFeedback.value = 'Đã trang bị phụ kiện mới cho bạn đồng hành.'
  }
}

function selectColor(value: CompanionColor): void {
  if (companionStore.equipColor(value)) {
    customizationFeedback.value = 'Đã đổi màu sắc. Một điểm nhấn nhỏ cho hành trình của bạn.'
  }
}

function selectExpression(value: CompanionExpression): void {
  if (companionStore.equipExpression(value)) {
    customizationFeedback.value = 'Đã cập nhật biểu cảm của bạn đồng hành.'
  }
}
</script>

<template>
  <section>
    <div class="page-intro">
      <p class="eyebrow">Mỗi lần xuất hiện đều được ghi nhận</p>
      <h1>Bạn đồng hành</h1>
      <p>Tiến trình của bạn đang nuôi lớn {{ companion.name }} theo cách rất riêng.</p>
    </div>

    <div class="companion-hero-card">
      <CompanionAvatar :shape="companion.shape" :growth-stage="companion.growthStage" :accessory="companion.accessory" :color="companion.color" :expression="companion.expression" />
      <div class="companion-hero-card__content"><span class="eyebrow">Giai đoạn {{ stageLabels[companion.growthStage] }}</span><h2>{{ companion.name }}</h2><p>{{ companion.level >= 5 ? 'Bạn đang xây dựng một nhịp sống ngày càng vững vàng.' : 'Một người bạn nhỏ đang lớn lên cùng từng bước của bạn.' }}</p></div>
      <div class="level-pill"><span>Level</span><strong>{{ companion.level }}</strong></div>
    </div>

    <div class="stats-grid">
      <div class="stat-card"><span>Tổng EXP</span><strong>{{ companion.totalExperience }}</strong><small>Từ {{ companionStore.totalExperience === 0 ? 0 : 'lịch sử' }} hoàn thành</small></div>
      <div class="stat-card"><span>EXP hiện tại</span><strong>{{ companion.currentExperience }} <small>/ {{ companion.experienceToNextLevel }}</small></strong><small>Còn {{ companion.experienceToNextLevel - companion.currentExperience }} EXP để lên level</small></div>
      <div class="stat-card"><span>Giai đoạn</span><strong>{{ stageLabels[companion.growthStage] }}</strong><small>Level {{ companion.level }}</small></div>
      <div class="stat-card stat-card--happiness"><span>Hạnh phúc</span><strong>{{ happinessPercent }}%</strong><small>Tăng nhờ nhịp đều, không phải sự hoàn hảo</small></div>
    </div>

    <div class="progress-card"><div class="progress-card__heading"><span>Tiến tới level tiếp theo</span><b>{{ progressPercent }}%</b></div><div class="progress-track"><span :style="{ width: `${progressPercent}%` }"></span></div><p>{{ companion.currentExperience }}/{{ companion.experienceToNextLevel }} EXP · Cứ tiếp tục với một bước đủ nhỏ.</p></div>

    <div class="happiness-card">
      <div class="happiness-card__heading"><div><span class="eyebrow">Nhịp điệu nhẹ nhàng</span><h2>Hạnh phúc lớn lên cùng sự đều đặn</h2></div><span class="happiness-card__emoji" aria-hidden="true">💛</span></div>
      <div class="progress-card__heading"><span>Phong độ gần đây</span><b>{{ happinessPercent }}%</b></div>
      <div class="progress-track progress-track--happiness"><span :style="{ width: `${happinessPercent}%` }"></span></div>
      <p>Một ngày bỏ lỡ không xóa đi những gì bạn đã xây dựng. Khi sẵn sàng, chỉ cần quay lại bằng bước nhỏ tiếp theo.</p>
    </div>

    <div class="section-heading"><div><span class="eyebrow">Bản sắc đang lớn lên</span><h2>Những phẩm chất bạn đang rèn</h2></div></div>
    <div class="identity-list">
      <div v-for="score in companionStore.identityScores" :key="score.category" class="identity-row"><div class="identity-row__label"><span>{{ identityCategoryLabels[score.category] }}</span><b>{{ score.points }} điểm</b></div><div class="progress-track"><span :style="{ width: `${score.percentage}%` }"></span></div></div>
    </div>

    <div class="section-heading companion-section-heading"><div><span class="eyebrow">Mở khóa theo hành trình</span><h2>Thành tựu của bạn</h2></div><span class="section-count">{{ unlockedAchievementCount }}/{{ companionStore.achievements.length }} đã mở khóa</span></div>
    <div class="achievement-grid">
      <article v-for="achievement in companionStore.achievements" :key="achievement.id" class="achievement-card" :class="{ 'achievement-card--unlocked': achievement.isUnlocked }">
        <div class="achievement-card__topline"><span class="achievement-card__icon" aria-hidden="true">{{ achievement.icon }}</span><span class="achievement-card__status">{{ achievement.isUnlocked ? 'Đã mở khóa' : `${achievement.current}/${achievement.target}` }}</span></div>
        <h3>{{ achievement.title }}</h3>
        <p>{{ achievement.description }}</p>
        <div v-if="!achievement.isUnlocked" class="achievement-card__track"><span :style="{ width: `${Math.round((achievement.current / achievement.target) * 100)}%` }"></span></div>
        <small v-if="achievement.isUnlocked" class="achievement-card__encouragement">{{ achievement.encouragement }}</small>
        <small v-else class="achievement-card__reward">Mở khóa {{ rewardTypeLabels[achievement.reward.type] }}: {{ achievement.reward.label }}</small>
      </article>
    </div>

    <div class="section-heading companion-section-heading"><div><span class="eyebrow">Góc cá tính</span><h2>Trang bị cho {{ companion.name }}</h2></div></div>
    <div class="customization-card">
      <p class="settings-help">Các lựa chọn cơ bản luôn sẵn sàng. Phần còn lại sẽ mở ra tự nhiên khi bạn đi qua những cột mốc của riêng mình.</p>
      <p v-if="customizationFeedback" class="feedback feedback--success" role="status">{{ customizationFeedback }}</p>

      <div class="customization-group"><div class="customization-group__heading"><h3>Phụ kiện</h3><small>Thêm một nét đáng yêu</small></div><div class="customization-options">
        <button v-for="option in companionAccessoryOptions" :key="option.value" class="customization-option" :class="{ 'customization-option--active': companion.accessory === option.value, 'customization-option--locked': !isRewardUnlocked('accessory', option.value) }" type="button" :disabled="!isRewardUnlocked('accessory', option.value)" :aria-pressed="companion.accessory === option.value" @click="selectAccessory(option.value)"><span class="customization-option__icon" aria-hidden="true">{{ option.icon }}</span><span><strong>{{ option.label }}</strong><small>{{ isRewardUnlocked('accessory', option.value) ? option.description : 'Mở khóa qua thành tựu' }}</small></span><b aria-hidden="true">{{ isRewardUnlocked('accessory', option.value) ? (companion.accessory === option.value ? '✓' : '') : '🔒' }}</b></button>
      </div></div>

      <div class="customization-group"><div class="customization-group__heading"><h3>Màu sắc</h3><small>Một không khí mới</small></div><div class="customization-options">
        <button v-for="option in companionColorOptions" :key="option.value" class="customization-option" :class="{ 'customization-option--active': companion.color === option.value, 'customization-option--locked': !isRewardUnlocked('color', option.value) }" type="button" :disabled="!isRewardUnlocked('color', option.value)" :aria-pressed="companion.color === option.value" @click="selectColor(option.value)"><span class="customization-option__swatch" :class="`customization-option__swatch--${option.value}`" aria-hidden="true"></span><span><strong>{{ option.label }}</strong><small>{{ isRewardUnlocked('color', option.value) ? option.description : 'Mở khóa qua thành tựu' }}</small></span><b aria-hidden="true">{{ isRewardUnlocked('color', option.value) ? (companion.color === option.value ? '✓' : '') : '🔒' }}</b></button>
      </div></div>

      <div class="customization-group"><div class="customization-group__heading"><h3>Biểu cảm</h3><small>Chọn cách bạn đồng hành mỉm cười</small></div><div class="customization-options">
        <button v-for="option in companionExpressionOptions" :key="option.value" class="customization-option" :class="{ 'customization-option--active': companion.expression === option.value, 'customization-option--locked': !isRewardUnlocked('expression', option.value) }" type="button" :disabled="!isRewardUnlocked('expression', option.value)" :aria-pressed="companion.expression === option.value" @click="selectExpression(option.value)"><span class="customization-option__icon" aria-hidden="true">{{ option.icon }}</span><span><strong>{{ option.label }}</strong><small>{{ isRewardUnlocked('expression', option.value) ? option.description : 'Mở khóa qua thành tựu' }}</small></span><b aria-hidden="true">{{ isRewardUnlocked('expression', option.value) ? (companion.expression === option.value ? '✓' : '') : '🔒' }}</b></button>
      </div></div>
    </div>

    <p class="encouragement">“Bạn không cần thay đổi toàn bộ cuộc đời trong một ngày. Chỉ cần chọn hành động tiếp theo.”</p>
  </section>
</template>
