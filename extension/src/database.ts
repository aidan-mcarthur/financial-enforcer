import { Database, defaultDatabase, isDatabase } from './types/database'

const optionalBool = (bool: boolean | undefined | null, defaultValue: boolean): boolean => {
  if (bool === undefined || bool === null) {
    return defaultValue
  }

  return bool
}

export const getDatabase = async (): Promise<Database> => {
  const result = await chrome.storage.local.get('database')

  if (!result || !result.database) {
    return defaultDatabase
  }

  // We have loaded something that may have been saved with an old version, so this is not fun but it allows us to have defaults and migration path.
  const uncheckedDatabase = result.database as any

  try {
    const database: Database = {
      weeks: uncheckedDatabase?.weeks || {},
      options: {
        dailyTimeEntryReminder: optionalBool(uncheckedDatabase?.options?.dailyTimeEntryReminder, true),
        endOfWeekTimesheetReminder: optionalBool(uncheckedDatabase?.options?.endOfWeekTimesheetReminder, true),
        gifDataUrl: uncheckedDatabase?.options?.gifDataUrl || null,
        soundDataUrl: uncheckedDatabase?.option?.soundDataUrl || null,
      },
    }

    return database
  } catch (e) {
    return defaultDatabase
  }
}

export const initializeDatabase = async () => {
  const result = await chrome.storage.local.get('database')

  if (result && isDatabase(result.database)) {
    return
  }

  await chrome.storage.local.set({ database: defaultDatabase })
}

export const saveDatabase = async (database: Database): Promise<void> => {
  await chrome.storage.local.set({
    database,
  })
}
