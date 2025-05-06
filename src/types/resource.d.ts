export interface Resource {
  rid: string
}

export interface FileInfo extends Resource {
  filename: string
  path: string
  size: number
}