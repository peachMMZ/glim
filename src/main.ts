import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { useSystemStore } from '@/pinia/system'
import 'vfonts/FiraCode.css'
import 'virtual:uno.css'

async function initStore() {
  const systemStore = useSystemStore()
  await systemStore.init()
}

async function main() {

  const app = createApp(App)
  const pinia = createPinia()

  app.use(router)
  app.use(pinia)

  await initStore()

  app.mount('#app')
}

main()
