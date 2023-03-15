import { getDatabase, initializeDatabase } from './database'
import { onStateChange } from './state-changes'
import { setIntervalAsync, waitFor } from './utils'
import { shouldNotifyUser } from './notifications'
import { GIFStream, parseGIF } from './gifs'

const main = async () => {
  await initializeDatabase()
  const gifEventTarget = new EventTarget()
  const soundEventTarget = new EventTarget()
  let isGifPlaying = false

  gifEventTarget.addEventListener('start', async () => {
    if (isGifPlaying) {
      return
    }

    const database = await getDatabase()
    if (database.options.gifDataUrl === null) {
      return
    }

    isGifPlaying = true

    const response = await fetch(database.options.gifDataUrl)
    const arrayBuffer = await response.arrayBuffer()
    const gifStream = new GIFStream(new Uint8Array(arrayBuffer))
    const gif = parseGIF(gifStream)

    let frameNumber = 0

    while (isGifPlaying) {
      await chrome.action.setIcon({
        imageData: gif.frameData[frameNumber].image,
      })

      await waitFor(gif.frameData[frameNumber].delay * 10)

      frameNumber += 1

      if (frameNumber >= gif.frameData.length) {
        frameNumber = 0
      }
    }
  })

  gifEventTarget.addEventListener('stop', () => {
    isGifPlaying = false
  })

  setIntervalAsync(async () => {
    const shouldNotify = await shouldNotifyUser()

    if (shouldNotify) {
      gifEventTarget.dispatchEvent(new Event('start'))
      soundEventTarget.dispatchEvent(new Event('start'))
    } else {
      gifEventTarget.dispatchEvent(new Event('stop'))
      soundEventTarget.dispatchEvent(new Event('stop'))
    }

    return true
  }, 50)
}

main()

chrome.runtime.onMessage.addListener(onStateChange)

export {}
