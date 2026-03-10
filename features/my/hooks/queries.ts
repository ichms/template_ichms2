import { useQuery } from '@tanstack/react-query'
import { myQueryKeys } from '@/features/my/queryKeys'
import { getMyReservationDetail, getMyReservationList } from '@/features/my/service'

interface QueryControl {
  enabled?: boolean
}

export const useMyReservationListQuery = () => {
  return useQuery({
    queryKey: myQueryKeys.list(),
    queryFn: getMyReservationList,
  })
}

export const useMyReservationDetailQuery = (
  reservationId: string | null,
  control: QueryControl = {},
) => {
  const enabled = control.enabled ?? true

  return useQuery({
    queryKey: myQueryKeys.detail({ reservationId: reservationId ?? '' }),
    queryFn: () => {
      if (reservationId === null) {
        throw new Error('예약 정보가 없습니다.')
      }

      return getMyReservationDetail(reservationId)
    },
    enabled: enabled && reservationId !== null,
  })
}
