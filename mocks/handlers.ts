import { delay, http, HttpResponse } from 'msw'
import {
  cancelMyReservationById,
  getMyReservationDetailById,
  listMyReservations,
} from '@/features/my/server/mock-store'
import {
  RESERVATION_STATUS,
  type QueueStatus,
  type QueueToken,
  type Reservation,
  type ReservationDetailData,
  type Seat,
  type Ticket,
} from '@/features/ticket/shared/type'

const queueWaitDurationMs = 30_000
const readyTokenDurationMs = 60_000
const waitingTokenDurationMs = 30 * 60_000

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
  unavailableModulo: number,
): Seat[] => {
  return Array.from({ length: rowCount * seatsPerRow }, (_, index) => {
    const rowIndex = Math.floor(index / seatsPerRow)
    const number = (index % seatsPerRow) + 1

    return {
      id: `${ticketId}-${rowIndex + 1}-${number}`,
      row: String.fromCharCode(65 + rowIndex),
      number,
      price: basePrice + rowIncrement * rowIndex,
      isAvailable: index % unavailableModulo !== 0,
    }
  })
}

const seatsByTicketId: Record<string, Seat[]> = {
  '1': createSeats('1', 5, 10, 150_000, 10_000, 4),
  '2': createSeats('2', 4, 10, 120_000, 8_000, 5),
  '3': createSeats('3', 6, 10, 180_000, 12_000, 4),
}

const queueTokens = new Map<string, QueueToken>()
const reservations = new Map<string, Reservation>()

const isObjectRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null
}

const findTicket = (ticketId: string) => {
  return tickets.find((ticket) => ticket.id === ticketId)
}

const createTokenId = () => {
  return `token_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
}

const createReservationId = () => {
  return `reservation_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
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

const createSeedReservation = (params: {
  id: string
  ticketId: string
  seatId: string
  status: Reservation['status']
  createdAt: number
  canceledAt?: number
}) => {
  const seat = seatsByTicketId[params.ticketId]?.find((item) => item.id === params.seatId)

  if (seat === undefined) {
    return
  }

  reservations.set(params.id, {
    id: params.id,
    ticketId: params.ticketId,
    seatId: params.seatId,
    price: seat.price,
    status: params.status,
    expiresAt: params.createdAt + 24 * 60 * 60 * 1_000,
    createdAt: params.createdAt,
    canceledAt: params.canceledAt,
  })

  if (params.status !== RESERVATION_STATUS.CANCELED) {
    setSeatAvailability(params.ticketId, params.seatId, false)
  }
}

const seedReservations = () => {
  const now = Date.now()

  createSeedReservation({
    id: 'reservation_booked_1',
    ticketId: '3',
    seatId: '3-1-2',
    status: RESERVATION_STATUS.BOOKED,
    createdAt: now - 2 * 24 * 60 * 60 * 1_000,
  })
  createSeedReservation({
    id: 'reservation_canceled_1',
    ticketId: '1',
    seatId: '1-1-3',
    status: RESERVATION_STATUS.CANCELED,
    createdAt: now - 14 * 24 * 60 * 60 * 1_000,
    canceledAt: now - 12 * 24 * 60 * 60 * 1_000,
  })
  createSeedReservation({
    id: 'reservation_attended_1',
    ticketId: '2',
    seatId: '2-1-3',
    status: RESERVATION_STATUS.ATTENDED,
    createdAt: now - 30 * 24 * 60 * 60 * 1_000,
  })
}

seedReservations()

const getWaitingTokens = (ticketId: string) => {
  return Array.from(queueTokens.values())
    .filter((token) => token.ticketId === ticketId && token.status === 'waiting')
    .sort((left, right) => left.createdAt - right.createdAt)
}

const isExpiredToken = (token: QueueToken) => {
  return Date.now() > token.expiresAt || token.status === 'expired'
}

export const handlers = [
  http.get('/api/tickets', async () => {
    await delay(250)

    return HttpResponse.json({
      success: true,
      data: tickets,
    })
  }),

  http.get('/api/tickets/:id', async ({ params }) => {
    await delay(200)

    const ticketId = String(params.id ?? '')
    const ticket = findTicket(ticketId)

    if (ticket === undefined) {
      return HttpResponse.json(
        {
          success: false,
          message: '티켓을 찾을 수 없습니다.',
        },
        { status: 404 },
      )
    }

    return HttpResponse.json({
      success: true,
      data: ticket,
    })
  }),

  http.post('/api/tickets/:id/enter', async ({ params }) => {
    await delay(250)

    const ticketId = String(params.id ?? '')
    const ticket = findTicket(ticketId)

    if (ticket === undefined) {
      return HttpResponse.json(
        {
          success: false,
          message: '티켓을 찾을 수 없습니다.',
        },
        { status: 404 },
      )
    }

    const hasQueue = ticketId === '2'
    const waitingCount = hasQueue ? getWaitingTokens(ticketId).length : 0

    const token: QueueToken = {
      id: createTokenId(),
      ticketId,
      status: hasQueue ? 'waiting' : 'ready',
      position: hasQueue ? waitingCount + 1 : 0,
      totalInQueue: hasQueue ? waitingCount + 1 : 0,
      expiresAt: Date.now() + (hasQueue ? waitingTokenDurationMs : readyTokenDurationMs),
      createdAt: Date.now(),
    }

    queueTokens.set(token.id, token)

    return HttpResponse.json({
      success: true,
      data: {
        tokenId: token.id,
        hasQueue,
        expiresAt: token.expiresAt,
      },
    })
  }),

  http.get('/api/queue/:tokenId', async ({ params }) => {
    await delay(150)

    const tokenId = String(params.tokenId ?? '')
    const token = queueTokens.get(tokenId)

    if (token === undefined) {
      return HttpResponse.json(
        {
          success: false,
          message: '유효하지 않은 토큰입니다.',
        },
        { status: 404 },
      )
    }

    if (isExpiredToken(token)) {
      const expiredToken: QueueToken = {
        ...token,
        status: 'expired',
      }
      queueTokens.set(token.id, expiredToken)

      return HttpResponse.json(
        {
          success: false,
          message: '토큰이 만료되었습니다.',
        },
        { status: 410 },
      )
    }

    let nextToken: QueueToken = token
    const elapsedMs = Date.now() - token.createdAt

    if (token.status === 'waiting') {
      const progress = Math.min(100, Math.floor((elapsedMs / queueWaitDurationMs) * 100))

      if (progress >= 100) {
        nextToken = {
          ...token,
          status: 'ready',
          position: 0,
          totalInQueue: 0,
        }

        queueTokens.set(token.id, nextToken)
      }
    }

    if (nextToken.status === 'waiting') {
      const waitingTokens = getWaitingTokens(nextToken.ticketId)
      const queueIndex = waitingTokens.findIndex(
        (waitingToken) => waitingToken.id === nextToken.id,
      )
      const position = queueIndex >= 0 ? queueIndex + 1 : nextToken.position

      nextToken = {
        ...nextToken,
        position,
        totalInQueue: waitingTokens.length,
      }

      queueTokens.set(nextToken.id, nextToken)
    }

    const queueElapsedMs = Date.now() - nextToken.createdAt
    const progress =
      nextToken.status === 'waiting'
        ? Math.min(100, Math.floor((queueElapsedMs / queueWaitDurationMs) * 100))
        : 100

    const queueStatus: QueueStatus = {
      position: nextToken.status === 'waiting' ? nextToken.position : 0,
      totalInQueue: nextToken.status === 'waiting' ? nextToken.totalInQueue : 0,
      progress,
      estimatedWaitTime:
        nextToken.status === 'waiting'
          ? Math.max(0, queueWaitDurationMs - queueElapsedMs)
          : 0,
    }

    return HttpResponse.json({
      success: true,
      data: {
        token: nextToken,
        queueStatus,
      },
    })
  }),

  http.get('/api/tickets/:id/seats', async ({ params }) => {
    await delay(200)

    const ticketId = String(params.id ?? '')
    const ticket = findTicket(ticketId)

    if (ticket === undefined) {
      return HttpResponse.json(
        {
          success: false,
          message: '티켓을 찾을 수 없습니다.',
        },
        { status: 404 },
      )
    }

    return HttpResponse.json({
      success: true,
      data: seatsByTicketId[ticketId] ?? [],
    })
  }),

  http.post('/api/reservations', async ({ request }) => {
    await delay(250)

    const payload = (await request.json()) as unknown

    if (!isObjectRecord(payload)) {
      return HttpResponse.json(
        {
          success: false,
          message: '요청 형식이 올바르지 않습니다.',
        },
        { status: 400 },
      )
    }

    const tokenId = typeof payload['tokenId'] === 'string' ? payload['tokenId'] : ''
    const seatId = typeof payload['seatId'] === 'string' ? payload['seatId'] : ''

    if (tokenId.length === 0 || seatId.length === 0) {
      return HttpResponse.json(
        {
          success: false,
          message: '요청 형식이 올바르지 않습니다.',
        },
        { status: 400 },
      )
    }

    const token = queueTokens.get(tokenId)

    if (token === undefined) {
      return HttpResponse.json(
        {
          success: false,
          message: '유효하지 않은 토큰입니다.',
        },
        { status: 404 },
      )
    }

    if (token.status === 'waiting') {
      return HttpResponse.json(
        {
          success: false,
          message: '아직 대기열에 있습니다.',
        },
        { status: 400 },
      )
    }

    if (isExpiredToken(token)) {
      const expiredToken: QueueToken = {
        ...token,
        status: 'expired',
      }
      queueTokens.set(token.id, expiredToken)

      return HttpResponse.json(
        {
          success: false,
          message: '토큰이 만료되었습니다.',
        },
        { status: 410 },
      )
    }

    const seats = seatsByTicketId[token.ticketId] ?? []
    const seatIndex = seats.findIndex((seat) => seat.id === seatId)

    if (seatIndex < 0) {
      return HttpResponse.json(
        {
          success: false,
          message: '좌석을 찾을 수 없습니다.',
        },
        { status: 404 },
      )
    }

    const targetSeat = seats[seatIndex]

    if (!targetSeat.isAvailable) {
      return HttpResponse.json(
        {
          success: false,
          message: '이미 예약된 좌석입니다.',
        },
        { status: 400 },
      )
    }

    const updatedSeat: Seat = {
      ...targetSeat,
      isAvailable: false,
    }

    seatsByTicketId[token.ticketId] = seats.map((seat) => {
      return seat.id === updatedSeat.id ? updatedSeat : seat
    })

    const reservation: Reservation = {
      id: createReservationId(),
      ticketId: token.ticketId,
      seatId: updatedSeat.id,
      price: updatedSeat.price,
      status: RESERVATION_STATUS.BOOKED,
      expiresAt: Date.now() + 24 * 60 * 60 * 1_000,
      createdAt: Date.now(),
    }

    reservations.set(reservation.id, reservation)

    const expiredToken: QueueToken = {
      ...token,
      status: 'expired',
    }
    queueTokens.set(token.id, expiredToken)

    return HttpResponse.json({
      success: true,
      data: reservation,
    })
  }),

  http.get('/api/my/reservations', async () => {
    await delay(200)

    return HttpResponse.json({
      success: true,
      data: listMyReservations(),
    })
  }),

  http.get('/api/my/reservations/:id', async ({ params }) => {
    await delay(200)

    const reservationId = String(params.id ?? '')
    const reservationDetail = getMyReservationDetailById(reservationId)

    if (reservationDetail === null) {
      return HttpResponse.json(
        {
          success: false,
          message: '예약을 찾을 수 없습니다.',
        },
        { status: 404 },
      )
    }

    return HttpResponse.json({
      success: true,
      data: reservationDetail,
    })
  }),

  http.post('/api/my/reservations/:id/cancel', async ({ params }) => {
    await delay(200)

    const reservationId = String(params.id ?? '')
    const result = cancelMyReservationById(reservationId)

    if (result.kind === 'not_found') {
      return HttpResponse.json(
        {
          success: false,
          message: '예약을 찾을 수 없습니다.',
        },
        { status: 404 },
      )
    }

    if (result.kind === 'not_cancelable') {
      return HttpResponse.json(
        {
          success: false,
          message: '예매 취소가 불가능한 상태입니다.',
        },
        { status: 400 },
      )
    }

    return HttpResponse.json({
      success: true,
      data: result.reservation,
    })
  }),

  http.post('/api/reservations/:id/cancel', async ({ params }) => {
    await delay(200)

    const reservationId = String(params.id ?? '')
    const reservation = reservations.get(reservationId)

    if (reservation === undefined) {
      return HttpResponse.json(
        {
          success: false,
          message: '예약을 찾을 수 없습니다.',
        },
        { status: 404 },
      )
    }

    if (reservation.status !== RESERVATION_STATUS.BOOKED) {
      return HttpResponse.json(
        {
          success: false,
          message: '예매 취소가 불가능한 상태입니다.',
        },
        { status: 400 },
      )
    }

    const canceledReservation: Reservation = {
      ...reservation,
      status: RESERVATION_STATUS.CANCELED,
      canceledAt: Date.now(),
    }

    reservations.set(reservationId, canceledReservation)
    setSeatAvailability(reservation.ticketId, reservation.seatId, true)

    return HttpResponse.json({
      success: true,
      data: canceledReservation,
    })
  }),

  http.get('/api/reservations/:id', async ({ params }) => {
    await delay(200)

    const reservationId = String(params.id ?? '')
    const reservation = reservations.get(reservationId)

    if (reservation === undefined) {
      return HttpResponse.json(
        {
          success: false,
          message: '예약을 찾을 수 없습니다.',
        },
        { status: 404 },
      )
    }

    const ticket = findTicket(reservation.ticketId)
    const seat = seatsByTicketId[reservation.ticketId]?.find(
      (item) => item.id === reservation.seatId,
    )

    if (ticket === undefined || seat === undefined) {
      return HttpResponse.json(
        {
          success: false,
          message: '예약을 찾을 수 없습니다.',
        },
        { status: 404 },
      )
    }

    const data: ReservationDetailData = {
      reservation,
      ticket,
      seat,
    }

    return HttpResponse.json({
      success: true,
      data,
    })
  }),
]
