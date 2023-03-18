import { getTimeSheet } from './storage/time-sheet'
import { addDays, getDayOfWeek, getMondayOfDateOnly, getTodayDateOnly } from './types/dates'
import { setIntervalAsync } from './utils/utils'

const main = async () => {
  const today = getTodayDateOnly()
  const monday = getMondayOfDateOnly(today)

  const daysSubmittedElement = document.getElementById('timecard-days-submitted') as HTMLSpanElement
  const daysSavedElement = document.getElementById('timecard-days-saved') as HTMLSpanElement
  const timeLeftElement = document.getElementById('timecard-time-left') as HTMLSpanElement
  const loadingElement = document.getElementById('loading') as HTMLDivElement
  const statusElement = document.getElementById('status') as HTMLDivElement

  setIntervalAsync(async () => {
    let totalDaysSubmitted = 0
    let totalDaysSaved = 0
    const timeSheet = await getTimeSheet(monday)

    for (const timeCard of timeSheet.timeCards) {
      if (timeCard.hours.monday > 0) {
        if (timeCard.status === 'submitted') {
          totalDaysSubmitted++
        } else if (timeCard.status === 'saved') {
          totalDaysSaved++
        }
      }

      if (timeCard.hours.monday > 0) {
        if (timeCard.status === 'submitted') {
          totalDaysSubmitted++
        } else if (timeCard.status === 'saved') {
          totalDaysSaved++
        }
      }

      if (timeCard.hours.tuesday > 0) {
        if (timeCard.status === 'submitted') {
          totalDaysSubmitted++
        } else if (timeCard.status === 'saved') {
          totalDaysSaved++
        }
      }

      if (timeCard.hours.wednesday > 0) {
        if (timeCard.status === 'submitted') {
          totalDaysSubmitted++
        } else if (timeCard.status === 'saved') {
          totalDaysSaved++
        }
      }

      if (timeCard.hours.thursday > 0) {
        if (timeCard.status === 'submitted') {
          totalDaysSubmitted++
        } else if (timeCard.status === 'saved') {
          totalDaysSaved++
        }
      }

      if (timeCard.hours.friday > 0) {
        if (timeCard.status === 'submitted') {
          totalDaysSubmitted++
        } else if (timeCard.status === 'saved') {
          totalDaysSaved++
        }
      }

      if (timeCard.hours.saturday > 0) {
        if (timeCard.status === 'submitted') {
          totalDaysSubmitted++
        } else if (timeCard.status === 'saved') {
          totalDaysSaved++
        }
      }

      if (timeCard.hours.sunday > 0) {
        if (timeCard.status === 'submitted') {
          totalDaysSubmitted++
        } else if (timeCard.status === 'saved') {
          totalDaysSaved++
        }
      }
    }

    daysSubmittedElement.innerHTML = totalDaysSubmitted.toString(10)
    daysSavedElement.innerHTML = totalDaysSubmitted.toString(10)

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
    return true
  }, 1000)
}

document.addEventListener('DOMContentLoaded', async () => {
  await main()
})

export {}
