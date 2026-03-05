import { ReservationCompletePage } from '@/features/ticket/complete/components/Page'

type ReservationCompleteRouteProps = {
  params: Promise<{
    reservationId: string
  }>
}

const ReservationCompleteRoute = async ({ params }: ReservationCompleteRouteProps) => {
  const { reservationId } = await params

  return <ReservationCompletePage reservationId={reservationId} />
}

export default ReservationCompleteRoute
