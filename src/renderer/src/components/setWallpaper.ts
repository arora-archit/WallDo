function setWallpaper(imagePath: string): Promise<string> {
  return window.api.setWallpaper(imagePath)
}

export default setWallpaper
