import { getTimeSheet } from './time-sheets/storage'
import { summarizeTimeSheet } from './time-sheets/summary'
import { addDays, getDayOfWeek, getMondayOfDateOnly, getTodayDateOnly } from './types/dates'
import { waitFor } from './utils/utils'

const main = async () => {
  const today = getTodayDateOnly()
  const monday = getMondayOfDateOnly(today)

  const daysSubmittedElement = document.getElementById('timecard-days-submitted') as HTMLSpanElement
  const daysSavedElement = document.getElementById('timecard-days-saved') as HTMLSpanElement
  const timeLeftElement = document.getElementById('timecard-time-left') as HTMLSpanElement
  const loadingElement = document.getElementById('loading') as HTMLDivElement
  const statusElement = document.getElementById('status') as HTMLDivElement

  // eslint-disable-next-line no-constant-condition
  while (true) {
    await waitFor(1000)

    const timeSheet = await getTimeSheet(monday)
    const summary = summarizeTimeSheet(timeSheet)

    daysSubmittedElement.innerHTML = summary.totalDaysSubmitted.toString(10)
    daysSavedElement.innerHTML = summary.totalDaysSubmitted.toString(10)

    // todo: the due date should be dynamic
    const now = new Date()
    const today = getTodayDateOnly()
    const dayOfWeek = getDayOfWeek(today)

    const daysUntilFriday = {
      monday: 4,
      tuesday: 3,
      wednesday: 2,
      thursday: 1,
      friday: 0,
      saturday: 6,
      sunday: 5,
    }

    const dueDateOnly = addDays(today, daysUntilFriday[dayOfWeek])
    const dueDate = new Date(
      dueDateOnly.year,
      dueDateOnly.month - 1,
      dueDateOnly.day,
      17, // 5pm
      0,
      0,
    )
    const dueDateMillisecondsRemaining = dueDate.getTime() - now.getTime()

    if (dueDateMillisecondsRemaining < 0) {
      timeLeftElement.innerHTML = '00:00:00'
    } else {
      const hours = Math.floor(dueDateMillisecondsRemaining / 3600000)
      const minutes = Math.floor((dueDateMillisecondsRemaining % 3600000) / 60000)
      const seconds = Math.floor((dueDateMillisecondsRemaining % 60000) / 1000)
      timeLeftElement.innerHTML = `${hours}:${minutes}:${seconds}`
    }

    statusElement.style.display = 'block'
    loadingElement.style.display = 'none'
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  await main()
})

export {}
