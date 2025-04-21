class GlimClientService {
  async downloadLatest() {
    const url = import.meta.env.VITE_CLIENT_RELEASE_URL
    if (!url) {
      throw new Error("can't find client release url")
    }
    const res = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
    console.log('res', res)
    const data = await res.json()
    console.log('data', data)
  }
}

export const glimClientService = new GlimClientService()