const saveFile = async (input: HTMLInputElement, storageKey: string): Promise<void> => {
  const files = input.files

  if (files === null) {
    return
  }

  const file = files[0]
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = async () => {
    const fileDataUrl = reader.result

    const data: any = {}
    data[storageKey] = fileDataUrl
    await chrome.storage.local.set(data)
  }
}

const main = async () => {
  const form = document.getElementById('options') as HTMLFormElement
  const soundInput = document.getElementById('sound-input') as HTMLInputElement
  const gifInput = document.getElementById('gif-input') as HTMLInputElement

  if (!form || !soundInput || !gifInput) {
    throw new Error('Unable to find options form')
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault()

    await saveFile(soundInput, 'soundFile')
    await saveFile(gifInput, 'gifFile')
    window.close()
  })
}

document.addEventListener('DOMContentLoaded', async () => {
  await main()
})

export {}
