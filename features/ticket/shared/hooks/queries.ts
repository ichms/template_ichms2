import { useQuery } from '@tanstack/react-query'
import { ticketQueueQueryKeys } from '@/features/ticket/queue/queryKeys'
import { getQueueStatus } from '@/features/ticket/queue/service'

interface QueueQueryControl {
  enabled?: boolean
  polling?: boolean
}

export const useQueueStatusQuery = (
  tokenId: string | null,
  control: QueueQueryControl = {},
) => {
  const enabled = control.enabled ?? true
  const polling = control.polling ?? false

  return useQuery({
    queryKey: ticketQueueQueryKeys.detail({ tokenId: tokenId ?? '' }),
    queryFn: () => {
      if (tokenId === null) {
        throw new Error('입장 토큰이 없습니다.')
      }

      return getQueueStatus(tokenId)
    },
    enabled: enabled && tokenId !== null,
    refetchInterval: polling ? 800 : false,
  })
}
