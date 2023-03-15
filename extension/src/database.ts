import { Database, isDatabase } from './types/database'

export const getDatabase = async (): Promise<Database> => {
  const result = await chrome.storage.local.get('database')

  if (!isDatabase(result.database)) {
    throw new Error('The database has not been initialized')
  }

  return result.database
}

export const initializeDatabase = async () => {
  const result = await chrome.storage.local.get('database')

  if (result && isDatabase(result.database)) {
    return
  }

  const database: Database = {
    weeks: {},
  }

  await chrome.storage.local.set({ database })
}
