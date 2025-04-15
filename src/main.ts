import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { useSystemStore } from '@/store/system'
import 'vfonts/FiraCode.css'
import 'virtual:uno.css'

function disableWebviewFeatures() {
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault()
  })
}

async function initStore() {
  const systemStore = useSystemStore()
  await systemStore.init()
}

async function main() {
  const initStartTime = Date.now()

  disableWebviewFeatures()

  const app = createApp(App)
  const pinia = createPinia()

  app.use(router)
  app.use(pinia)

  await initStore()

  app.mount('#app')

  console.log(`App init time: ${Date.now() - initStartTime}ms`)
}

main()
