import { NIcon, IconProps } from 'naive-ui'
import { type Component, h } from 'vue'

export function renderIcon(icon?: Component | string, options?: IconProps) {
  if (!icon) return () => null
  if (typeof icon === 'string') {
    return () => h(NIcon, null, { default: () => h('span', icon) })
  }
  return () => h(NIcon, options, { default: () => h(icon) })
}
