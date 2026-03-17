import { useEffect, useRef } from 'react'

interface UseCleanupOnUnmountOptions {
  skipFirstDevCleanup?: boolean
}

// 컴포넌트가 실제로 언마운트될 때 정리 로직을 실행하기 위한 훅이다.
// React 18 개발 모드 Strict Mode에서는 검사용 cleanup이 한 번 더 실행될 수 있어
// 필요 시 첫 번째 cleanup을 건너뛰고 실제 언마운트 시점에만 cleanup이 동작하도록 보정한다.
export const useCleanupOnUnmount = (
  cleanup: () => void,
  options?: UseCleanupOnUnmountOptions,
) => {
  const shouldSkipFirstDevCleanup = options?.skipFirstDevCleanup ?? true
  const skippedDevCleanupRef = useRef(false)
  const cleanupRef = useRef(cleanup)

  useEffect(() => {
    cleanupRef.current = cleanup
  }, [cleanup])

  useEffect(() => {
    return () => {
      if (
        process.env.NODE_ENV === 'development' &&
        shouldSkipFirstDevCleanup &&
        skippedDevCleanupRef.current === false
      ) {
        skippedDevCleanupRef.current = true
        return
      }

      cleanupRef.current()
    }
  }, [shouldSkipFirstDevCleanup])
}
