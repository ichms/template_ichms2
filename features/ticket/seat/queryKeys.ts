export const ticketSeatQueryKeys = {
  all: ['ticket', 'seat'] as const,
  lists: () => {
    return [...ticketSeatQueryKeys.all, 'lists'] as const
  },
  list: (params: { ticketId: string }) => {
    return [...ticketSeatQueryKeys.lists(), 'list', params] as const
  },
}
