<script setup lang="ts">
import { computed } from 'vue'

import { toCompanionAnimal } from '../constants/companion'
import type {
  CompanionAccessory,
  CompanionAnimal,
  CompanionColor,
  CompanionExpression,
  CompanionGrowthStage,
  CompanionShape,
} from '../models'

const props = withDefaults(
  defineProps<{
    shape: CompanionShape
    growthStage: CompanionGrowthStage
    accessory?: CompanionAccessory
    color?: CompanionColor
    expression?: CompanionExpression
    variant?: 'hero' | 'mini' | 'option'
    showStatus?: boolean
  }>(),
  {
    variant: 'hero',
    showStatus: true,
    accessory: 'none',
    color: 'natural',
    expression: 'calm',
  },
)

const animal = computed<CompanionAnimal>(() => toCompanionAnimal(props.shape))

const avatarClasses = computed(() => [
  'companion-avatar',
  `companion-avatar--${props.variant}`,
  `companion-avatar--${animal.value}`,
  `companion-avatar--${props.growthStage}`,
  `companion-avatar--${props.color}`,
  `companion-avatar--expression-${props.expression}`,
])
</script>

<template>
  <div :class="avatarClasses" aria-hidden="true">
    <svg class="companion-avatar__art" viewBox="0 0 120 120" focusable="false">
      <g v-if="animal === 'cat'" class="companion-avatar__animal companion-avatar__animal--cat">
        <path class="companion-avatar__cat-main" d="M28 49 23 20 49 37Z" />
        <path class="companion-avatar__cat-main" d="m92 49 5-29-26 17Z" />
        <path class="companion-avatar__cat-inner-ear" d="m29 39-2-12 11 9Z" />
        <path class="companion-avatar__cat-inner-ear" d="m91 39 2-12-11 9Z" />
        <path class="companion-avatar__cat-main" d="M27 56c0-19 14-31 33-31s33 12 33 31v24c0 17-14 27-33 27S27 97 27 80Z" />
        <path class="companion-avatar__cat-belly" d="M42 87c3-11 10-16 18-16s15 5 18 16c-4 9-10 14-18 14s-14-5-18-14Z" />
        <ellipse class="companion-avatar__eye" cx="46" cy="62" rx="5" ry="7" />
        <ellipse class="companion-avatar__eye" cx="74" cy="62" rx="5" ry="7" />
        <circle class="companion-avatar__eye-shine" cx="44.5" cy="60" r="1.6" />
        <circle class="companion-avatar__eye-shine" cx="72.5" cy="60" r="1.6" />
        <path class="companion-avatar__nose" d="m56 72 4-3 4 3-4 5Z" />
        <path class="companion-avatar__line" d="M60 77q-4 5-8 1m8-1q4 5 8 1M39 73l-12-2m12 7-12 2m42-7 12-2m-12 7 12 2" />
      </g>

      <g v-else-if="animal === 'fox'" class="companion-avatar__animal companion-avatar__animal--fox">
        <path class="companion-avatar__fox-main" d="M29 48 21 17l30 19Z" />
        <path class="companion-avatar__fox-main" d="m91 48 8-31-30 19Z" />
        <path class="companion-avatar__fox-ear" d="m29 38-4-14 14 10Z" />
        <path class="companion-avatar__fox-ear" d="m91 38 4-14-14 10Z" />
        <path class="companion-avatar__fox-main" d="M25 59c0-21 15-34 35-34s35 13 35 34c0 23-14 48-35 48S25 82 25 59Z" />
        <path class="companion-avatar__fox-muzzle" d="M37 71c3-13 11-19 23-19s20 6 23 19c-3 15-12 23-23 23s-20-8-23-23Z" />
        <path class="companion-avatar__fox-mask" d="M29 59c7-8 17-11 31-11s24 3 31 11l-8 12c-5-5-13-8-23-8s-18 3-23 8Z" />
        <ellipse class="companion-avatar__eye" cx="46" cy="62" rx="4.5" ry="6" />
        <ellipse class="companion-avatar__eye" cx="74" cy="62" rx="4.5" ry="6" />
        <circle class="companion-avatar__eye-shine" cx="44.5" cy="60" r="1.5" />
        <circle class="companion-avatar__eye-shine" cx="72.5" cy="60" r="1.5" />
        <path class="companion-avatar__nose" d="m55 75 5-4 5 4-5 5Z" />
        <path class="companion-avatar__line" d="M60 80q-4 5-8 1m8-1q4 5 8 1" />
      </g>

      <g v-else-if="animal === 'bunny'" class="companion-avatar__animal companion-avatar__animal--bunny">
        <path class="companion-avatar__bunny-main" d="M39 48C25 37 27 12 38 10c12-2 15 22 14 36Z" />
        <path class="companion-avatar__bunny-main" d="M81 48c14-11 12-36 1-38-12-2-15 22-14 36Z" />
        <path class="companion-avatar__bunny-inner-ear" d="M40 38c-7-9-6-20-1-21 6-1 8 12 7 21Z" />
        <path class="companion-avatar__bunny-inner-ear" d="M80 38c7-9 6-20 1-21-6-1-8 12-7 21Z" />
        <path class="companion-avatar__bunny-main" d="M27 66c0-22 14-36 33-36s33 14 33 36c0 24-14 41-33 41S27 90 27 66Z" />
        <ellipse class="companion-avatar__bunny-cheek" cx="43" cy="78" rx="12" ry="9" />
        <ellipse class="companion-avatar__bunny-cheek" cx="77" cy="78" rx="12" ry="9" />
        <ellipse class="companion-avatar__eye" cx="46" cy="64" rx="4.5" ry="6" />
        <ellipse class="companion-avatar__eye" cx="74" cy="64" rx="4.5" ry="6" />
        <circle class="companion-avatar__eye-shine" cx="44.5" cy="62" r="1.5" />
        <circle class="companion-avatar__eye-shine" cx="72.5" cy="62" r="1.5" />
        <path class="companion-avatar__nose" d="m56 75 4-3 4 3-4 5Z" />
        <path class="companion-avatar__line" d="M60 80q-4 5-8 1m8-1q4 5 8 1" />
      </g>

      <g v-else-if="animal === 'dog'" class="companion-avatar__animal companion-avatar__animal--dog">
        <path class="companion-avatar__dog-ear" d="M37 48C23 45 18 31 25 21c12 1 20 13 17 28Z" />
        <path class="companion-avatar__dog-ear" d="M83 48c14-3 19-17 12-27-12 1-20 13-17 28Z" />
        <path class="companion-avatar__dog-main" d="M26 59c0-21 15-34 34-34s34 13 34 34c0 23-14 48-34 48S26 82 26 59Z" />
        <ellipse class="companion-avatar__dog-muzzle" cx="60" cy="77" rx="22" ry="17" />
        <ellipse class="companion-avatar__eye" cx="46" cy="62" rx="4.5" ry="5.5" />
        <ellipse class="companion-avatar__eye" cx="74" cy="62" rx="4.5" ry="5.5" />
        <circle class="companion-avatar__eye-shine" cx="44.5" cy="60.5" r="1.5" />
        <circle class="companion-avatar__eye-shine" cx="72.5" cy="60.5" r="1.5" />
        <ellipse class="companion-avatar__dog-nose" cx="60" cy="75" rx="7" ry="5" />
        <path class="companion-avatar__line" d="M60 80q-4 5-8 1m8-1q4 5 8 1" />
        <path class="companion-avatar__dog-tongue" d="M55 84q5 2 10 0v7c0 5-10 5-10 0Z" />
      </g>

      <g v-else-if="animal === 'koala'" class="companion-avatar__animal companion-avatar__animal--koala">
        <circle class="companion-avatar__koala-ear" cx="32" cy="40" r="17" />
        <circle class="companion-avatar__koala-ear" cx="88" cy="40" r="17" />
        <circle class="companion-avatar__koala-inner-ear" cx="32" cy="40" r="10" />
        <circle class="companion-avatar__koala-inner-ear" cx="88" cy="40" r="10" />
        <path class="companion-avatar__koala-main" d="M26 61c0-21 15-35 34-35s34 14 34 35c0 25-14 46-34 46S26 86 26 61Z" />
        <path class="companion-avatar__koala-muzzle" d="M38 73c2-10 10-15 22-15s20 5 22 15c-2 13-10 20-22 20s-20-7-22-20Z" />
        <ellipse class="companion-avatar__eye" cx="46" cy="63" rx="4" ry="5" />
        <ellipse class="companion-avatar__eye" cx="74" cy="63" rx="4" ry="5" />
        <circle class="companion-avatar__eye-shine" cx="44.5" cy="61.5" r="1.4" />
        <circle class="companion-avatar__eye-shine" cx="72.5" cy="61.5" r="1.4" />
        <path class="companion-avatar__koala-nose" d="M52 73q8-7 16 0-1 9-8 9t-8-9Z" />
        <path class="companion-avatar__line" d="M60 82q-4 4-8 0m8 0q4 4 8 0" />
        <path class="companion-avatar__koala-leaf" d="M77 95q11-8 17-2-5 10-17 7Z" />
      </g>

      <g v-else-if="animal === 'penguin'" class="companion-avatar__animal companion-avatar__animal--penguin">
        <path class="companion-avatar__penguin-flipper" d="M31 61q-15 9-12 28 2 10 13 4l10-22Z" />
        <path class="companion-avatar__penguin-flipper" d="M89 61q15 9 12 28-2 10-13 4L78 71Z" />
        <path class="companion-avatar__penguin-main" d="M27 59c0-21 14-34 33-34s33 13 33 34c0 25-14 49-33 49S27 84 27 59Z" />
        <ellipse class="companion-avatar__penguin-belly" cx="60" cy="80" rx="23" ry="27" />
        <circle class="companion-avatar__eye" cx="47" cy="60" r="5" />
        <circle class="companion-avatar__eye" cx="73" cy="60" r="5" />
        <circle class="companion-avatar__eye-shine" cx="45.5" cy="58.5" r="1.5" />
        <circle class="companion-avatar__eye-shine" cx="71.5" cy="58.5" r="1.5" />
        <path class="companion-avatar__penguin-beak" d="m51 69 9-4 9 4-9 7Z" />
        <path class="companion-avatar__penguin-scarf" d="M38 94q22 10 44 0l-3 10q-19 8-38 0Z" />
      </g>

      <g v-else-if="animal === 'otter'" class="companion-avatar__animal companion-avatar__animal--otter">
        <circle class="companion-avatar__otter-ear" cx="34" cy="43" r="13" />
        <circle class="companion-avatar__otter-ear" cx="86" cy="43" r="13" />
        <circle class="companion-avatar__otter-inner-ear" cx="34" cy="43" r="6" />
        <circle class="companion-avatar__otter-inner-ear" cx="86" cy="43" r="6" />
        <path class="companion-avatar__otter-main" d="M27 60c0-21 14-34 33-34s33 13 33 34c0 24-14 47-33 47S27 84 27 60Z" />
        <ellipse class="companion-avatar__otter-muzzle" cx="60" cy="78" rx="22" ry="17" />
        <path class="companion-avatar__otter-belly" d="M40 91c4-8 11-12 20-12s16 4 20 12c-3 11-10 17-20 17S43 102 40 91Z" />
        <ellipse class="companion-avatar__eye" cx="46" cy="63" rx="4" ry="5" />
        <ellipse class="companion-avatar__eye" cx="74" cy="63" rx="4" ry="5" />
        <circle class="companion-avatar__eye-shine" cx="44.5" cy="61.5" r="1.4" />
        <circle class="companion-avatar__eye-shine" cx="72.5" cy="61.5" r="1.4" />
        <path class="companion-avatar__otter-nose" d="m54 74 6-4 6 4-6 6Z" />
        <path class="companion-avatar__line" d="M60 80q-4 5-8 1m8-1q4 5 8 1m-21 3-11 2m47-2 11 2" />
        <circle class="companion-avatar__otter-bubble" cx="96" cy="27" r="4" />
      </g>

      <g v-else-if="animal === 'hamster'" class="companion-avatar__animal companion-avatar__animal--hamster">
        <circle class="companion-avatar__hamster-ear" cx="37" cy="40" r="15" />
        <circle class="companion-avatar__hamster-ear" cx="83" cy="40" r="15" />
        <circle class="companion-avatar__hamster-inner-ear" cx="37" cy="40" r="8" />
        <circle class="companion-avatar__hamster-inner-ear" cx="83" cy="40" r="8" />
        <path class="companion-avatar__hamster-main" d="M26 62c0-21 15-34 34-34s34 13 34 34c0 24-14 45-34 45S26 86 26 62Z" />
        <ellipse class="companion-avatar__hamster-cheek" cx="41" cy="78" rx="13" ry="11" />
        <ellipse class="companion-avatar__hamster-cheek" cx="79" cy="78" rx="13" ry="11" />
        <ellipse class="companion-avatar__eye" cx="47" cy="62" rx="4" ry="5" />
        <ellipse class="companion-avatar__eye" cx="73" cy="62" rx="4" ry="5" />
        <circle class="companion-avatar__eye-shine" cx="45.5" cy="60.5" r="1.4" />
        <circle class="companion-avatar__eye-shine" cx="71.5" cy="60.5" r="1.4" />
        <circle class="companion-avatar__hamster-nose" cx="60" cy="75" r="4" />
        <path class="companion-avatar__line" d="M60 79q-4 4-8 1m8-1q4 4 8 1" />
        <path class="companion-avatar__hamster-seed" d="M90 94q8-7 12-1-3 8-11 7Z" />
      </g>

      <g v-else-if="animal === 'frog'" class="companion-avatar__animal companion-avatar__animal--frog">
        <circle class="companion-avatar__frog-bulb" cx="39" cy="40" r="15" />
        <circle class="companion-avatar__frog-bulb" cx="81" cy="40" r="15" />
        <path class="companion-avatar__frog-main" d="M25 63c0-19 15-31 35-31s35 12 35 31c0 24-15 44-35 44S25 87 25 63Z" />
        <ellipse class="companion-avatar__frog-eye" cx="39" cy="40" rx="5" ry="7" />
        <ellipse class="companion-avatar__frog-eye" cx="81" cy="40" rx="5" ry="7" />
        <circle class="companion-avatar__eye-shine" cx="37.5" cy="38" r="1.6" />
        <circle class="companion-avatar__eye-shine" cx="79.5" cy="38" r="1.6" />
        <path class="companion-avatar__frog-belly" d="M39 85c4-10 11-15 21-15s17 5 21 15c-3 12-10 18-21 18S42 97 39 85Z" />
        <path class="companion-avatar__line" d="M43 73q17 12 34 0M52 84q8 5 16 0" />
        <circle class="companion-avatar__frog-cheek" cx="38" cy="75" r="6" />
        <circle class="companion-avatar__frog-cheek" cx="82" cy="75" r="6" />
      </g>

      <g v-else-if="animal === 'turtle'" class="companion-avatar__animal companion-avatar__animal--turtle">
        <path class="companion-avatar__turtle-flipper" d="M38 69q-18-7-22 5 6 11 24 7Z" />
        <path class="companion-avatar__turtle-flipper" d="M82 69q18-7 22 5-6 11-24 7Z" />
        <ellipse class="companion-avatar__turtle-shell" cx="60" cy="72" rx="36" ry="35" />
        <path class="companion-avatar__turtle-shell-line" d="M60 38v68M29 66h62M38 47q22 14 44 0M38 94q22-14 44 0" />
        <path class="companion-avatar__turtle-head" d="M39 61c0-14 9-23 21-23s21 9 21 23v22c0 12-9 19-21 19s-21-7-21-19Z" />
        <circle class="companion-avatar__eye" cx="51" cy="65" r="4" />
        <circle class="companion-avatar__eye" cx="69" cy="65" r="4" />
        <circle class="companion-avatar__eye-shine" cx="49.5" cy="63.5" r="1.3" />
        <circle class="companion-avatar__eye-shine" cx="67.5" cy="63.5" r="1.3" />
        <path class="companion-avatar__line" d="M55 77q5 4 10 0" />
        <path class="companion-avatar__turtle-leaf" d="M91 30q9-7 14 0-6 8-14 6Z" />
      </g>

      <g v-else-if="animal === 'deer'" class="companion-avatar__animal companion-avatar__animal--deer">
        <path class="companion-avatar__deer-antler" d="M39 44V29l-8-8m8 14 8-10m34 19V29l8-8m-8 14-8-10" />
        <path class="companion-avatar__deer-ear" d="M39 48C25 44 20 33 26 25c12 0 20 9 18 22Z" />
        <path class="companion-avatar__deer-ear" d="M81 48c14-4 19-15 13-23-12 0-20 9-18 22Z" />
        <path class="companion-avatar__deer-main" d="M27 60c0-21 14-34 33-34s33 13 33 34c0 24-14 47-33 47S27 84 27 60Z" />
        <path class="companion-avatar__deer-muzzle" d="M39 75c3-11 10-16 21-16s18 5 21 16c-3 13-10 20-21 20s-18-7-21-20Z" />
        <circle class="companion-avatar__eye" cx="46" cy="62" r="4.5" />
        <circle class="companion-avatar__eye" cx="74" cy="62" r="4.5" />
        <circle class="companion-avatar__eye-shine" cx="44.5" cy="60.5" r="1.4" />
        <circle class="companion-avatar__eye-shine" cx="72.5" cy="60.5" r="1.4" />
        <path class="companion-avatar__deer-nose" d="m55 75 5-4 5 4-5 5Z" />
        <path class="companion-avatar__line" d="M60 80q-4 5-8 1m8-1q4 5 8 1" />
        <circle class="companion-avatar__deer-spot" cx="43" cy="45" r="3" />
        <circle class="companion-avatar__deer-spot" cx="77" cy="45" r="3" />
      </g>

      <g v-else class="companion-avatar__animal companion-avatar__animal--panda">
        <circle class="companion-avatar__panda-ear" cx="35" cy="37" r="14" />
        <circle class="companion-avatar__panda-ear" cx="85" cy="37" r="14" />
        <path class="companion-avatar__panda-main" d="M27 61c0-22 14-35 33-35s33 13 33 35c0 25-14 46-33 46S27 86 27 61Z" />
        <ellipse class="companion-avatar__panda-eye-patch" cx="45" cy="64" rx="11" ry="15" transform="rotate(28 45 64)" />
        <ellipse class="companion-avatar__panda-eye-patch" cx="75" cy="64" rx="11" ry="15" transform="rotate(-28 75 64)" />
        <ellipse class="companion-avatar__eye" cx="46" cy="64" rx="4" ry="5" />
        <ellipse class="companion-avatar__eye" cx="74" cy="64" rx="4" ry="5" />
        <circle class="companion-avatar__eye-shine" cx="44.5" cy="62.5" r="1.4" />
        <circle class="companion-avatar__eye-shine" cx="72.5" cy="62.5" r="1.4" />
        <path class="companion-avatar__nose" d="m56 76 4-3 4 3-4 5Z" />
        <path class="companion-avatar__line" d="M60 81q-4 5-8 1m8-1q4 5 8 1" />
        <path class="companion-avatar__panda-scarf" d="M37 94q23 10 46 0l-3 11q-20 8-40 0Z" />
      </g>

      <g v-if="accessory === 'sprout'" class="companion-avatar__accessory companion-avatar__accessory--sprout">
        <path d="M60 30c-1-8 1-13 5-18" />
        <path d="M61 24c-8 1-12-3-12-9 8-1 12 3 12 9Z" />
        <path d="M63 21c3-7 8-9 14-7-1 7-6 10-14 7Z" />
      </g>
      <path v-else-if="accessory === 'crown'" class="companion-avatar__accessory companion-avatar__accessory--crown" d="m40 29 4-15 10 9 6-13 6 13 10-9 4 15Z" />
      <path v-if="expression === 'wink'" class="companion-avatar__expression" d="M39 62q6-6 12 0m18 0q6-6 12 0" />
      <path v-if="growthStage === 'evolved'" class="companion-avatar__sparkle" d="m99 22 2 6 6 2-6 2-2 6-2-6-6-2 6-2Z" />
    </svg>
    <i v-if="showStatus"></i>
  </div>
</template>
