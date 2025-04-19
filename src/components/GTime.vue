<template>
  <div>
    <NTime v-if="time" :time="time" :format="timeFormat" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  NTime
} from 'naive-ui'

const props = defineProps<{
  time?: number | Date
}>()

const timeFormat = computed(() => props.time && isSameDay(props.time) ? 'HH:mm' : 'yyyy-MM-dd HH:mm')
function isSameDay(time?: number | Date) {
  if (time) {
    return new Date(time).toDateString() === new Date().toDateString()
  } else {
    return false
  }
}
</script>
<style scoped></style>
