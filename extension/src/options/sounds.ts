import { Database } from '../types/database'
import { readAsDataUrlAsync } from './utils'

const getSoundSelector = (): HTMLDivElement => {
  return document.getElementById('sound-selector') as HTMLDivElement
}

const getSelectedSoundThumbnailElement = (): HTMLImageElement | null => {
  const soundSelector = getSoundSelector()
  return soundSelector.querySelector('.selected') as HTMLImageElement | null
}

const removeSelectedFromAll = () => {
  const soundSelector = getSoundSelector()
  const soundThumbnailElements = Array.from(soundSelector.querySelectorAll('img')) as HTMLImageElement[]

  for (const thumbnail of soundThumbnailElements) {
    thumbnail.classList.remove('selected')
  }
}

let soundPreviewAudio: HTMLAudioElement | null = null

const playSoundPreview = (thumbnail: HTMLImageElement) => {
  if (!soundPreviewAudio) {
    soundPreviewAudio = new Audio()
  }

  soundPreviewAudio.pause()
  soundPreviewAudio.currentTime = 0
  soundPreviewAudio.src = thumbnail.getAttribute('data-sound-src') as string
  soundPreviewAudio.volume = 1
  soundPreviewAudio.play()
}

const selectSound = (thumbnail: HTMLImageElement, silent: boolean) => {
  removeSelectedFromAll()
  thumbnail.classList.add('selected')

  if (!silent) {
    playSoundPreview(thumbnail)
  }
}

const createSingleSound = (
  source: string,
  thumbnailSource: string,
  title: string,
  isSelected: boolean,
  isCustomInput: boolean,
): HTMLImageElement => {
  const presetSoundThumbnail = document.createElement('img') as HTMLImageElement

  presetSoundThumbnail.src = thumbnailSource
  presetSoundThumbnail.setAttribute('data-sound-src', source)
  presetSoundThumbnail.title = title

  if (isSelected) {
    selectSound(presetSoundThumbnail, true)
  }

  const soundSelector = getSoundSelector()
  soundSelector.appendChild(presetSoundThumbnail)

  if (isCustomInput) {
    presetSoundThumbnail.classList.add('custom-input')
  }

  presetSoundThumbnail.onclick = () => {
    selectSound(presetSoundThumbnail, false)
  }

  return presetSoundThumbnail
}

const createSoundUploader = () => {
  const soundSelector = getSoundSelector()

  const soundInputLabel = document.createElement('label')
  soundInputLabel.id = 'sound-input-label'

  const soundAddIcon = document.createElement('div')
  soundAddIcon.id = 'sound-input-add-icon'
  soundInputLabel.appendChild(soundAddIcon)

  const soundInput = document.createElement('input')
  soundInput.type = 'file'
  soundInput.id = 'sound-input'
  soundInputLabel.appendChild(soundInput)

  soundSelector.appendChild(soundInputLabel)

  soundInput.addEventListener('change', async () => {
    if (soundInput.files === null || !soundInput.files.length) {
      return
    }

    const dataUrl = await readAsDataUrlAsync(soundInput)

    const soundSelector = getSoundSelector()
    const customSoundThumbnail = soundSelector.querySelector('.custom-input') as HTMLImageElement | null

    if (customSoundThumbnail) {
      customSoundThumbnail.setAttribute('data-sound-src', dataUrl)
      customSoundThumbnail.title = soundInput.files[0].name
      selectSound(customSoundThumbnail, true)
      playSoundPreview(customSoundThumbnail)
      return
    }

    const newCustomSoundThumbnail = createSingleSound(
      dataUrl,
      'sounds/thumbnail.png',
      soundInput.files[0].name,
      true,
      true,
    )
    soundSelector.insertBefore(newCustomSoundThumbnail, soundInputLabel)
    playSoundPreview(newCustomSoundThumbnail)
  })

  return soundInput
}

interface PresetDetailSingle {
  url: string
  thumbnailUrl: string
  title: string
}

const createSoundPresets = (database: Database) => {
  const presetSoundCount = 0

  const presetSoundDetails: PresetDetailSingle[] = [
    {
      url: 'sounds/preset-1.wav',
      thumbnailUrl: 'sounds/thumbnail.png',
      title: 'Financial Enforcer',
    },
  ]

  for (let presetSoundNumber = 1; presetSoundNumber <= presetSoundCount; presetSoundNumber++) {
    presetSoundDetails.push({
      url: `sounds/preset-${presetSoundNumber}.wav`,
      thumbnailUrl: `sounds/preset-${presetSoundNumber}-thumbnail.png`,
      title: `Preset ${presetSoundNumber}`,
    })
  }

  for (const presetSoundDetailsSingle of presetSoundDetails) {
    createSingleSound(
      presetSoundDetailsSingle.url,
      presetSoundDetailsSingle.thumbnailUrl,
      presetSoundDetailsSingle.title,
      database.options.soundDataUrl !== null &&
        !database.options.soundDataUrl?.startsWith('data:') &&
        database.options.soundDataUrl.endsWith(presetSoundDetailsSingle.url),
      false,
    )
  }
}

export const createSoundSelector = (database: Database) => {
  createSoundPresets(database)

  if (database.options.soundDataUrl !== null && database.options.soundDataUrl.startsWith('data:')) {
    createSingleSound(database.options.soundDataUrl, 'sounds/thumbnail.png', 'Your Upload', true, false)
  }

  return createSoundUploader()
}

export const getSelectedSoundUrl = async (database: Database): Promise<string | null> => {
  const soundInput = document.getElementById('sound-input') as HTMLInputElement

  let soundDataUrl: string | null = database.options.soundDataUrl
  const selectedSoundThumbnailElement = getSelectedSoundThumbnailElement()

  if (selectedSoundThumbnailElement) {
    if (selectedSoundThumbnailElement.src.startsWith('data:')) {
      soundDataUrl = await readAsDataUrlAsync(soundInput)
    } else {
      soundDataUrl = selectedSoundThumbnailElement.getAttribute('data-sound-src')
    }
  }

  return soundDataUrl
}
