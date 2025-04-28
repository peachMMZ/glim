export interface GitHubUser {
  id: number
  login: string
  avatarUrl: string
  type: string
}

export interface Asset {
  id: number
  name: string
  url: string
  label: string
  contentType: string
  state: string
  size: number
  downloadCount: number
  createdAt: string
  updatedAt: string
  browserDownloadUrl: string
  uploader: GitHubUser
  localPath?: string
}

export interface Release {
  id: number
  name: string
  htmlUrl: string
  tagName: string
  author: GitHubUser
  createdAt: string
  publishedAt: string
  assets: Asset[]
}

export interface Client extends Release {
}
