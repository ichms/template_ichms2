export const ticketCompleteQueryKeys = {
  all: ['ticket', 'complete'] as const,
  details: () => {
    return [...ticketCompleteQueryKeys.all, 'details'] as const
  },
  detail: (params: { reservationId: string }) => {
    return [...ticketCompleteQueryKeys.details(), 'detail', params] as const
  },
}
