import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import { useAppStore } from './stores/appStore'
import { useCompanionStore } from './stores/companionStore'
import './style.css'

const pinia = createPinia()
const appStore = useAppStore(pinia)

appStore.initialize()
useCompanionStore(pinia).syncFromLogs()

createApp(App).use(pinia).use(router).mount('#app')
