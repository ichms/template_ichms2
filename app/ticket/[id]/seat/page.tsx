'use client'
import { SeatSelectionPage } from '@/features/ticket/seat/components/Page'

type SeatSelectionRouteProps = {
  params: Promise<{
    id: string
  }>
}

const SeatSelectionRoute = async ({ params }: SeatSelectionRouteProps) => {
  const { id } = await params

  return <SeatSelectionPage ticketId={id} />
}

export default SeatSelectionRoute
