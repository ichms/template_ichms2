import { NextResponse } from 'next/server'
import { listMyReservations } from '@/features/my/server/mock-store'
import { createProxyRouteHandler } from '@/packages/http/proxy'

const fallbackGetReservations = async () => {
  return NextResponse.json({
    success: true,
    data: listMyReservations(),
  })
}

export const GET = createProxyRouteHandler({
  buildPath: () => '/api/my/reservations',
  fallback: fallbackGetReservations,
})
