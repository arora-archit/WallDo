import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: typeof api
  }
  interface api {
    downloadImage: (url: string) => Promise<string>
  }
}
