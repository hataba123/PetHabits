import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import { useAppStore } from './stores/appStore'
import './style.css'

const pinia = createPinia()
const appStore = useAppStore(pinia)

appStore.initialize()

createApp(App).use(pinia).use(router).mount('#app')
