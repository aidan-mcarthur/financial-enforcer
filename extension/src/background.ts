import { initializeDatabase } from './database'
import { onStateChange } from './state-changes'

chrome.runtime.onStartup.addListener(function () {
  main()
})

const main = async () => {
  await initializeDatabase()
}

chrome.runtime.onMessage.addListener(onStateChange)

export {}
