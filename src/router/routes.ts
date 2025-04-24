import {
  Home,
  Settings,
  MessageSquare,
  Router
} from 'lucide-vue-next'
import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'root',
    redirect: '/home',
    component: () => import('@/layout/MainLayout.vue'),
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          title: '开始',
          icon: Home,
          keepAlive: true,
        },
        component: () => import('@/view/home/index.vue')
      },
      {
        path: '/setting',
        name: 'setting',
        meta: {
          title: '设置',
          icon: Settings,
          keepAlive: true,
          hidden: true
        },
        component: () => import('@/view/setting/index.vue')
      },
      {
        path: '/shareSpace',
        name: 'shareSpace',
        meta: {
          title: '共享空间',
          icon: MessageSquare,
          keepAlive: true,
        },
        component: () => import('@/view/share/index.vue')
      },
      {
        path: '/client',
        name: 'client',
        meta: {
          title: '客户端',
          icon: Router,
          keepAlive: true,
        },
        component: () => import('@/view/client/index.vue')
      }
    ],
  },
]

export default routes
