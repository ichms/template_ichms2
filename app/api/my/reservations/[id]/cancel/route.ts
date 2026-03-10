import { NextResponse } from 'next/server'
import { type Reservation } from '@/features/my/type'
import { cancelMyReservationById } from '@/features/my/server/mock-store'
import { createProxyRouteHandler, type ProxyRouteContext } from '@/packages/http/proxy'

const fallbackCancelReservation = async (
  _request: Request,
  context: ProxyRouteContext<{ id: string }>,
) => {
  const { id } = await context.params
  const result = cancelMyReservationById(id)

  if (result.kind === 'not_found') {
    return NextResponse.json(
      {
        success: false,
        message: '예약을 찾을 수 없습니다.',
      },
      { status: 404 },
    )
  }

  if (result.kind === 'not_cancelable') {
    return NextResponse.json(
      {
        success: false,
        message: '예매 취소가 불가능한 상태입니다.',
      },
      { status: 400 },
    )
  }

  return NextResponse.json({
    success: true,
    data: result.reservation satisfies Reservation,
  })
}

export const POST = createProxyRouteHandler({
  buildPath: ({ id }) => `/api/my/reservations/${id}/cancel`,
  fallback: fallbackCancelReservation,
})
