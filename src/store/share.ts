import { ref } from 'vue'
import { defineStore } from 'pinia'
import { Event, listen } from '@tauri-apps/api/event'
import { ShareSpaceDevice, ShareSpaceRoom } from '@/types/share'
import { WebsocketConnection, WebSocketMessage } from '@/types/websocket'
import { websocketService } from '@/service/websocket'
import { UAParser } from 'ua-parser-js'

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
      type: parser.getOS().name || 'unknown',
      recentTime: '00:11'
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
  }

  const onWsReceive = (event: Event<WebSocketMessage>) => {
    const websocketMessage = event.payload
    if (!websocketMessage.from) return
    const room = roomList.value.find((room) => room.id === websocketMessage.from)
    if (!room) return
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
    const wsMessage: WebSocketMessage = {
      messageType: 'Text',
      text,
      to: currentRoom.value.device.id,
      timestamp: Date.now()
    }
    await websocketService.sendMessage(wsMessage)
    currentRoom.value.messageList.push({
      timestamp: wsMessage.timestamp,
      text,
      sendByMe: true
    })
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
    sendWsMessage
  }
})