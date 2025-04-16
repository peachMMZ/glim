import { createApp } from 'vue'
import App from './App.vue'
import { setup } from '@/setup'
import 'vfonts/FiraCode.css'
import 'virtual:uno.css'

async function main() {
  const initStartTime = Date.now()
  const app = createApp(App)
  await setup(app)
  app.mount('#app')
  console.log(`App init time: ${Date.now() - initStartTime}ms`)
}

main()
