<template>
  <div :class="bubbleClass">
    <div class="flex flex-col justify-start">
      <NAvatar src="/avatar.png" round></NAvatar>
    </div>
    <div>
      <div class="p-2 rounded" :style="{ backgroundColor: themeVars.primaryColor }">
        <NText>{{ data.payload }}</NText>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  NAvatar,
  NText,
  useThemeVars
} from 'naive-ui'
import { PushData } from '@/types/server'

const themeVars = useThemeVars()

defineProps<{
  data: PushData<string>
}>()

const bubbleClass = ref('max-w-2/3 flex justify-start items-start m-2 gap-2')
</script>
<style scoped></style>
