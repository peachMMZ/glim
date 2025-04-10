<template>
  <div class="h-full flex">
    <div class="basis-1/2 flex flex-col items-center justify-center gap-y-4">
      <img src="/tauri.svg" alt="logo" class="w-32 h-32" />
      <NH2>{{ appName.toUpperCase() }}</NH2>
      <NButton type="primary" text>{{ appIdentifier }}</NButton>
      <span>
        Version: <NText type="primary">{{ appVersion }}</NText>
      </span>
    </div>
    <div class="basis-1/2 flex flex-col items-center justify-center gap-y-4">
      <NH2>Additional Information</NH2>
      <NText type="secondary">This application is built using Tauri and Vue.</NText>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  NH2,
  NText,
  NButton
} from 'naive-ui'
import { ref, onMounted } from 'vue'
import { app } from '@tauri-apps/api'

const appName = ref('')
const appIdentifier = ref('')
const appVersion = ref('')

onMounted(async () => {
  appName.value = await app.getName()
  appIdentifier.value = await app.getIdentifier()
  appVersion.value = await app.getVersion()
})
</script>
<style scoped></style>
