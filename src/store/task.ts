import { DownloadTask, Task } from '@/types/task'
import { uuid } from '@/util/common'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTaskStore = defineStore('task', () => {

  const taskList = ref<Task[]>([])
  const latestTask = computed(() => {
    if (taskList.value.length === 0) return null
    return taskList.value[taskList.value.length - 1]
  })

  async function defaultTask<T extends Task>() {
    const id = await uuid()
    return {
      id,
      total: 0,
      done: 0,
      progress: 0,
      speed: 0,
      eta: 0,
      status: 'pending'
    } as T
  }
  async function newTask() {
    const task = await defaultTask()
    taskList.value.push(task)
    return task.id
  }

  async function newDownloadTask(downloadTask: Pick<DownloadTask, 'url' | 'output' | 'name'>) {
    const task = await defaultTask<DownloadTask>()
    task.url = downloadTask.url
    task.output = downloadTask.output
    task.name = downloadTask.name
    taskList.value.push(task)
    return task.id
  }

  function getTask<T extends Task>(id: string) {
    const task = taskList.value.find((task) => task.id === id)
    return ref(task as T)
  }

  function updateTask(id: string, task: Pick<Task, 'done' | 'total' | 'speed'>) {
    const index = taskList.value.findIndex((task) => task.id === id)
    if (index === -1) return
    taskList.value[index] = {
      ...taskList.value[index],
      ...task,
      progress: Math.round((task.done / task.total) * 100),
      status: task.done === 0 ? 'pending' : (task.done === task.total ? 'done' : 'running'),
      eta: task.done === 0 ? 0 : Math.round((task.total - task.done) / task.speed)
    }
  }

  return {
    taskList,
    latestTask,
    newTask,
    newDownloadTask,
    getTask,
    updateTask
  }
})