import { createPinia } from 'pinia'
import { createApp, watch } from 'vue'

import App from './App.vue'
import { applyTheme } from './composables/useTheme'
import router from './router'
import { useAppStore } from './stores/appStore'
import { useCompanionStore } from './stores/companionStore'
import './style.css'

const pinia = createPinia()
const appStore = useAppStore(pinia)

appStore.initialize()
useCompanionStore(pinia).syncFromLogs()
watch(() => appStore.settings.theme, applyTheme, { immediate: true })

createApp(App).use(pinia).use(router).mount('#app')
