<template>
  <div class="h-full m-auto p-t-4">
    <NTabs class="h-full" type="line" placement="left">
      <NTabPane name="local" tab="本地">
      </NTabPane>
      <NTabPane class="h-full" name="remote" tab="远程">
        <Remote />
      </NTabPane>
      <NTabPane name="download" tab="下载">
      </NTabPane>
    </NTabs>
  </div>
</template>

<script setup lang="ts">
import {
  NTabs,
  NTabPane
} from 'naive-ui'
import Remote from './component/Remote.vue'

</script>
<style>
.n-tabs-pane-wrapper {
  height: 100%;
}
</style>
