import { getDatabase, saveDatabase } from './database'
import { createGifSelector, getSelectedGifUrl } from './options/gifs'
import { createSoundSelector, getSelectedSoundUrl } from './options/sounds'

const main = async () => {
  const database = await getDatabase()

  const form = document.getElementById('options') as HTMLFormElement
  const endOfWeekTimesheetReminder = document.getElementById('end-of-week-timesheet-reminder') as HTMLInputElement
  const dailyTimeEntryReminder = document.getElementById('daily-time-entry-reminder') as HTMLInputElement
  // const soundInput = document.getElementById('sound-input') as HTMLInputElement

  if (!form || !endOfWeekTimesheetReminder || !dailyTimeEntryReminder) {
    throw new Error('Unable to find options form')
  }

  createGifSelector(database)
  createSoundSelector(database)

  endOfWeekTimesheetReminder.checked = database.options.endOfWeekTimesheetReminder
  dailyTimeEntryReminder.checked = database.options.dailyTimeEntryReminder

  form.addEventListener('submit', async (event) => {
    event.preventDefault()

    const soundDataUrl = await getSelectedSoundUrl(database)
    const gifDataUrl = await getSelectedGifUrl(database)

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
