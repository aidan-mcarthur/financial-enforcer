import { getDatabase } from './database'
import { defaultWeekData } from './types/database'
import {
  dayOfWeekIndexes,
  getAllDaysPriorInWeek,
  getDayOfWeek,
  getMondayOfDateOnly,
  getTodayDateOnly,
  serializeDateOnly,
} from './types/dates'

export const shouldNotifyUser = async (): Promise<boolean> => {
  const today = getTodayDateOnly()
  const dayOfWeek = getDayOfWeek(today)
  const monday = getMondayOfDateOnly(today)
  const database = await getDatabase()

  const mondaySerialized = serializeDateOnly(monday)
  const currentWeekData = database.weeks[mondaySerialized] || defaultWeekData

  const daysPrior = getAllDaysPriorInWeek(dayOfWeek, true, true)

  for (const dayPrior of daysPrior) {
    // TODO: Do not hard-code logic for always notifying user because they haven't clocked the day.
    if (!currentWeekData.daysFilled[dayPrior]) {
      console.log(':(')
      return true
    }
  }

  // TODO: Make configurable; warn user that it is end of week and they haven't submitted
  const dayOfWeekIndex = dayOfWeekIndexes[dayOfWeek]
  const thursdayIndex = dayOfWeekIndexes.thursday

  if (dayOfWeekIndex >= thursdayIndex && currentWeekData.status !== 'all-submitted-or-approved') {
    return true
  }

  return false
}
