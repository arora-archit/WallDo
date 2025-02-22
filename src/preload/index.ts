import { contextBridge, ipcRenderer } from 'electron'

declare global {
  interface Window {
    api: typeof api
  }
}

import { electronAPI } from '@electron-toolkit/preload'

const api = {
  selectDir: (): Promise<string> => ipcRenderer.invoke('choose-dir'),
  fetchWallhavenFeed: (page: number): Promise<any> =>
    ipcRenderer.invoke('fetch-wallhaven-feed', page),
  fetchWallhavenImage: (url: string): Promise<string> =>
    ipcRenderer.invoke('fetch-wallhaven-image', url),
  downloadImage: (url: string): Promise<string> => ipcRenderer.invoke('download-image', url),
  setWallpaper: (imagePath: string): Promise<string> =>
    ipcRenderer.invoke('set-wallpaper', imagePath)
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.Electron = electronAPI as unknown as typeof Electron
  window.api = api
}
