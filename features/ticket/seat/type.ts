export const SEAT_ROUTE_GUARD_ACTION = {
  NONE: 'none',
  TO_DETAIL: 'toDetail',
  TO_QUEUE: 'toQueue',
  TO_TOKEN_ERROR: 'toTokenError',
  TO_UNEXPECTED_ERROR: 'toUnexpectedError',
} as const

export type SeatRouteGuardDecision = {
  action: (typeof SEAT_ROUTE_GUARD_ACTION)[keyof typeof SEAT_ROUTE_GUARD_ACTION]
}
