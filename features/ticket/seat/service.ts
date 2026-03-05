import { httpClient } from '@/packages/http/client'
import type {
  CreateReservationRequest,
  Reservation,
  Seat,
} from '@/features/ticket/shared/type'

export const getTicketSeats = async (ticketId: string): Promise<Seat[]> => {
  const response = await httpClient.get<Seat[]>(`/api/tickets/${ticketId}/seats`)
  return response.data
}

export const createReservation = async (
  request: CreateReservationRequest,
): Promise<Reservation> => {
  const response = await httpClient.post<CreateReservationRequest, Reservation>(
    '/api/reservations',
    request,
  )
  return response.data
}
