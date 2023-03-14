import { TimeSheet } from './time-sheet'

export interface StateChange {
  type?: string
}

export interface TimeSheetStateChange {
  type: 'onTimeSheetStateChange'
  timeSheet: TimeSheet | null
}

export const isTimeSheetStateChange = (input: StateChange): input is TimeSheetStateChange => {
  return input.type === 'onTimeSheetStateChange'
}
