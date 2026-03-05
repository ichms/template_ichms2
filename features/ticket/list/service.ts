import { httpClient } from '@/packages/http/client'
import type { Ticket } from '@/features/ticket/shared/type'

export const getTicketList = async (): Promise<Ticket[]> => {
  const response = await httpClient.get<Ticket[]>('/api/tickets')
  return response.data
}
