import { useMutation } from '@tanstack/react-query'
import { enterTicket } from '@/features/ticket/detail/service'

export const useEnterTicketMutation = () => {
  return useMutation({
    mutationFn: (ticketId: string) => {
      return enterTicket(ticketId)
    },
  })
}
