import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { app } from '@tauri-apps/api'
import { darkTheme, GlobalThemeOverrides, lightTheme, useOsTheme} from 'naive-ui'

type Theme = 'light' | 'dark'
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
const defaultTheme = (): GlobalThemeOverrides => ({
  common: {
    primaryColor: '#7e57c2',
    primaryColorHover: '#6a4fb3',
    primaryColorPressed: '#5a3ea3',
    primaryColorSuppl: '#6a4fb3',
    fontSize: '14px',
    fontWeight: '400',
  }
})

export const useSystemStore = defineStore('system', () => {

  const osTheme = useOsTheme()
  const theme = ref<Theme>(osTheme.value || 'light')
  const naiveTheme = computed(() => theme.value === 'light' ? lightTheme : darkTheme)
  const naiveThemeOverride = ref<GlobalThemeOverrides>(defaultTheme())
  const followedOsTheme = ref(false)

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
    setTheme,
    toggleTheme,
    resetThemeVars,
    getCurrentTheme,
    useSystemTheme,
  }
})