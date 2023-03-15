import { initializeDatabase } from './database'
import { onStateChange } from './state-changes'

const main = async () => {
  await initializeDatabase()
}

main()

chrome.runtime.onMessage.addListener(onStateChange)

export {}
