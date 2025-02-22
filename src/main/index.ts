import { shell, app, dialog, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { writeFile, unlink, mkdir, rmdir, readdir } from 'fs/promises'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { existsSync } from 'fs'
import axios from 'axios'
import { promises as fs } from 'fs'

const cacheDir = join(app.getPath('userData'), 'image-cache')

ipcMain.handle('fetch-wallhaven-feed', async () => {
  try {
    const response = await axios.get('https://wallhaven.cc/api/v1/search')
    return response.data
  } catch (error) {
    console.error('Error fetching wallhaven feed:', error)
    throw error
  }
})

ipcMain.handle('fetch-wallhaven-image', async (_event, url) => {
  const imageName = url.split('/').pop()
  const imagePath = join(cacheDir, imageName)

  if (existsSync(imagePath)) {
    return `file://${imagePath}`
  }

  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    await mkdir(cacheDir, { recursive: true })
    await writeFile(imagePath, response.data)
    return `file://${imagePath}`
  } catch (error) {
    console.error('Error fetching wallhaven image:', error)
    throw error
  }
})
ipcMain.handle('download-image', async (_, url: string) => {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    const imageName = url.split('/').pop() || 'image.jpg'
    const storedDirPath = join(app.getPath('userData'), 'selectedDir.txt')

    if (
      !(await fs
        .access(storedDirPath)
        .then(() => true)
        .catch(() => false))
    ) {
      throw new Error('No directory selected')
    }

    const dirPath = await fs.readFile(storedDirPath, 'utf8')
    const imagePath = join(dirPath, imageName)

    await fs.writeFile(imagePath, Buffer.from(response.data))
    return imagePath
  } catch (error) {
    console.error('Error downloading image:', error)
    throw error
  }
})

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })
  mainWindow.loadURL('http://localhost:3000')

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  ipcMain.handle('choose-dir', async () => {
    const dirs = await dialog.showOpenDialog({
      properties: ['openDirectory']
    })
    if (dirs.canceled) return []

    const dirPath = dirs.filePaths[0]
    // Save selected directory path
    await writeFile(join(app.getPath('userData'), 'selectedDir.txt'), dirPath)

    const files = await readdir(dirPath)
    const imageFiles = files.filter((file) => /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(file))
    return imageFiles.map((file) => join(dirPath, file))
  })
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('before-quit', async () => {
  try {
    const files = await readdir(cacheDir)
    for (const file of files) {
      await unlink(join(cacheDir, file))
    }
    await rmdir(cacheDir)
  } catch (error) {
    console.error('Error cleaning up cache:', error)
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
