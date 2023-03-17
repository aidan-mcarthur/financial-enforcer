import { getDatabase, saveDatabase } from './database'

const readAsDataUrlAsync = async (input: HTMLInputElement): Promise<string> => {
  return new Promise((resolve, reject) => {
    const files = input.files

    if (files === null || files.length === 0) {
      reject(new Error('No file selected'))
      return
    }

    const file = files[0]
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = async () => {
      const fileDataUrl = reader.result
      if (fileDataUrl === null) {
        reject(new Error('Invalid file selection'))
        return
      }

      if (fileDataUrl instanceof ArrayBuffer) {
        reject(new Error('Invalid file data'))
        return
      }
      resolve(fileDataUrl)
    }
  })
}

interface PresetDetailSingle {
  url: string
  title: string
}
const main = async () => {
  const database = await getDatabase()

  const form = document.getElementById('options') as HTMLFormElement
  const endOfWeekTimesheetReminder = document.getElementById('end-of-week-timesheet-reminder') as HTMLInputElement
  const dailyTimeEntryReminder = document.getElementById('daily-time-entry-reminder') as HTMLInputElement
  const soundInput = document.getElementById('sound-input') as HTMLInputElement

  const gifSelector = document.getElementById('gif-selector') as HTMLDivElement

  if (!form || !endOfWeekTimesheetReminder || !dailyTimeEntryReminder || !soundInput || !gifSelector) {
    throw new Error('Unable to find options form')
  }

  const presetGifsCount = 16
  const gifImageElements: HTMLImageElement[] = []
  let selectedGifImageElement: HTMLImageElement

  const removeSelectedFromAll = () => {
    for (const gifImageElement of gifImageElements) {
      gifImageElement.classList.remove('selected')
    }
  }

  const selectGif = (gifPreview: HTMLImageElement) => {
    removeSelectedFromAll()
    gifPreview.classList.add('selected')
    selectedGifImageElement = gifPreview
  }

  const createSingleGif = (
    source: string,
    title: string,
    isSelected: boolean,
    isCustomInput: boolean,
  ): HTMLImageElement => {
    const presetSrc = source

    const presetGif = document.createElement('img') as HTMLImageElement
    gifImageElements.push(presetGif)

    if (isSelected) {
      selectGif(presetGif)
    }

    presetGif.src = presetSrc
    presetGif.title = title
    gifSelector.appendChild(presetGif)

    if (isCustomInput) {
      presetGif.classList.add('custom-input')
    }

    presetGif.onclick = () => selectGif(presetGif)
    return presetGif
  }

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

  if (database.options.gifDataUrl !== null && database.options.gifDataUrl.startsWith('data:')) {
    createSingleGif(database.options.gifDataUrl, `Your Upload`, true, false)
  }

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

  endOfWeekTimesheetReminder.checked = database.options.endOfWeekTimesheetReminder
  dailyTimeEntryReminder.checked = database.options.dailyTimeEntryReminder

  let customGifPreview: HTMLImageElement | null = null

  gifInput.addEventListener('change', async () => {
    if (gifInput.files === null || !gifInput.files.length) {
      return
    }

    removeSelectedFromAll()
    const dataUrl = await readAsDataUrlAsync(gifInput)

    if (customGifPreview === null) {
      customGifPreview = createSingleGif(dataUrl, gifInput.files[0].name, true, true)
      gifSelector.insertBefore(customGifPreview, gifInputLabel)
    } else {
      customGifPreview.src = dataUrl
      selectGif(customGifPreview)
    }
  })

  form.addEventListener('submit', async (event) => {
    event.preventDefault()

    let soundDataUrl: string | null = database.options.soundDataUrl
    let gifDataUrl: string | null = database.options.gifDataUrl

    if (soundInput.files && soundInput.files.length) {
      soundDataUrl = await readAsDataUrlAsync(soundInput)
    }

    if (selectedGifImageElement.src.startsWith('data:')) {
      gifDataUrl = await readAsDataUrlAsync(gifInput)
    } else {
      gifDataUrl = selectedGifImageElement.src
    }

    await saveDatabase({
      ...database,
      options: {
        soundDataUrl,
        gifDataUrl,
        endOfWeekTimesheetReminder: endOfWeekTimesheetReminder.checked,
        dailyTimeEntryReminder: dailyTimeEntryReminder.checked,
      },
    })

    window.close()
  })
}

document.addEventListener('DOMContentLoaded', async () => {
  await main()
})

export {}
