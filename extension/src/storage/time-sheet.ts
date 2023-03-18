import { addDays, DateOnly, toDateOnlyKey } from '../types/dates'
import { DaysFilled, TimeSheet, WeekStatus } from '../types/time-sheet'

export const determineWeekStatusFromTimeCards = (timeSheet: TimeSheet): WeekStatus => {
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

export const determineDaysFilledFromTimeCards = (timeSheet: TimeSheet): DaysFilled => {
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
    if (timeCard.hours.monday > 0) {
      daysFilled.monday = true
    }

    if (timeCard.hours.tuesday > 0) {
      daysFilled.tuesday = true
    }

    if (timeCard.hours.wednesday > 0) {
      daysFilled.wednesday = true
    }

    if (timeCard.hours.thursday > 0) {
      daysFilled.thursday = true
    }

    if (timeCard.hours.friday > 0) {
      daysFilled.friday = true
    }

    if (timeCard.hours.saturday > 0) {
      daysFilled.saturday = true
    }

    if (timeCard.hours.sunday > 0) {
      daysFilled.sunday = true
    }
  }

  return daysFilled
}

export const getTimeSheet = async (weekMondayDate: DateOnly): Promise<TimeSheet> => {
  const key = `timesheet-${toDateOnlyKey(weekMondayDate)}`
  const result = await chrome.storage.local.get([key])

  if (result[key] && isTimeSheet(result[key])) {
    return result[key]
  }

  return {
    dates: {
      monday: weekMondayDate,
      tuesday: addDays(weekMondayDate, 1),
      wednesday: addDays(weekMondayDate, 2),
      thursday: addDays(weekMondayDate, 3),
      friday: addDays(weekMondayDate, 4),
      saturday: addDays(weekMondayDate, 5),
      sunday: addDays(weekMondayDate, 6),
    },
    timeCards: [],
  }
}

const isTimeSheet = (timeSheet: any): timeSheet is TimeSheet => TimeSheet.safeParse(timeSheet).success
