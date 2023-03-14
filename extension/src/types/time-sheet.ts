import { DateOnly } from './dates'

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
