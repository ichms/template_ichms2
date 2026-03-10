import {
  RESERVATION_STATUS,
  type MyReservationListItem,
  type Reservation,
  type ReservationDetailData,
  type Seat,
  type Ticket,
} from '@/features/my/type'

const tickets: Ticket[] = [
  {
    id: '1',
    title: 'BTS 월드투어 2026',
    description: '글로벌 투어 공연으로 빠른 매진이 예상됩니다.',
    image: 'https://picsum.photos/800/450?random=11',
    price: 150_000,
    totalSeats: 50,
    availableSeats: 35,
    eventDate: '2026-06-15',
    venue: '올림픽공원 체조경기장',
  },
  {
    id: '2',
    title: 'IU 콘서트 2026 (대기열)',
    description: '대기열이 필수로 발생하는 인기 공연입니다.',
    image: 'https://picsum.photos/800/450?random=12',
    price: 120_000,
    totalSeats: 40,
    availableSeats: 28,
    eventDate: '2026-05-20',
    venue: '잠실실내체육관',
  },
  {
    id: '3',
    title: 'BLACKPINK 월드투어 2026',
    description: '월드투어 서울 공연 좌석 예매 페이지입니다.',
    image: 'https://picsum.photos/800/450?random=13',
    price: 180_000,
    totalSeats: 60,
    availableSeats: 43,
    eventDate: '2026-08-03',
    venue: '고척스카이돔',
  },
]

const createSeats = (
  ticketId: string,
  rowCount: number,
  seatsPerRow: number,
  basePrice: number,
  rowIncrement: number,
) => {
  return Array.from({ length: rowCount * seatsPerRow }, (_, index) => {
    const rowIndex = Math.floor(index / seatsPerRow)

    return {
      id: `${ticketId}-${rowIndex + 1}-${(index % seatsPerRow) + 1}`,
      row: String.fromCharCode(65 + rowIndex),
      number: (index % seatsPerRow) + 1,
      price: basePrice + rowIncrement * rowIndex,
      isAvailable: true,
    } satisfies Seat
  })
}

const seatsByTicketId: Record<string, Seat[]> = {
  '1': createSeats('1', 5, 10, 150_000, 10_000),
  '2': createSeats('2', 4, 10, 120_000, 8_000),
  '3': createSeats('3', 6, 10, 180_000, 12_000),
}

const reservations = new Map<string, Reservation>()

const findTicket = (ticketId: string) => {
  return tickets.find((ticket) => ticket.id === ticketId)
}

const setSeatAvailability = (ticketId: string, seatId: string, isAvailable: boolean) => {
  const seats = seatsByTicketId[ticketId] ?? []

  seatsByTicketId[ticketId] = seats.map((seat) => {
    if (seat.id !== seatId) {
      return seat
    }

    return {
      ...seat,
      isAvailable,
    }
  })
}

const seedReservations = () => {
  if (reservations.size > 0) {
    return
  }

  const now = Date.now()
  const seededReservations: Reservation[] = [
    {
      id: 'reservation_booked_1',
      ticketId: '3',
      seatId: '3-1-2',
      price: 180_000,
      status: RESERVATION_STATUS.BOOKED,
      expiresAt: now + 24 * 60 * 60 * 1_000,
      createdAt: now - 2 * 24 * 60 * 60 * 1_000,
    },
    {
      id: 'reservation_canceled_1',
      ticketId: '1',
      seatId: '1-1-3',
      price: 150_000,
      status: RESERVATION_STATUS.CANCELED,
      expiresAt: now + 24 * 60 * 60 * 1_000,
      createdAt: now - 14 * 24 * 60 * 60 * 1_000,
      canceledAt: now - 12 * 24 * 60 * 60 * 1_000,
    },
    {
      id: 'reservation_attended_1',
      ticketId: '2',
      seatId: '2-1-3',
      price: 120_000,
      status: RESERVATION_STATUS.ATTENDED,
      expiresAt: now + 24 * 60 * 60 * 1_000,
      createdAt: now - 30 * 24 * 60 * 60 * 1_000,
    },
  ]

  seededReservations.forEach((reservation) => {
    reservations.set(reservation.id, reservation)

    if (reservation.status !== RESERVATION_STATUS.CANCELED) {
      setSeatAvailability(reservation.ticketId, reservation.seatId, false)
    }
  })
}

seedReservations()

export const listMyReservations = (): MyReservationListItem[] => {
  return Array.from(reservations.values())
    .sort((left, right) => right.createdAt - left.createdAt)
    .flatMap((reservation) => {
      const ticket = findTicket(reservation.ticketId)

      if (ticket === undefined) {
        return []
      }

      return [{ reservation, ticket }]
    })
}

export const getMyReservationDetailById = (
  reservationId: string,
): ReservationDetailData | null => {
  const reservation = reservations.get(reservationId)

  if (reservation === undefined) {
    return null
  }

  const ticket = findTicket(reservation.ticketId)
  const seat = seatsByTicketId[reservation.ticketId]?.find((item) => item.id === reservation.seatId)

  if (ticket === undefined || seat === undefined) {
    return null
  }

  return {
    reservation,
    ticket,
    seat,
  }
}

export const cancelMyReservationById = (
  reservationId: string,
):
  | { kind: 'not_found' }
  | { kind: 'not_cancelable'; reservation: Reservation }
  | { kind: 'canceled'; reservation: Reservation } => {
  const reservation = reservations.get(reservationId)

  if (reservation === undefined) {
    return { kind: 'not_found' }
  }

  if (reservation.status !== RESERVATION_STATUS.BOOKED) {
    return {
      kind: 'not_cancelable',
      reservation,
    }
  }

  const canceledReservation: Reservation = {
    ...reservation,
    status: RESERVATION_STATUS.CANCELED,
    canceledAt: Date.now(),
  }

  reservations.set(reservationId, canceledReservation)
  setSeatAvailability(reservation.ticketId, reservation.seatId, true)

  return {
    kind: 'canceled',
    reservation: canceledReservation,
  }
}
