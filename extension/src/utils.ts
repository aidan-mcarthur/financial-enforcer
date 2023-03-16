import { BackgroundTaskState, CancelBackgroundTaskFn } from './background-task'

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

export const isRoughlyEqualNumber = (first: number, second: number, tolerance = 0.01) => {
  if (isNaN(first) || isNaN(second)) {
    return false
  }

  const difference = Math.abs(first - second)
  return difference <= tolerance
}
