export const QUEUE_TOKEN_STATUS = {
  WAITING: 'waiting',
  READY: 'ready',
  EXPIRED: 'expired',
} as const
export type QueueTokenStatus =
  (typeof QUEUE_TOKEN_STATUS)[keyof typeof QUEUE_TOKEN_STATUS]

export const RESERVATION_STATUS = {
  BOOKED: 'booked',
  CANCELED: 'canceled',
  ATTENDED: 'attended',
} as const
export type ReservationStatus =
  (typeof RESERVATION_STATUS)[keyof typeof RESERVATION_STATUS]

export type Ticket = {
  id: string
  title: string
  description: string
  image: string
  price: number
  totalSeats: number
  availableSeats: number
  eventDate: string
  venue: string
}

export type Seat = {
  id: string
  row: string
  number: number
  price: number
  isAvailable: boolean
}

export type QueueToken = {
  id: string
  ticketId: string
  status: QueueTokenStatus
  position: number
  totalInQueue: number
  expiresAt: number
  createdAt: number
}

export type QueueStatus = {
  position: number
  totalInQueue: number
  progress: number
  estimatedWaitTime: number
}

export type QueueStatusData = {
  token: QueueToken
  queueStatus: QueueStatus
}

export type EntryTokenData = {
  tokenId: string
  hasQueue: boolean
  expiresAt: number
}

export type CreateReservationRequest = {
  tokenId: string
  seatId: string
}

export type Reservation = {
  id: string
  ticketId: string
  seatId: string
  price: number
  status: ReservationStatus
  expiresAt: number
  createdAt: number
  canceledAt?: number
}

export type ReservationDetailData = {
  reservation: Reservation
  ticket: Ticket
  seat: Seat
}

export const TICKETING_ERROR_TYPE = {
  TOKEN: 'token',
  NOT_FOUND: 'notfound',
  UNEXPECTED: 'unexpected',
  BAD_REQUEST: 'badrequest',
  INVALID_TICKET: 'invalidticket',
  EMPTY_TOKEN: 'emptytoken',
} as const

export type TicketingErrorType =
  (typeof TICKETING_ERROR_TYPE)[keyof typeof TICKETING_ERROR_TYPE]
