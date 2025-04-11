<template>
  <div class="h-full flex flex-col justify-center items-center">
    <span>Count: {{ count }}</span>
    <n-button type="primary" @click="count++">Increment</n-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  NButton
} from 'naive-ui'

const count = ref(0)
</script>
<style scoped></style>
