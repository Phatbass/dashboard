import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueDnDKitPlugin from '@vue-dnd-kit/core'

import App from './App.vue'
import router from './router'
import { useUserStore } from '@/stores/userStore'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(VueDnDKitPlugin)
app.use(router)

function initializeStores(): Promise<void> {
  useUserStore().loadFromStorage()

  return Promise.resolve()
}

initializeStores().then(() => {
  app.mount('#app')
})
