import { useQuery } from '@tanstack/react-query'
import { ticketDetailQueryKeys } from '@/features/ticket/detail/queryKeys'
import { getTicketDetail } from '@/features/ticket/detail/service'

export const useTicketDetailQuery = (ticketId: string) => {
  return useQuery({
    queryKey: ticketDetailQueryKeys.detail({ ticketId }),
    queryFn: () => {
      return getTicketDetail(ticketId)
    },
  })
}
