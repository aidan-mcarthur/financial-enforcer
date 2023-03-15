import { PlayAudioMessageObj, StopAudioMessageObj } from './types/offscreen'

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((msg) => {
  if ('play' in msg) playAudio(msg.play)
  if ('stop' in msg) stopAudio(msg.stop)
})

interface AudioMap {
  [key: number]: HTMLAudioElement
}

const audioMap: AudioMap = {}

// Play sound with access to DOM APIs
const playAudio = (obj: PlayAudioMessageObj) => {
  const audio = new Audio(obj.source)
  audio.volume = obj.volume
  audio.loop = true
  audio.play()
  audioMap[obj.id] = audio
}

const stopAudio = (obj: StopAudioMessageObj) => {
  if (!(obj.id in audioMap)) {
    throw new Error('Audio not found in audio map')
  }

  audioMap[obj.id].pause()
  delete audioMap[obj.id]
}

let nextId = 1
export const playSound = async (source: string, volume: number): Promise<number> => {
  const id = nextId++
  await createOffscreen()
  await chrome.runtime.sendMessage({
    play: { source, volume, id },
  })
  return id
}

export const stopSound = async (id: number) => {
  await createOffscreen()
  await chrome.runtime.sendMessage({ stop: { id } })
}

// Create the offscreen document if it doesn't already exist
async function createOffscreen() {
  if (await chrome.offscreen.hasDocument()) return
  await chrome.offscreen.createDocument({
    url: 'offscreen.html',
    reasons: ['AUDIO_PLAYBACK' as any],
    justification: 'testing', // details for using the API
  })
}
