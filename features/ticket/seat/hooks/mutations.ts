import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ticketCompleteQueryKeys } from '@/features/ticket/complete/queryKeys'
import { ticketSeatQueryKeys } from '@/features/ticket/seat/queryKeys'
import { createReservation } from '@/features/ticket/seat/service'
import type { CreateReservationRequest } from '@/features/ticket/shared/type'

export const useCreateReservationMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: CreateReservationRequest) => {
      return createReservation(request)
    },
    onSuccess: (reservation) => {
      void queryClient.invalidateQueries({
        queryKey: ticketSeatQueryKeys.lists(),
      })
      void queryClient.invalidateQueries({
        queryKey: ticketCompleteQueryKeys.detail({
          reservationId: reservation.id,
        }),
      })
    },
  })
}
