import { QUEUE_TOKEN_STATUS, type QueueTokenStatus } from '@/features/ticket/shared/type'

export const QUEUE_ROUTE_GUARD_ACTION = {
  NONE: 'none',
  TO_DETAIL: 'toDetail',
  TO_SEAT: 'toSeat',
  TO_TOKEN_ERROR: 'toTokenError',
  TO_UNEXPECTED_ERROR: 'toUnexpectedError',
} as const

interface QueueRouteGuardDecision {
  action: (typeof QUEUE_ROUTE_GUARD_ACTION)[keyof typeof QUEUE_ROUTE_GUARD_ACTION]
}

interface DecideQueueRouteGuardActionParams {
  tokenId: string | null
  isQueueStatusSuccess: boolean
  isQueueStatusError: boolean
  queueTokenStatus: QueueTokenStatus | undefined
  queueHttpErrorStatus: number | null
}

export const decideQueueRouteGuardAction = ({
  tokenId,
  isQueueStatusSuccess,
  isQueueStatusError,
  queueTokenStatus,
  queueHttpErrorStatus,
}: DecideQueueRouteGuardActionParams): QueueRouteGuardDecision => {
  if (tokenId === null) {
    if (!isQueueStatusSuccess && !isQueueStatusError) {
      return {
        action: QUEUE_ROUTE_GUARD_ACTION.TO_DETAIL,
      }
    }

    return {
      action: QUEUE_ROUTE_GUARD_ACTION.NONE,
    }
  }

  if (isQueueStatusSuccess) {
    if (queueTokenStatus === QUEUE_TOKEN_STATUS.READY) {
      return {
        action: QUEUE_ROUTE_GUARD_ACTION.TO_SEAT,
      }
    }

    if (queueTokenStatus === QUEUE_TOKEN_STATUS.EXPIRED) {
      return {
        action: QUEUE_ROUTE_GUARD_ACTION.TO_TOKEN_ERROR,
      }
    }

    return {
      action: QUEUE_ROUTE_GUARD_ACTION.NONE,
    }
  }

  if (!isQueueStatusError) {
    return {
      action: QUEUE_ROUTE_GUARD_ACTION.NONE,
    }
  }

  if (queueHttpErrorStatus === 404) {
    return {
      action: QUEUE_ROUTE_GUARD_ACTION.TO_TOKEN_ERROR,
    }
  }

  return {
    action: QUEUE_ROUTE_GUARD_ACTION.TO_UNEXPECTED_ERROR,
  }
}
