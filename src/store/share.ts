import { ref } from 'vue'
import { defineStore } from 'pinia'
import { Event, listen } from '@tauri-apps/api/event'
import { exists, readFile } from '@tauri-apps/plugin-fs'
import { ShareSpaceDevice, ShareSpaceRoom } from '@/types/share'
import { WebsocketConnection, WebSocketMessage } from '@/types/websocket'
import { websocketService } from '@/service/websocket'
import { UAParser } from 'ua-parser-js'
import { resourceService } from '@/service/resource'

export const useShareSpace = defineStore('share', () => {

  const deviceList = ref<ShareSpaceDevice[]>([])
  const roomList = ref<ShareSpaceRoom[]>([])
  const currentRoom = ref<ShareSpaceRoom | null>(null)

  const init = async () => {
    listen('glim://ws-connect', onWsConnect)
    listen('glim://ws-disconnect', onWsDisconnect)
    listen('glim://ws-recv', onWsReceive)
    getDeviceList()
  }

  const setCurrentRoom = (id: string) => {
    const room = roomList.value.find((room) => room.id === id)
    if (!room) return
    currentRoom.value = room
  }

  const parseDevice = (connection: WebsocketConnection): ShareSpaceDevice => {
    const parser = new UAParser(connection.userAgent)
    return {
      id: connection.id,
      userAgent: connection.userAgent,
      name: parser.getDevice().vendor || 'unknown',
      type: parser.getOS().name || 'unknown'
    }
  }

  const onWsConnect = (event: Event<WebsocketConnection>) => {
    const payload = event.payload
    const device = parseDevice(payload)
    deviceList.value.push(device)
    roomList.value.push({
      id: device.id,
      name: device.name,
      device,
      messageList: []
    })
  }

  const onWsDisconnect = (event: Event<WebsocketConnection['id']>) => {
    const payload = event.payload
    deviceList.value = deviceList.value.filter((device) => device.id !== payload)
    roomList.value = roomList.value.filter((room) => room.id !== payload)
    if (roomList.value.length === 0) {
      currentRoom.value = null
    }
  }

  const onWsReceive = (event: Event<WebSocketMessage>) => {
    const websocketMessage = event.payload
    if (!websocketMessage.from) return
    const room = roomList.value.find((room) => room.id === websocketMessage.from)
    if (!room) return
    room.recentlyTime = websocketMessage.timestamp
    switch (websocketMessage.messageType) {
      case 'Text':
        if (websocketMessage.text) {
          room.messageList.push({
            timestamp: websocketMessage.timestamp,
            text: websocketMessage.text,
            sendByMe: false,
            unread: true
          })
        }
        break
      default:
        break
    }
  }

  const sendWsMessage = async (text: string) => {
    if (!currentRoom.value) return
    let sendContent = text
    // 使用正则表达式找到所有图片
    const imgRegex = /<img src="(.*?)" alt="(.*?)"/g
    const matches = text.matchAll(imgRegex)
    
    // 逐个处理图片URL
    for (const match of matches) {
      const [_fullMatch, imgSrc, imgAlt] = match
      const url = await resourceService.getSrc(imgAlt)
      sendContent = sendContent.replace(imgSrc, url)
    }
    const wsMessage: WebSocketMessage = {
      messageType: 'Text',
      text: sendContent,
      to: currentRoom.value.device.id,
      timestamp: Date.now()
    }
    await websocketService.sendMessage(wsMessage)
    currentRoom.value.messageList.push({
      timestamp: wsMessage.timestamp,
      text,
      sendByMe: true
    })
    currentRoom.value.recentlyTime = wsMessage.timestamp
  }

  const sendWsFile = async (filePath: string) => {
    if (!currentRoom.value || !await exists(filePath)) {
      console.log('file not exists')
      return
    }
    const unit8Array = await readFile(filePath)
    const filename = filePath.split('/').pop()
    const wsMessage: WebSocketMessage = {
      messageType: 'Binary',
      text: filename,
      binary: unit8Array,
      to: currentRoom.value.device.id,
      timestamp: Date.now()
    }
    await websocketService.sendMessage(wsMessage)
  }

  const getDeviceList = async () => {
    const connections = await websocketService.getConnections()
    deviceList.value = connections.map(parseDevice)
    roomList.value = deviceList.value.map((device) => ({
      id: device.id,
      name: device.name,
      device,
      tempText: '',
      messageList: []
    }))
  }

  return {
    roomList,
    currentRoom,
    deviceList,
    init,
    setCurrentRoom,
    getDeviceList,
    sendWsMessage,
    sendWsFile
  }
})