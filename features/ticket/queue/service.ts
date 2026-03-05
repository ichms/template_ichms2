import { httpClient } from '@/packages/http/client'
import type { QueueStatusData } from '@/features/ticket/shared/type'

export const getQueueStatus = async (tokenId: string): Promise<QueueStatusData> => {
  const response = await httpClient.get<QueueStatusData>(`/api/queue/${tokenId}`)
  return response.data
}
