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

export type MyReservationListItem = {
  reservation: Reservation
  ticket: Ticket
}

export const RESERVATION_STATUS_LABEL: Record<ReservationStatus, string> = {
  [RESERVATION_STATUS.BOOKED]: '예매완료',
  [RESERVATION_STATUS.CANCELED]: '예매취소',
  [RESERVATION_STATUS.ATTENDED]: '관람',
}

export const RESERVATION_STATUS_STYLES: Record<ReservationStatus, string> = {
  [RESERVATION_STATUS.BOOKED]:
    'border-emerald-200 bg-emerald-50 text-emerald-700',
  [RESERVATION_STATUS.CANCELED]:
    'border-red-200 bg-red-50 text-red-700',
  [RESERVATION_STATUS.ATTENDED]:
    'border-neutral-300 bg-neutral-100 text-neutral-700',
}
