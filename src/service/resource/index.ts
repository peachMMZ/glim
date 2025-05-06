import { FileInfo } from '@/types/resource'
import { LazyStore } from '@tauri-apps/plugin-store'
import { sep } from '@tauri-apps/api/path'
import { stat } from '@tauri-apps/plugin-fs'
import { getLocalIP, uuid } from '@/util/common'
import { useSystemStore } from '@/store/system'

class ResourceService {

  private store
  private static STORE_KEY = `data${sep()}resources.json`
  private static FILES_KEY = 'files'
  private static RESOURCE_SRC_URL = 'api/resource'

  constructor() {
    this.store = new LazyStore(ResourceService.STORE_KEY)
  }

  async exists(path: string) {
    const files = await this.store.get<FileInfo[]>(ResourceService.FILES_KEY)
    return files && files.some(file => file.path === path)
  }

  async list() {
    return (await this.store.get<FileInfo[]>(ResourceService.FILES_KEY)) || []
  }

  async get(rid: string) {
    const files = await this.list()
    return files.find(file => file.rid === rid)
  }

  async getByPath(path: string) {
    const files = await this.list()
    return files.find(file => file.path === path)
  }

  async getOrSave(path: string) {
    let fileInfo = await this.getByPath(path)
    if (fileInfo) {
      return fileInfo
    }
    const filename = path.split(sep()).pop()
    if (!filename) {
      throw new Error(`filename is empty`)
    }
    const statFileInfo = await stat(path)
    if (!statFileInfo.isFile) {
      throw new Error(`${path} is not a file`)
    }
    fileInfo = {
      rid: await uuid(),
      filename,
      path,
      size: statFileInfo.size
    }
    const files = [...await this.list(), fileInfo]
    await this.store.set(ResourceService.FILES_KEY, files)
    return fileInfo
  }

  async remove(rid: string) {
    const files = await this.list()
    await this.store.set(ResourceService.FILES_KEY, files.filter(file => file.rid !== rid))
  }

  async getSrc(rid: string) {
    const systemStore = useSystemStore()
    return `http://${await getLocalIP()}:${systemStore.serverSetting.port}/${ResourceService.RESOURCE_SRC_URL}/${rid}`
  }

}

export const resourceService = new ResourceService()