import { App } from "vue"
import { createPinia } from 'pinia'
import router from '@/router'
import { useSystemStore } from '@/store/system'
import { useShareSpace } from '@/store/share'
import { useClientStore } from '@/store/client'
import { createDiscreteApi, type NotificationApi } from 'naive-ui'

let globalNotification: NotificationApi

function disableWebviewFeatures() {
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault()
  })
}

function setupGlobalNotification() {
  const systemStore = useSystemStore()
  const { notification } = createDiscreteApi(['notification'],
    {
      notificationProviderProps: {
        placement: 'bottom-right',
        themeOverrides: systemStore.naiveTheme
      }
    }
  )
  globalNotification = notification
}

function setupPinia(app: App) {
  const pinia = createPinia()
  app.use(pinia)
}

function setupRouter(app: App) {
  app.use(router)
}

async function initStore() {
  const systemStore = useSystemStore()
  await systemStore.init()
  const shareSpace = useShareSpace()
  await shareSpace.init()
  const clientStore = useClientStore()
  await clientStore.init()
}

function errorHandler(error: unknown, info?: string) {
  globalNotification.error({
    title: '发生了一些错误',
    content: error instanceof Error ? error.message : String(error),
  })
  if (info) {
    console.error('Vue Error:', error, info)
  }
}
function setErrorHandler(app: App) {
  app.config.errorHandler = (error: unknown, _instance, info) => errorHandler(error, info)
  window.addEventListener('unhandledrejection', (event) => errorHandler(event.reason))
}

export async function setup(app: App) {
  disableWebviewFeatures()
  setupPinia(app)
  setupGlobalNotification()
  setupRouter(app)
  setErrorHandler(app)
  await initStore()
}