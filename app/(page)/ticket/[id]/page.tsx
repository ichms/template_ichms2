import { DetailPage } from '@/features/ticket/detail/components/Page'

type TicketDetailRouteProps = {
  params: Promise<{
    id: string
  }>
}

const TicketDetailRoute = async ({ params }: TicketDetailRouteProps) => {
  const { id } = await params

  return <DetailPage ticketId={id} />
}

export default TicketDetailRoute
