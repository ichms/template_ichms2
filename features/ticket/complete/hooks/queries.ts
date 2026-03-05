import { useQuery } from '@tanstack/react-query'
import { ticketCompleteQueryKeys } from '@/features/ticket/complete/queryKeys'
import { getReservationDetail } from '@/features/ticket/complete/service'

interface QueryControl {
  enabled?: boolean
}

export const useReservationDetailQuery = (
  reservationId: string,
  control: QueryControl = {},
) => {
  const enabled = control.enabled ?? true

  return useQuery({
    queryKey: ticketCompleteQueryKeys.detail({ reservationId }),
    queryFn: () => {
      return getReservationDetail(reservationId)
    },
    enabled,
  })
}
