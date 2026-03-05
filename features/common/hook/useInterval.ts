import { useEffect, useRef } from 'react'

type IntervalCallback = () => void | Promise<void>

export const useInterval = (callback: IntervalCallback, delay: number | null) => {
  const savedCallback = useRef<IntervalCallback>(callback)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (delay === null) {
      return
    }

    const id = window.setInterval(() => {
      void savedCallback.current()
    }, delay)

    return () => {
      window.clearInterval(id)
    }
  }, [delay])
}
