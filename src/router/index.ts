import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: () => import('../views/TodayView.vue') },
    { path: '/habits', component: () => import('../views/HabitsView.vue') },
    { path: '/companion', component: () => import('../views/CompanionView.vue') },
    { path: '/journey', component: () => import('../views/JourneyView.vue') },
    { path: '/settings', component: () => import('../views/SettingsView.vue') },
  ],
})

export default router
