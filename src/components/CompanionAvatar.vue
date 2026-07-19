<script setup lang="ts">
import { computed } from 'vue'

import { companionStageEmojis } from '../constants/companion'
import type { CompanionGrowthStage, CompanionShape } from '../models'

const props = withDefaults(
  defineProps<{
    shape: CompanionShape
    growthStage: CompanionGrowthStage
    variant?: 'hero' | 'mini' | 'option'
    showStatus?: boolean
  }>(),
  {
    variant: 'hero',
    showStatus: true,
  },
)

const avatarClasses = computed(() => [
  'companion-avatar',
  `companion-avatar--${props.variant}`,
  `companion-avatar--${props.shape}`,
])
</script>

<template>
  <div :class="avatarClasses" aria-hidden="true">
    <span>{{ companionStageEmojis[growthStage] }}</span>
    <i v-if="showStatus"></i>
  </div>
</template>
