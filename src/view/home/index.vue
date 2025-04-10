<template>
  <div>
    <span>{{ count }}</span>
    <n-button type="primary" @click="count++">Button</n-button>
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
