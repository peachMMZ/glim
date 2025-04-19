export interface ShareSpaceMessage {
  timestamp: number
  text: string
  sendByMe?: boolean
  unread?: boolean
}

export interface ShareSpaceDevice {
  id: string
  name: string | 'unknown'
  type: string | 'unknown'
  userAgent: string
}

export interface ShareSpaceRoom {
  id: string
  name: string
  device: ShareSpaceDevice
  tempText?: string
  unreadCount?: number
  messageList: ShareSpaceMessage[]
  recentlyTime?: number
}