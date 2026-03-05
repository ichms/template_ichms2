export const ticketListQueryKeys = {
  all: ['ticket', 'list'] as const,
  lists: () => {
    return [...ticketListQueryKeys.all, 'lists'] as const
  },
  list: () => {
    return [...ticketListQueryKeys.lists(), 'list'] as const
  },
}
