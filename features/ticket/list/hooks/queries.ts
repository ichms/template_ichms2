import { useQuery } from '@tanstack/react-query'
import { ticketListQueryKeys } from '@/features/ticket/list/queryKeys'
import { getTicketList } from '@/features/ticket/list/service'

export const useTicketListQuery = () => {
  return useQuery({
    queryKey: ticketListQueryKeys.list(),
    queryFn: getTicketList,
  })
}
