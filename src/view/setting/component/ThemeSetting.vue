<template>
  <div class="flex flex-col gap-y-4">
    <NCard title="外观模式" :bordered="false" embedded>
      <div class="flex justify-start items-center gap-x-4">
        <NElement v-for="item in themeModes" tag="div">
          <NConfigProvider :theme="item.theme">
            <div
              class="flex flex-col w-36 h-36 rounded p-2 gap-y-1 theme-mode-option"
              :style="{
                backgroundColor: item.theme.common.baseColor,
                border:
                  item.name === systemStore.getCurrentTheme()
                    ? `2px solid ${themeVars.primaryColor}`
                    : 'none',
              }"
              @click="setTheme(item.name as 'light' | 'dark')"
            >
              <div
                class="w-full h-1/5"
                :style="{ backgroundColor: item.theme.common.primaryColor }"
              ></div>
              <div
                class="w-full h-1/5"
                :style="{ backgroundColor: item.theme.common.successColor }"
              ></div>
              <div
                class="w-full h-1/5"
                :style="{ backgroundColor: item.theme.common.infoColor }"
              ></div>
              <div
                class="w-full h-1/5"
                :style="{ backgroundColor: item.theme.common.warningColor }"
              ></div>
              <div
                class="w-full h-1/5"
                :style="{ backgroundColor: item.theme.common.errorColor }"
              ></div>
              <NElement
                class="flex flex-col items-center justify-center gap-y-1 mt-2"
                :theme-overrides="item.theme"
              >
                <NIcon
                  size="24"
                  :component="item.icon"
                  :color="item.theme.common.primaryColor"
                />
                <NText>{{ item.label }}</NText>
              </NElement>
            </div>
          </NConfigProvider>
        </NElement>
        <NElement tag="div">
          <NConfigProvider :theme="themeVars">
            <div
              class="flex flex-col justify-center w-36 h-36 rounded p-2 gap-y-1 theme-mode-option"
              :style="{
                backgroundColor: themeVars.baseColor,
                border: systemStore.followedOsTheme
                  ? `2px solid ${themeVars.primaryColor}`
                  : 'none',
              }"
              @click="systemStore.useSystemTheme()"
            >
              <NElement
                class="flex flex-col items-center justify-center gap-y-1"
                :theme-overrides="themeVars"
              >
                <NIcon
                  size="24"
                  :component="Monitor"
                  :color="themeVars.primaryColor"
                />
                <NText type="primary">使用系统主题</NText>
              </NElement>
            </div>
          </NConfigProvider>
        </NElement>
      </div>
    </NCard>
    <div class="flex gap-x-4">
      <NCard title="主题颜色" :bordered="false" embedded>
        <div class="w-full flex flex-col gap-y-2">
          <div class="flex justify-start items-center gap-x-2">
            <NText class="basis-1/2">primaryColor</NText>
            <NColorPicker
              class="basis-1/2"
              v-model:value="systemStore.naiveThemeOverride.common!.primaryColor"
            />
          </div>
          <div class="flex justify-start items-center gap-x-2">
            <NText class="basis-1/2">primaryColorHover</NText>
            <NColorPicker
              class="basis-1/2"
              v-model:value="systemStore.naiveThemeOverride.common!.primaryColorHover"
            />
          </div>
          <div class="flex justify-start items-center gap-x-2">
            <NText class="basis-1/2">primaryColorPressed</NText>
            <NColorPicker
              class="basis-1/2"
              v-model:value="systemStore.naiveThemeOverride.common!.primaryColorPressed"
            />
          </div>
          <div class="flex justify-start items-center gap-x-2">
            <NText class="basis-1/2">primaryColorHover</NText>
            <NColorPicker
              class="basis-1/2"
              v-model:value="systemStore.naiveThemeOverride.common!.primaryColorHover"
            />
          </div>
        </div>
        <template #header-extra>
          <NButton type="primary" text @click="systemStore.resetThemeVars">
            <template #icon>
              <NIcon :component="RefreshCw" />
            </template>
            <span>恢复默认</span>
          </NButton>
        </template>
      </NCard>
      <NCard title="字体" :bordered="false" embedded>
        <div class="w-full flex flex-col gap-y-2">
          <div class="flex justify-start items-center gap-x-2">
            <NText class="basis-1/2">字体大小</NText>
            <NInput
              class="basis-1/2"
              v-model:value="systemStore.naiveThemeOverride.common!.fontSize"
            />
          </div>
          <div class="flex justify-start items-center gap-x-2">
            <NText class="basis-1/2">字体粗细</NText>
            <NInput
              class="basis-1/2"
              v-model:value="systemStore.naiveThemeOverride.common!.fontWeight"
            />
          </div>
        </div>
      </NCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  useThemeVars,
  lightTheme,
  darkTheme,
  NConfigProvider,
  NElement,
  NButton,
  NCard,
  NText,
  NIcon,
  NColorPicker,
  NInput,
} from 'naive-ui'
import { Sun, Moon, Monitor, RefreshCw } from 'lucide-vue-next'
import { useSystemStore } from '@/pinia/system'

const systemStore = useSystemStore()
const themeVars = useThemeVars()

const themeModes = [
  {
    name: 'light',
    label: '白天模式',
    theme: lightTheme,
    icon: Sun,
  },
  {
    name: 'dark',
    label: '黑夜模式',
    theme: darkTheme,
    icon: Moon,
  },
]

function setTheme(themeValue: 'light' | 'dark') {
  systemStore.setTheme(themeValue)
}
</script>
<style scoped>
.theme-mode-option:hover {
  cursor: pointer;
  box-shadow: 0 0 5px var(--primary-color);
}

.theme-mode-option {
  transition: box-shadow 0.3s ease;
}
</style>
