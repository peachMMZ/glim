import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { app } from '@tauri-apps/api'
import { LazyStore } from '@tauri-apps/plugin-store'
import { darkTheme, GlobalThemeOverrides, lightTheme, useOsTheme, createDiscreteApi} from 'naive-ui'
import { ServerSetting } from '@/types/server'

const { message } = createDiscreteApi(['message'])

type Theme = 'light' | 'dark'
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
const defaultTheme = (): GlobalThemeOverrides => ({
  common: {
    primaryColor: '#6366F1',
    primaryColorHover: '#4F46E5',
    primaryColorPressed: '#828AF5FF',
    primaryColorSuppl: '#4F46E5',
    fontSize: '14px',
    fontWeight: '400',
  }
})

export const useSystemStore = defineStore('system', () => {

  const localSettingStore = new LazyStore('conf/setting.json')
  const localThemeStore = new LazyStore('conf/theme-overrides.json')

  const osTheme = useOsTheme()
  const theme = ref<Theme>(osTheme.value || 'light')
  const naiveTheme = computed(() => theme.value === 'light' ? lightTheme : darkTheme)
  const naiveThemeOverride = ref<GlobalThemeOverrides>(defaultTheme())
  const followedOsTheme = ref(false)

  const serverSetting = ref<ServerSetting>({
    port: 8090,
    clientPath: '/',
  })

  const init = async () => {
    const themeOverrides = await localThemeStore.get<GlobalThemeOverrides['common']>('common')
    const themeMode = await localSettingStore.get<Theme & 'os'>('theme')
    if (themeOverrides) {
      naiveThemeOverride.value.common = themeOverrides
    } else {
      localThemeStore.set('common', defaultTheme().common)
      localThemeStore.save()
    }
    if (themeMode === 'os') {
      useSystemTheme()
    } else {
      setTheme(themeMode || 'light')
    }
    console.log('init theme success')
    const localServerSetting = await localSettingStore.get<ServerSetting>('server')
    if (localServerSetting) {
      serverSetting.value = localServerSetting
    } else {
      localSettingStore.set('server', serverSetting.value)
      localSettingStore.save()
    }
    console.log('init server setting success')
  }

  const saveSetting = async () => {
    await localSettingStore.set('theme', followedOsTheme.value ? 'os' : theme.value)
    await localSettingStore.set('server', serverSetting.value)
    await localSettingStore.save()
  }

  const saveThemeVars = () => {
    localThemeStore.set('common', naiveThemeOverride.value.common).then(() => {
      localThemeStore.save().then(() => message.success('保存成功'))
    })
  }

  const setTheme = (themeValue: Theme) => {
    theme.value = themeValue
    app.setTheme(themeValue).then(() => {
      mediaQuery.removeEventListener('change', (_event) => {})
      followedOsTheme.value = false
      saveSetting()
    })
  }

  const toggleTheme = () => {
    const themeValue = theme.value === 'light' ? 'dark' : 'light'
    setTheme(themeValue)
  }

  const resetThemeVars = () => {
    naiveThemeOverride.value = defaultTheme()
    saveThemeVars()
  }

  const getCurrentTheme = () => {
    return theme.value
  }

  const useSystemTheme = async () => {
    app.setTheme(null).then(() => {
      mediaQuery.addEventListener('change', (event) => {
        theme.value = event.matches ? 'dark' : 'light'
      })
      followedOsTheme.value = true
      saveSetting()
    })
  }

  return {
    theme,
    naiveTheme,
    naiveThemeOverride,
    followedOsTheme,
    serverSetting,
    init,
    saveSetting,
    setTheme,
    toggleTheme,
    saveThemeVars,
    resetThemeVars,
    getCurrentTheme,
    useSystemTheme,
  }
})