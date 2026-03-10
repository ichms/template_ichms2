export const myQueryKeys = {
  all: ['my'] as const,
  lists: () => {
    return [...myQueryKeys.all, 'lists'] as const
  },
  list: () => {
    return [...myQueryKeys.lists(), 'list'] as const
  },
  details: () => {
    return [...myQueryKeys.all, 'details'] as const
  },
  detail: (params: { reservationId: string }) => {
    return [...myQueryKeys.details(), 'detail', params] as const
  },
}
