<template>
  <div>
    <NModal
      v-model:show="show"
      class="max-w-160"
      preset="card"
      title="服务设置"
      draggable
    >
      <div>
        <NForm label-placement="left" label-align="left" label-width="100">
          <NFormItem label="端口" path="port">
            <NInputNumber v-model:value="systemStore.serverSetting.port" :min="1" :max="65535" />
          </NFormItem>
          <NFormItem label="客户端路径" path="clientPath">
            <NInput v-model:value="systemStore.serverSetting.clientPath" disabled />
          </NFormItem>
        </NForm>
      </div>
      <template #action>
        <div class="flex justify-end items-center gap-x-2">
          <NButton @click="handleCancel">取消</NButton>
          <NButton type="primary" @click="handleConfirm">确定</NButton>
        </div>
      </template>
    </NModal>
  </div>
</template>

<script setup lang="ts">
import {} from 'vue'
import {
  NModal,
  NForm,
  NFormItem,
  NInputNumber,
  NInput,
  NButton
} from 'naive-ui'
import { useSystemStore } from '@/store/system'

const show = defineModel('show', { default: false  })

const systemStore = useSystemStore()

function handleCancel() {
  show.value = false
}
function handleConfirm() {
  systemStore.saveSetting().then(() => {
    show.value = false
  })
}
</script>
<style scoped></style>
