<template>
  <div>
    <NModal
      v-model:show="show"
      class="w-auto"
      preset="card"
      title="服务设置"
      draggable
    >
      <div>
        <NForm label-placement="left">
          <NFormItem label="端口" path="port">
            <NInputNumber v-model:value="serverSetting.port" :min="1" :max="65535" />
          </NFormItem>
        </NForm>
      </div>
    </NModal>
  </div>
</template>

<script setup lang="ts">
import {} from 'vue'
import {
  NModal,
  NForm,
  NFormItem,
  NInputNumber
} from 'naive-ui'
import { ServerSetting } from '@/types/server'

const show = defineModel('show', { default: false  })
defineProps<{
  serverSetting: ServerSetting
}>()
</script>
<style scoped></style>
