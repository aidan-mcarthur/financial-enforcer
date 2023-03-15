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
    if (
      (database.options.dailyTimeEntryReminder && !currentWeekData.daysFilled[dayPrior]) ||
      currentWeekData.status === 'some-unsaved'
    ) {
      return true
    }
  }

  const dayOfWeekIndex = dayOfWeekIndexes[dayOfWeek]
  const thursdayIndex = dayOfWeekIndexes.thursday

  return (
    database.options.endOfWeekTimesheetReminder &&
    dayOfWeekIndex >= thursdayIndex &&
    currentWeekData.status !== 'all-submitted-or-approved'
  )
}
