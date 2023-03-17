import { Database } from '../types/database'
import { readAsDataUrlAsync } from './utils'

const getGifSelector = (): HTMLDivElement => {
  return document.getElementById('gif-selector') as HTMLDivElement
}

const getSelectedGifImageElement = (): HTMLImageElement | null => {
  const gifSelector = getGifSelector()
  return gifSelector.querySelector('.selected') as HTMLImageElement | null
}

const removeSelectedFromAll = () => {
  const gifSelector = getGifSelector()
  const imageElements = Array.from(gifSelector.querySelectorAll('img')) as HTMLImageElement[]

  for (const imageElement of imageElements) {
    imageElement.classList.remove('selected')
  }
}

const selectGif = (preview: HTMLImageElement) => {
  removeSelectedFromAll()
  preview.classList.add('selected')
}

const createSingleGif = (
  source: string,
  title: string,
  isSelected: boolean,
  isCustomInput: boolean,
): HTMLImageElement => {
  const presetSrc = source

  const presetGif = document.createElement('img') as HTMLImageElement

  if (isSelected) {
    selectGif(presetGif)
  }

  presetGif.src = presetSrc
  presetGif.title = title

  const gifSelector = getGifSelector()
  gifSelector.appendChild(presetGif)

  if (isCustomInput) {
    presetGif.classList.add('custom-input')
  }

  presetGif.onclick = () => {
    selectGif(presetGif)
  }

  return presetGif
}

const createGifUploader = () => {
  const gifSelector = getGifSelector()

  const gifInputLabel = document.createElement('label')
  gifInputLabel.id = 'gif-input-label'

  const gifAddIcon = document.createElement('div')
  gifAddIcon.id = 'gif-input-add-icon'
  gifInputLabel.appendChild(gifAddIcon)

  const gifInput = document.createElement('input')
  gifInput.type = 'file'
  gifInput.id = 'gif-input'
  gifInputLabel.appendChild(gifInput)

  gifSelector.appendChild(gifInputLabel)

  gifInput.addEventListener('change', async () => {
    if (gifInput.files === null || !gifInput.files.length) {
      return
    }

    const dataUrl = await readAsDataUrlAsync(gifInput)

    const gifSelector = getGifSelector()
    const customGifPreview = gifSelector.querySelector('.custom-input') as HTMLImageElement | null

    if (customGifPreview) {
      customGifPreview.src = dataUrl
      customGifPreview.title = gifInput.files[0].name
      selectGif(customGifPreview)
      return
    }

    const newCustomGifPreview = createSingleGif(dataUrl, gifInput.files[0].name, true, true)
    gifSelector.insertBefore(newCustomGifPreview, gifInputLabel)
  })

  return gifInput
}

interface PresetDetailSingle {
  url: string
  title: string
}

const createGifPresets = (database: Database) => {
  const presetGifsCount = 16

  const presetGifDetails: PresetDetailSingle[] = [
    {
      url: 'gifs/financial-enforcer.gif',
      title: 'Financial Enforcer',
    },
  ]

  for (let presetGifNumber = 1; presetGifNumber <= presetGifsCount; presetGifNumber++) {
    presetGifDetails.push({
      url: `gifs/preset-${presetGifNumber}.gif`,
      title: `Preset ${presetGifNumber}`,
    })
  }

  for (const presetGifDetailsSingle of presetGifDetails) {
    createSingleGif(
      presetGifDetailsSingle.url,
      presetGifDetailsSingle.title,
      database.options.gifDataUrl !== null &&
        !database.options.gifDataUrl?.startsWith('data:') &&
        database.options.gifDataUrl.endsWith(presetGifDetailsSingle.url),
      false,
    )
  }
}

export const createGifSelector = (database: Database) => {
  createGifPresets(database)

  if (database.options.gifDataUrl !== null && database.options.gifDataUrl.startsWith('data:')) {
    createSingleGif(database.options.gifDataUrl, `Your Upload`, true, false)
  }

  return createGifUploader()
}

export const getSelectedGifUrl = async (database: Database): Promise<string | null> => {
  const gifInput = document.getElementById('gif-input') as HTMLInputElement

  let gifDataUrl: string | null = database.options.gifDataUrl
  const selectedGifImageElement = getSelectedGifImageElement()

  if (selectedGifImageElement) {
    if (selectedGifImageElement.src.startsWith('data:')) {
      gifDataUrl = await readAsDataUrlAsync(gifInput)
    } else {
      gifDataUrl = selectedGifImageElement.src
    }
  }

  return gifDataUrl
}
