import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  QUEUE_TOKEN_STATUS,
  TICKETING_ERROR_TYPE,
  type QueueTokenStatus,
} from '@/features/ticket/shared/type'
import { buildErrorSearch } from '@/features/ticket/shared/utils'
import {
  SEAT_ROUTE_GUARD_ACTION,
  type SeatRouteGuardDecision,
} from '@/features/ticket/seat/type'

interface UseSeatRouteGuardParams {
  ticketId: string
  tokenId: string | null
  isQueueStatusSuccess: boolean
  isQueueStatusError: boolean
  queueTokenStatus: QueueTokenStatus | undefined
  queueHttpErrorStatus: number | null
  onExpireToken: () => void
}

export const useSeatRouteGuard = ({
  ticketId,
  tokenId,
  isQueueStatusSuccess,
  isQueueStatusError,
  queueTokenStatus,
  queueHttpErrorStatus,
  onExpireToken,
}: UseSeatRouteGuardParams) => {
  const router = useRouter()

  useEffect(() => {
    const decision = decideSeatRouteGuardAction({
      tokenId,
      isQueueStatusSuccess,
      isQueueStatusError,
      queueTokenStatus,
      queueHttpErrorStatus,
    })

    switch (decision.action) {
      case SEAT_ROUTE_GUARD_ACTION.TO_DETAIL:
        router.replace(`/ticket/${ticketId}`)
        return
      case SEAT_ROUTE_GUARD_ACTION.TO_QUEUE:
        router.replace(`/ticket/${ticketId}/queue`)
        return
      case SEAT_ROUTE_GUARD_ACTION.TO_TOKEN_ERROR:
        onExpireToken()
        router.replace(`/error${buildErrorSearch(TICKETING_ERROR_TYPE.TOKEN)}`)
        return
      case SEAT_ROUTE_GUARD_ACTION.TO_UNEXPECTED_ERROR:
        router.replace(`/error${buildErrorSearch(TICKETING_ERROR_TYPE.UNEXPECTED)}`)
        return
      case SEAT_ROUTE_GUARD_ACTION.NONE:
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

interface DecideSeatRouteGuardActionParams {
  tokenId: string | null
  isQueueStatusSuccess: boolean
  isQueueStatusError: boolean
  queueTokenStatus: QueueTokenStatus | undefined
  queueHttpErrorStatus: number | null
}

const decideSeatRouteGuardAction = ({
  tokenId,
  isQueueStatusSuccess,
  isQueueStatusError,
  queueTokenStatus,
  queueHttpErrorStatus,
}: DecideSeatRouteGuardActionParams): SeatRouteGuardDecision => {
  if (tokenId === null) {
    if (!isQueueStatusSuccess && !isQueueStatusError) {
      return {
        action: SEAT_ROUTE_GUARD_ACTION.TO_DETAIL,
      }
    }

    return {
      action: SEAT_ROUTE_GUARD_ACTION.NONE,
    }
  }

  if (isQueueStatusSuccess) {
    if (queueTokenStatus === QUEUE_TOKEN_STATUS.WAITING) {
      return {
        action: SEAT_ROUTE_GUARD_ACTION.TO_QUEUE,
      }
    }

    if (queueTokenStatus === QUEUE_TOKEN_STATUS.EXPIRED) {
      return {
        action: SEAT_ROUTE_GUARD_ACTION.TO_TOKEN_ERROR,
      }
    }

    return {
      action: SEAT_ROUTE_GUARD_ACTION.NONE,
    }
  }

  if (!isQueueStatusError) {
    return {
      action: SEAT_ROUTE_GUARD_ACTION.NONE,
    }
  }

  if (queueHttpErrorStatus === 404) {
    return {
      action: SEAT_ROUTE_GUARD_ACTION.TO_TOKEN_ERROR,
    }
  }

  return {
    action: SEAT_ROUTE_GUARD_ACTION.TO_UNEXPECTED_ERROR,
  }
}
