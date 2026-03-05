import { memo, useEffect, useRef, useState } from 'react'

import { useInterval } from '@/features/common/hook/useInterval'
import { Timer } from '@/assets/icons/Timer'

interface ExpiredTimeProps {
  onTime: () => void
}

export const ExpiredTime = memo(({ onTime }: ExpiredTimeProps) => {
  const [ms, setMs] = useState(60_000)
  const firedRef = useRef(false)
  const onTimeRef = useRef(onTime)

  useEffect(() => {
    onTimeRef.current = onTime
  }, [onTime])

  useInterval(
    () => {
      setMs((prev) => {
        return Math.max(0, prev - 1_000)
      })
    },
    ms <= 0 ? null : 1_000,
  )

  useEffect(() => {
    if (ms !== 0 || firedRef.current) {
      return
    }
    firedRef.current = true
    onTimeRef.current()
  }, [ms])

  return (
    <div className='flex gap-1 rounded-xl bg-neutral-200 px-2 py-2'>
      <Timer />
      <div className='w-8 text-center'>
        <p>{ms / 1_000}</p>
      </div>
    </div>
  )
})

ExpiredTime.displayName = 'ExpiredTime'
