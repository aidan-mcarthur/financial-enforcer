import { animatedIcon } from './animated-icon'
import { executeBackgroundTask } from './background-task'
import { getDatabase, initializeDatabase } from './database'
import { GIFStream, parseGIF } from './gifs'
import { shouldNotifyUser } from './notifications'
import { playSound, stopSound } from './offscreen'
import { onStateChange } from './state-changes'
import { GIF } from './types/gifs'
import { setIntervalAsync } from './utils'

const main = async () => {
  console.log('Calling main')
  await initializeDatabase()

  let lastGifDataUrl: string | null = null
  let gifIsRunning = () => false
  let gifShouldCancel = false
  let gif: GIF | null = null

  let lastSoundDataUrl: string | null = null
  let soundPlayingId = 0

  setIntervalAsync(async () => {
    const shouldNotify = await shouldNotifyUser()

    const cancelSound = async () => {
      if (soundPlayingId) {
        await stopSound(soundPlayingId)
        soundPlayingId = 0
      }
    }

    const cancelGif = () => {
      if (gifIsRunning()) {
        gifShouldCancel = true
      }
    }

    if (!shouldNotify) {
      await cancelSound()
      cancelGif()
      return true
    }

    const database = await getDatabase()

    if (database.options.gifDataUrl !== null && database.options.gifDataUrl !== lastGifDataUrl) {
      lastGifDataUrl = database.options.gifDataUrl
      const response = await fetch(database.options.gifDataUrl)
      const arrayBuffer = await response.arrayBuffer()
      const gifStream = new GIFStream(new Uint8Array(arrayBuffer))
      gif = parseGIF(gifStream)
      cancelGif()
    }

    if (database.options.soundDataUrl !== null && database.options.soundDataUrl !== lastSoundDataUrl) {
      lastSoundDataUrl = database.options.soundDataUrl
      cancelSound()
    }

    if (shouldNotify) {
      if (!gifIsRunning() && gif !== null) {
        gifIsRunning = executeBackgroundTask({
          task: animatedIcon(gif),
          checkCancellationFunction: () => gifShouldCancel,
          onDoneFunction: () => (gifShouldCancel = false),
        })
      }

      if (!soundPlayingId && database.options.soundDataUrl !== null) {
        soundPlayingId = await playSound(database.options.soundDataUrl, 1)
      }
    }

    return true
  }, 50)
}

chrome.runtime.onStartup.addListener(main)
chrome.runtime.onInstalled.addListener(main)
chrome.runtime.onMessage.addListener(onStateChange)

export {}
