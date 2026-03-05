import { httpClient } from '@/packages/http/client'
import type { EntryTokenData, Ticket } from '@/features/ticket/shared/type'

export const getTicketDetail = async (ticketId: string): Promise<Ticket> => {
  const response = await httpClient.get<Ticket>(`/api/tickets/${ticketId}`)
  return response.data
}

export const enterTicket = async (ticketId: string): Promise<EntryTokenData> => {
  const response = await httpClient.post<Record<string, never>, EntryTokenData>(
    `/api/tickets/${ticketId}/enter`,
    {},
  )
  return response.data
}
