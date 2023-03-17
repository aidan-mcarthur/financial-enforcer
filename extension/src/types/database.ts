import { Options } from './options'

export interface DaysFilled {
  monday: boolean
  tuesday: boolean
  wednesday: boolean
  thursday: boolean
  friday: boolean
  saturday: boolean
  sunday: boolean
}

export type WeekStatus = 'no-time-cards' | 'some-unsaved' | 'some-unsubmitted' | 'all-submitted-or-approved'

export interface Week {
  status: WeekStatus
  daysFilled: DaysFilled
}

export interface Weeks {
  [key: string]: Week
}

export const defaultWeekData: Week = {
  status: 'no-time-cards',
  daysFilled: {
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  },
}

export interface Database {
  weeks: Weeks
  options: Options
}

export const defaultDatabase: Database = {
  weeks: {},
  options: {
    dailyTimeEntryReminder: true,
    endOfWeekTimesheetReminder: true,
    gifDataUrl: 'gifs/financial-enforcer.gif',
    soundDataUrl: 'sounds/preset-1.wav',
  },
}

export interface DatabaseInformation {
  database: Database
  isDatabaseInitialized: boolean
}

export const isDatabase = (input: unknown): input is Database => {
  return input ? true : false
}
