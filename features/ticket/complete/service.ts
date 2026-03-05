import { httpClient } from '@/packages/http/client'
import type { ReservationDetailData } from '@/features/ticket/shared/type'

export const getReservationDetail = async (
  reservationId: string,
): Promise<ReservationDetailData> => {
  const response = await httpClient.get<ReservationDetailData>(
    `/api/reservations/${reservationId}`,
  )
  return response.data
}
