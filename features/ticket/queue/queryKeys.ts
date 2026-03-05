export const ticketQueueQueryKeys = {
  all: ['ticket', 'queue'] as const,
  details: () => {
    return [...ticketQueueQueryKeys.all, 'details'] as const
  },
  detail: (params: { tokenId: string }) => {
    return [...ticketQueueQueryKeys.details(), 'detail', params] as const
  },
}
