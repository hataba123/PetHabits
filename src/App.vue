<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'

const navigationItems = [
  { label: 'Hôm nay', to: '/' },
  { label: 'Thói quen', to: '/habits' },
  { label: 'Bạn đồng hành', to: '/companion' },
  { label: 'Hành trình', to: '/journey' },
  { label: 'Cài đặt', to: '/settings' },
]
</script>

<template>
  <div class="app-shell">
    <header class="app-header">
      <RouterLink class="brand" to="/">
        <span class="brand-mark" aria-hidden="true">✦</span>
        <span>
          <strong>PetHabits</strong>
          <small>Những bước nhỏ, phiên bản tốt hơn</small>
        </span>
      </RouterLink>

      <nav class="main-nav" aria-label="Điều hướng chính">
        <RouterLink
          v-for="item in navigationItems"
          :key="item.to"
          :to="item.to"
          class="nav-link"
          active-class="nav-link--active"
        >
          {{ item.label }}
        </RouterLink>
      </nav>
    </header>

    <main class="page-container">
      <RouterView />
    </main>
  </div>
</template>
