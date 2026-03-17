import { useMutation, useQueryClient } from '@tanstack/react-query'
import { myQueryKeys } from '@/features/my/queryKeys'
import { cancelReservation } from '@/features/my/service'

export const useCancelReservationMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (reservationId: string) => {
      return cancelReservation(reservationId)
    },
    onSuccess: (reservation) => {
      void queryClient.invalidateQueries({
        queryKey: myQueryKeys.list(),
      })
      void queryClient.invalidateQueries({
        queryKey: myQueryKeys.detail({
          reservationId: reservation.id,
        }),
      })
    },
  })
}
