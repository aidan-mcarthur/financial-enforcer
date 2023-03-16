export const waitFor = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

export type AsyncInterfaceFn = () => Promise<boolean>
export type CancelAsyncInterfaceFn = () => void
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

export type CancelBackgroundTaskFn = () => void

interface DelayBackgroundTaskState {
  type: 'delay'
  delay: number
}

interface DoneBackgroundTaskState {
  type: 'done'
}

type BackgroundTaskState = DelayBackgroundTaskState | DoneBackgroundTaskState

export const createLoopingBackgroundTask = <TState extends BackgroundTaskState>(
  initialState: TState,
  fn: (state: TState) => Promise<TState>,
): CancelBackgroundTaskFn => {
  let isCancelled = false
  let state = initialState

  setTimeout(async () => {
    while (!isCancelled) {
      state = await fn(state)

      if (state.type === 'done') {
        break
      }

      await waitFor(state.delay)
    }
  }, 0)

  return () => {
    isCancelled = true
  }
}
