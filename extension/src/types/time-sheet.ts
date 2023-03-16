import { isRoughlyEqualNumber } from '../utils'
import { DateOnly, isDateOnlyEqual } from './dates'

export type TimeCardStatus = 'submitted' | 'saved' | 'unsaved' | 'approved'

export interface Hours {
  monday: number
  tuesday: number
  wednesday: number
  thursday: number
  friday: number
  saturday: number
  sunday: number
}

export interface TimeCard {
  index: number
  projectName: string
  hours: Hours
  status: TimeCardStatus
}

export interface TimeSheetDates {
  monday: DateOnly
  tuesday: DateOnly
  wednesday: DateOnly
  thursday: DateOnly
  friday: DateOnly
  saturday: DateOnly
  sunday: DateOnly
}

export interface TimeSheet {
  dates: TimeSheetDates
  timeCards: TimeCard[]
}

export const isTimeCardEqual = (first: TimeCard, second: TimeCard) => {
  if (
    first.status !== second.status ||
    first.projectName !== second.projectName ||
    first.index !== second.index ||
    !isRoughlyEqualNumber(first.hours.monday, second.hours.monday) ||
    !isRoughlyEqualNumber(first.hours.tuesday, second.hours.tuesday) ||
    !isRoughlyEqualNumber(first.hours.wednesday, second.hours.wednesday) ||
    !isRoughlyEqualNumber(first.hours.thursday, second.hours.thursday) ||
    !isRoughlyEqualNumber(first.hours.friday, second.hours.friday) ||
    !isRoughlyEqualNumber(first.hours.saturday, second.hours.saturday) ||
    !isRoughlyEqualNumber(first.hours.sunday, second.hours.sunday)
  ) {
    return false
  }

  return true
}

export const isTimeSheetEqual = (first: TimeSheet | null, second: TimeSheet | null) => {
  if (first === second) {
    return true
  }

  if (first === null || second === null) {
    return false
  }

  if (
    !isDateOnlyEqual(first.dates.monday, second.dates.monday) ||
    !isDateOnlyEqual(first.dates.tuesday, second.dates.tuesday) ||
    !isDateOnlyEqual(first.dates.wednesday, second.dates.wednesday) ||
    !isDateOnlyEqual(first.dates.thursday, second.dates.thursday) ||
    !isDateOnlyEqual(first.dates.friday, second.dates.friday) ||
    !isDateOnlyEqual(first.dates.saturday, second.dates.saturday) ||
    !isDateOnlyEqual(first.dates.sunday, second.dates.sunday)
  ) {
    return false
  }

  if (first.timeCards.length !== second.timeCards.length) {
    return false
  }

  for (let timeCardIndex = 0; timeCardIndex < first.timeCards.length; timeCardIndex++) {
    if (!isTimeCardEqual(first.timeCards[timeCardIndex], second.timeCards[timeCardIndex])) {
      return false
    }
  }

  return true
}
