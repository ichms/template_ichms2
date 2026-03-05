export const ticketDetailQueryKeys = {
  all: ['ticket', 'detail'] as const,
  details: () => {
    return [...ticketDetailQueryKeys.all, 'details'] as const
  },
  detail: (params: { ticketId: string }) => {
    return [...ticketDetailQueryKeys.details(), 'detail', params] as const
  },
}
