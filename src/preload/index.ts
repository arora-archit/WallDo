import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  selectDir: (): Promise<string> => ipcRenderer.invoke('choose-dir'),
  fetchWallhavenFeed: (): Promise<any> => ipcRenderer.invoke('fetch-wallhaven-feed'),
  fetchWallhavenImage: (url: string): Promise<string> =>
    ipcRenderer.invoke('fetch-wallhaven-image', url)
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
