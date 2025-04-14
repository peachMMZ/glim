<template>
  <div class="h-full flex flex-col justify-center items-center">
    {{ serverState }}
    <NButton type="primary"@click="getServerState">get server state</NButton>
    <NButton type="primary" :loading="starting" @click="startServer">start server</NButton>
    <NButton type="primary" @click="stopServer">stop server</NButton>
    <div v-if="address" class="mt-4">
      <NQrCode :value="address" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  NButton,
  NQrCode,
  useMessage
} from 'naive-ui'
import { invoke } from '@tauri-apps/api/core'

type ServerState = {
  running: boolean
  ip?: string
  port?: number
}

const message = useMessage()

const address = ref<string | null>(null)
const serverState = ref<ServerState | null>(null)

const starting = ref(false)
function startServer() {
  starting.value = true
  invoke<string>('start_server', { port: 8090 }).then((value) => {
    address.value = value
  }).finally(() => {
    starting.value = false
  })
}

function stopServer() {
  invoke('stop_server').then(() => {
    address.value = null
  }).catch((e) => {
    message.error(e)
  })
}

function getServerState() {
  invoke<ServerState>('server_state').then((res) => {
    serverState.value = res
  })
}

onMounted(() => {
})
</script>
<style scoped></style>
