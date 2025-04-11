import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { app } from '@tauri-apps/api'
import { LazyStore } from '@tauri-apps/plugin-store'
import { darkTheme, GlobalThemeOverrides, lightTheme, useOsTheme} from 'naive-ui'

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

  const localThemeStore = new LazyStore('theme-overrides.json')

  const osTheme = useOsTheme()
  const theme = ref<Theme>(osTheme.value || 'light')
  const naiveTheme = computed(() => theme.value === 'light' ? lightTheme : darkTheme)
  const naiveThemeOverride = ref<GlobalThemeOverrides>(defaultTheme())
  const followedOsTheme = ref(false)

  const init = async () => {
    const themeOverrides = await localThemeStore.get<GlobalThemeOverrides['common']>('common')
    if (themeOverrides) {
      naiveThemeOverride.value.common = themeOverrides
    } else {
      localThemeStore.set('common', defaultTheme().common)
      localThemeStore.save()
    }
    console.log('init theme success')
  }

  const saveThemeVars = () => {
    localThemeStore.set('common', naiveThemeOverride.value.common).then(() => {
      localThemeStore.save()
    })
  }

  const setTheme = (themeValue: Theme) => {
    theme.value = themeValue
    app.setTheme(themeValue).then(() => {
      mediaQuery.removeEventListener('change', (_event) => {})
      followedOsTheme.value = false
    })
  }

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    app.setTheme(theme.value).then(() => {
      mediaQuery.removeEventListener('change', (_event) => {})
      followedOsTheme.value = false
    })
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
    })
  }

  return {
    theme,
    naiveTheme,
    naiveThemeOverride,
    followedOsTheme,
    init,
    setTheme,
    toggleTheme,
    saveThemeVars,
    resetThemeVars,
    getCurrentTheme,
    useSystemTheme,
  }
})