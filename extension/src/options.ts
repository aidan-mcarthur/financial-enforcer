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

const main = async () => {
  const database = await getDatabase()

  const form = document.getElementById('options') as HTMLFormElement
  const endOfWeekTimesheetReminder = document.getElementById('end-of-week-timesheet-reminder') as HTMLInputElement
  const dailyTimeEntryReminder = document.getElementById('daily-time-entry-reminder') as HTMLInputElement
  const soundInput = document.getElementById('sound-input') as HTMLInputElement
  const gifInput = document.getElementById('gif-input') as HTMLInputElement

  if (!form || !endOfWeekTimesheetReminder || !dailyTimeEntryReminder || !soundInput || !gifInput) {
    throw new Error('Unable to find options form')
  }

  endOfWeekTimesheetReminder.checked = database.options.endOfWeekTimesheetReminder
  dailyTimeEntryReminder.checked = database.options.dailyTimeEntryReminder

  form.addEventListener('submit', async (event) => {
    event.preventDefault()

    let soundDataUrl: string | null = database.options.soundDataUrl
    let gifDataUrl: string | null = database.options.gifDataUrl

    if (soundInput.files && soundInput.files.length) {
      soundDataUrl = await readAsDataUrlAsync(soundInput)
    }

    if (gifInput.files && gifInput.files.length) {
      gifDataUrl = await readAsDataUrlAsync(gifInput)
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
