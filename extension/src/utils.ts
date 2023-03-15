export const waitFor = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

type AsyncInterfaceFn = () => Promise<boolean>
type CancelAsyncInterfaceFn = () => void
export const setIntervalAsync = (fn: AsyncInterfaceFn, ms: number): CancelAsyncInterfaceFn => {
  let timeout: NodeJS.Timeout | null = null

  const makeTimeout = () => {
    timeout = setTimeout(async () => {
      timeout = null
      const shouldContinue = await fn()

      if (shouldContinue) {
        makeTimeout()
      }
    }, ms)
  }

  makeTimeout()

  return () => {
    if (timeout !== null) {
      clearTimeout(timeout)
      timeout = null
    }
  }
}
