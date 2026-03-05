import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { TICKETING_ERROR_TYPE, type QueueTokenStatus } from '@/features/ticket/shared/type'
import { buildErrorSearch } from '@/features/ticket/shared/utils'
import {
  QUEUE_ROUTE_GUARD_ACTION,
  decideQueueRouteGuardAction,
} from '@/features/ticket/queue/hooks/routeGuardDecision'

interface UseQueueRouteGuardParams {
  ticketId: string
  tokenId: string | null
  isQueueStatusSuccess: boolean
  isQueueStatusError: boolean
  queueTokenStatus: QueueTokenStatus | undefined
  queueHttpErrorStatus: number | null
  onExpireToken: () => void
}

export const useQueueRouteGuard = ({
  ticketId,
  tokenId,
  isQueueStatusSuccess,
  isQueueStatusError,
  queueTokenStatus,
  queueHttpErrorStatus,
  onExpireToken,
}: UseQueueRouteGuardParams) => {
  const router = useRouter()

  useEffect(() => {
    const decision = decideQueueRouteGuardAction({
      tokenId,
      isQueueStatusSuccess,
      isQueueStatusError,
      queueTokenStatus,
      queueHttpErrorStatus,
    })

    switch (decision.action) {
      case QUEUE_ROUTE_GUARD_ACTION.TO_DETAIL:
        router.replace(`/ticket/${ticketId}`)
        return
      case QUEUE_ROUTE_GUARD_ACTION.TO_SEAT:
        router.replace(`/ticket/${ticketId}/seat`)
        return
      case QUEUE_ROUTE_GUARD_ACTION.TO_TOKEN_ERROR:
        onExpireToken()
        router.replace(`/error${buildErrorSearch(TICKETING_ERROR_TYPE.TOKEN)}`)
        return
      case QUEUE_ROUTE_GUARD_ACTION.TO_UNEXPECTED_ERROR:
        router.replace(`/error${buildErrorSearch(TICKETING_ERROR_TYPE.UNEXPECTED)}`)
        return
      case QUEUE_ROUTE_GUARD_ACTION.NONE:
        return
    }
  }, [
    isQueueStatusError,
    isQueueStatusSuccess,
    onExpireToken,
    queueHttpErrorStatus,
    queueTokenStatus,
    router,
    ticketId,
    tokenId,
  ])
}
