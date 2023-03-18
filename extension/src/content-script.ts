import { DataSource } from './data-sources/data-source'
import { lightning } from './data-sources/lightning'
import { toDateOnlyKey } from './types/dates'
import { isTimeSheetEqual, TimeSheet } from './types/time-sheet'
import { waitFor } from './utils/utils'

const main = async () => {
  let lastTimeSheetUpdate: TimeSheet | null = null
  const dataSources: DataSource[] = [lightning]

  // eslint-disable-next-line no-constant-condition
  while (true) {
    await waitFor(5000)

    for (const dataSource of dataSources) {
      const timeSheet = await dataSource.queryTimeSheet()

      if (!timeSheet) {
        console.log(window.location.href, 'No update to send')
        continue
      }

      if (lastTimeSheetUpdate && isTimeSheetEqual(timeSheet, lastTimeSheetUpdate)) {
        console.log(window.location.href, 'No delta in timesheet')
        continue
      }

      lastTimeSheetUpdate = timeSheet

      console.log(window.location.href, 'Sending update', timeSheet)

      const data: { [key: string]: TimeSheet } = {}
      data[`timesheet-${toDateOnlyKey(timeSheet.dates.monday)}`] = timeSheet
      await chrome.storage.local.set(data)
    }
  }
}

main()

export {}
