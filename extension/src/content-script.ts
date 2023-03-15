import { getTimeSheet, isTimeSheetPage } from './time-sheet'
import { TimeSheetStateChange } from './types/state'
import { TimeSheet } from './types/time-sheet'
import { waitFor } from './utils'

const sendTimeSheetStateChange = (timeSheet: TimeSheet | null) => {
  const stateChange: TimeSheetStateChange = {
    type: 'onTimeSheetStateChange',
    timeSheet,
  }

  chrome.runtime.sendMessage(stateChange)
}

const main = async () => {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    await waitFor(5000)
    console.log('Checking for time sheet page...')

    if (!isTimeSheetPage()) {
      console.log('We are not on the timesheet page')
      sendTimeSheetStateChange(null)

      continue
    }

    try {
      const timeSheet = getTimeSheet()
      sendTimeSheetStateChange(timeSheet)
    } catch (e) {
      console.warn(e)
      console.log('Timesheet page detected but user is in an inputting state')
    }
  }
}

main()

export {}
