import { NextResponse } from 'next/server'
import { getMyReservationDetailById } from '@/features/my/server/mock-store'
import { createProxyRouteHandler, type ProxyRouteContext } from '@/packages/http/proxy'

const fallbackGetReservationDetail = async (
  _request: Request,
  context: ProxyRouteContext<{ id: string }>,
) => {
  const { id } = await context.params
  const reservationDetail = getMyReservationDetailById(id)

  if (reservationDetail === null) {
    return NextResponse.json(
      {
        success: false,
        message: '예약을 찾을 수 없습니다.',
      },
      { status: 404 },
    )
  }

  return NextResponse.json({
    success: true,
    data: reservationDetail,
  })
}

export const GET = createProxyRouteHandler({
  buildPath: ({ id }) => `/api/my/reservations/${id}`,
  fallback: fallbackGetReservationDetail,
})
