import { shell, app, dialog, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { writeFile, unlink, mkdir, rmdir, readdir } from 'fs/promises'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { existsSync } from 'fs'
import axios from 'axios'
import { promises as fs } from 'fs'
import { exec } from 'child_process'
import path from 'path'
import os from 'os'

function setWallpaper(imagePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const absolutePath = path.resolve(imagePath)
    const platform = os.platform()

    let command = ''

    if (platform === 'win32') {
      // Windows PowerShell command
      command = `powershell.exe -command "(Add-Type -TypeDefinition 'using System; using System.Runtime.InteropServices; public class Wallpaper { [DllImport(\\"user32.dll\\", CharSet = CharSet.Auto)] public static extern int SystemParametersInfo(int uAction, int uParam, string lpvParam, int fuWinIni); }' -Name Wallpaper -Namespace Win32 -PassThru)::SystemParametersInfo(20, 0, '${absolutePath}', 3)"`
    } else if (platform === 'darwin') {
      // macOS AppleScript command
      command = `osascript -e 'tell application "System Events" to set picture of every desktop to "${absolutePath}"'`
    } else if (platform === 'linux') {
      // Detect desktop environment
      exec('echo $XDG_CURRENT_DESKTOP', (err, stdout) => {
        const desktopEnv = stdout.trim()

        if (desktopEnv.includes('KDE')) {
          // KDE Plasma method
          command = `plasma-apply-wallpaperimage "${absolutePath}"`
        } else {
          // Default to GNOME method
          command = `gsettings set org.gnome.desktop.background picture-uri "file://${absolutePath}"`
        }

        exec(command, (error) => {
          if (error) {
            reject(`Error setting wallpaper on ${desktopEnv}: ${error.message}`)
          } else {
            resolve(`Wallpaper changed successfully on ${desktopEnv}`)
          }
        })
      })

      return // Prevent further execution
    } else {
      return reject(new Error(`Unsupported OS: ${platform}`))
    }

    exec(command, (error) => {
      if (error) {
        reject(`Error setting wallpaper: ${error.message}`)
      } else {
        resolve(`Wallpaper changed successfully on ${platform}`)
      }
    })
  })
}
const cacheDir = join(app.getPath('userData'), 'image-cache')

ipcMain.handle('fetch-wallhaven-feed', async (_event, page: number) => {
  try {
    const response = await axios.get(`https://wallhaven.cc/api/v1/search?page=${page}`)
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
ipcMain.handle('set-wallpaper', async (_event, imagePath: string) => {
  try {
    const result = await setWallpaper(imagePath)
    return result
  } catch (error) {
    console.error('Error setting wallpaper:', error)
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
