import { getExtensionOptions } from '../storage/extension-options'
import { determineDaysFilledFromTimeCards, determineWeekStatusFromTimeCards, getTimeSheet } from '../storage/time-sheet'
import {
  dayOfWeekIndexes,
  getAllDaysPriorInWeek,
  getDayOfWeek,
  getMondayOfDateOnly,
  getTodayDateOnly,
} from '../types/dates'

export const shouldNotifyUser = async (): Promise<boolean> => {
  const today = getTodayDateOnly()
  const dayOfWeek = getDayOfWeek(today)
  const monday = getMondayOfDateOnly(today)
  const timeSheet = await getTimeSheet(monday)
  const weekStatus = determineWeekStatusFromTimeCards(timeSheet)
  const daysFilled = determineDaysFilledFromTimeCards(timeSheet)
  const daysPrior = getAllDaysPriorInWeek(dayOfWeek, true, true)
  const extensionOptions = await getExtensionOptions()

  for (const dayPrior of daysPrior) {
    if ((extensionOptions.dailyTimeEntryReminder && !daysFilled[dayPrior]) || weekStatus === 'some-unsaved') {
      return true
    }
  }

  const dayOfWeekIndex = dayOfWeekIndexes[dayOfWeek]
  const thursdayIndex = dayOfWeekIndexes.thursday

  return (
    extensionOptions.endOfWeekTimesheetReminder &&
    dayOfWeekIndex >= thursdayIndex &&
    weekStatus !== 'all-submitted-or-approved'
  )
}
