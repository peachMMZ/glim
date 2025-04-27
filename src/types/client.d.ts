export interface GitHubUser {
  id: number
  login: string
  avatarUrl: string
  type: string
}

export interface Assets {
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
}

export interface Client {
  id: number
  name: string
  htmlUrl: string
  tagName: string
  author: GitHubUser
  createdAt: string
  publishedAt: string
  assets: Assets[]
}
