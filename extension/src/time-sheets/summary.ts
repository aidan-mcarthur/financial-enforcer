import { DayOfWeek } from '../types/dates'
import { DaysFilled, TimeSheet, TimeSheetSummary, WeekStatus } from '../types/time-sheet'

const determineWeekStatusFromTimeCards = (timeSheet: TimeSheet): WeekStatus => {
  if (!timeSheet.timeCards.length) {
    return 'no-time-cards'
  }

  const firstUnsaved = timeSheet.timeCards.find((timeCard) => timeCard.status === 'unsaved')
  if (firstUnsaved) {
    return 'some-unsaved'
  }

  if (timeSheet.timeCards.every((timeCard) => timeCard.status === 'submitted' || timeCard.status === 'approved')) {
    return 'all-submitted-or-approved'
  }

  return 'some-unsubmitted'
}

const determineDaysFilledFromTimeCards = (timeSheet: TimeSheet): DaysFilled => {
  const daysFilled: DaysFilled = {
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  }

  for (const timeCard of timeSheet.timeCards) {
    for (const day of Object.keys(daysFilled)) {
      const dayOfWeek = day as DayOfWeek
      if (timeCard.hours[dayOfWeek] > 0) {
        daysFilled[dayOfWeek] = true
      }
    }
  }

  return daysFilled
}

const determineTotalDaysSubmittedFromTimeCards = (timeSheet: TimeSheet): number => {
  let totalDaysSubmitted = 0

  for (const timeCard of timeSheet.timeCards.filter((timeCard) => timeCard.status === 'submitted')) {
    for (const day of Object.keys(timeCard.hours)) {
      const dayOfWeek = day as DayOfWeek
      if (timeCard.hours[dayOfWeek] > 0) {
        totalDaysSubmitted++
      }
    }
  }

  return totalDaysSubmitted
}

const determineTotalDaysSavedFromTimeCards = (timeSheet: TimeSheet): number => {
  let totalDaysSaved = 0

  for (const timeCard of timeSheet.timeCards.filter((timeCard) => timeCard.status === 'saved')) {
    for (const day of Object.keys(timeCard.hours)) {
      const dayOfWeek = day as DayOfWeek
      if (timeCard.hours[dayOfWeek] > 0) {
        totalDaysSaved++
      }
    }
  }

  return totalDaysSaved
}

export const summarizeTimeSheet = (timeSheet: TimeSheet): TimeSheetSummary => {
  return {
    weekStatus: determineWeekStatusFromTimeCards(timeSheet),
    daysFilled: determineDaysFilledFromTimeCards(timeSheet),
    totalDaysSubmitted: determineTotalDaysSubmittedFromTimeCards(timeSheet),
    totalDaysSaved: determineTotalDaysSavedFromTimeCards(timeSheet),
  }
}
