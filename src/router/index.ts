import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import { Component } from 'vue'

declare module 'vue-router' {
  interface RouteMeta {
    title: string
    icon?: string | Component
    keepAlive?: boolean
    hidden?: boolean
  }
}

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
