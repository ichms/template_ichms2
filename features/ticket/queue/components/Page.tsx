import { useCallback } from 'react'
import { ProgressBar } from '@/features/common/component/ProgressBar'
import { useSetTokenId, useTokenIdValue } from '@/features/common/store/useTicketStore'
import { useQueueStatusQuery } from '@/features/ticket/queue/hooks/queries'
import { useQueueRouteGuard } from '@/features/ticket/queue/hooks/useQueueRouteGuard'
import { msToMin } from '@/features/ticket/shared/utils'
import { HttpError } from '@/packages/http/client'
import { Clock } from '@/assets/icons/Clock'

interface QueuePageProps {
  ticketId: string
}

export const QueuePage = ({ ticketId }: QueuePageProps) => {
  const tokenId = useTokenIdValue()
  const setTokenId = useSetTokenId()

  const queueStatusQuery = useQueueStatusQuery(tokenId, {
    polling: true,
  })
  const queueTokenStatus = queueStatusQuery.data?.token.status
  const queueHttpErrorStatus =
    queueStatusQuery.error instanceof HttpError ? queueStatusQuery.error.status : null

  const handleExpireToken = useCallback(() => {
    setTokenId(null)
  }, [setTokenId])

  useQueueRouteGuard({
    ticketId,
    tokenId,
    isQueueStatusSuccess: queueStatusQuery.isSuccess,
    isQueueStatusError: queueStatusQuery.isError,
    queueTokenStatus,
    queueHttpErrorStatus,
    onExpireToken: handleExpireToken,
  })

  if (tokenId === null) {
    return null
  }

  const { minutes, seconds } = msToMin(
    queueStatusQuery.data?.queueStatus.estimatedWaitTime ?? 0,
  )

  return (
    <div className='mx-auto max-w-xl md:px-6'>
      <div className='h-30' />
      <div className='flex flex-col items-center gap-4 rounded-lg border border-neutral-200 bg-white p-8 text-center'>
        <div className='flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100'>
          <Clock textColor='text-neutral-500' />
        </div>
        <div>
          <p className='text-XL-Regular'>접속 대기 중입니다.</p>
          <p className='pt-1'>순서가 오면 다음 단계로 넘어 갑니다.</p>
        </div>

        <ProgressBar progress={queueStatusQuery.data?.queueStatus.progress ?? 0} />

        <div className='flex w-full justify-center gap-2 rounded-lg border border-neutral-200 bg-neutral-100 py-3'>
          <p className='text-M-Light w-1/2 text-right text-neutral-600'>
            예상 대기 시간:
          </p>
          <div className='w-1/2 text-start'>
            <p className='text-M-Bold'>{`${minutes}분 ${seconds}초`}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
