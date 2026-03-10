import { httpClient } from '@/packages/http/client'
import type {
  MyReservationListItem,
  Reservation,
  ReservationDetailData,
} from '@/features/my/type'

export const getMyReservationList = async (): Promise<MyReservationListItem[]> => {
  const response = await httpClient.get<MyReservationListItem[]>('/api/my/reservations')
  return response.data
}

export const getMyReservationDetail = async (
  reservationId: string,
): Promise<ReservationDetailData> => {
  const response = await httpClient.get<ReservationDetailData>(
    `/api/reservations/${reservationId}`,
  )
  return response.data
}

export const cancelReservation = async (reservationId: string): Promise<Reservation> => {
  const response = await httpClient.post<Record<string, never>, Reservation>(
    `/api/reservations/${reservationId}/cancel`,
    {},
  )
  return response.data
}
