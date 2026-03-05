import { useQuery } from '@tanstack/react-query'
import { ticketSeatQueryKeys } from '@/features/ticket/seat/queryKeys'
import { getTicketSeats } from '@/features/ticket/seat/service'

interface QueryControl {
  enabled?: boolean
}

export const useTicketSeatsQuery = (ticketId: string, control: QueryControl = {}) => {
  const enabled = control.enabled ?? true

  return useQuery({
    queryKey: ticketSeatQueryKeys.list({ ticketId }),
    queryFn: () => {
      return getTicketSeats(ticketId)
    },
    enabled,
  })
}
