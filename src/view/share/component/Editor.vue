<template>
  <div class="h-full flex flex-col">
    <div class="h-8 flex justify-between items-center p-x-5 p-y-2">
      <div class="flex justify-start items-center gap-x-4">
        <GEmojiPicker trigger="click" @pick="">
          <template #trigger>
            <div class="flex items-center">
              <NButton text :render-icon="renderIcon(Smile, { size: 24 })"></NButton>
            </div>
          </template>
        </GEmojiPicker>
        <NButton text :render-icon="renderIcon(Image, { size: 24 })" @click="sendImage"></NButton>
      </div>
      <div class="flex justify-end items-center gap-x-4">
        <NButton text :render-icon="renderIcon(Clock, { size: 24 })"></NButton>
      </div>
    </div>
    <div class="h-[calc(100%-6rem)] p-x-4">
      <NScrollbar class="h-full" content-class="h-full">
        <EditorContent class="h-full" :editor="editor" />
      </NScrollbar>
    </div>
    <div class="h-8 flex justify-end items-center p-x-5 p-y-2">
      <NButton
        class="text-white"
        type="primary"
        size="small"
        :disabled="sendDisabled"
        :render-icon="renderIcon(Send)"
        @click="send"
      >
        发送
      </NButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
import {
  NButton,
  NScrollbar
} from 'naive-ui'
import { Smile, Image, Clock, Send } from 'lucide-vue-next'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit  from '@tiptap/starter-kit'
import TImage from '@tiptap/extension-image'
import { renderIcon } from '@/util/render'
import { useShareSpace } from '@/store/share'
import { convertFileSrc } from '@tauri-apps/api/core'
import GEmojiPicker from '@/components/GEmojiPicker.vue'

const shareSpace = useShareSpace()
const editor = useEditor({
  extensions: [StarterKit, TImage],
  editorProps: {
    attributes: {
      class: 'mx-auto focus:outline-none h-full',
    },
  },
  onUpdate: () => {
    sendDisabled.value = editor.value?.isEmpty || false
  }
})

const sendDisabled = ref(true)
function send() {
  const html = editor.value?.getHTML()
  if (html) {
    sendDisabled.value = true
    shareSpace.sendWsMessage(html).then(() => {
      sendDisabled.value = false
    })
  }
}

function sendImage() {
  const filePath = "" // TODO get file path
  const url = convertFileSrc(filePath)
  editor.value?.chain().focus().setImage({ src: url }).run()
  shareSpace.sendWsFile(filePath).then(() => {
    console.log("send image success")
  })
}

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>
<style>
.tiptap p {
  margin: 0;
}
.tiptap img {
  max-width: 33%;
}
</style>
