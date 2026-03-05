import { QueuePage } from '@/features/ticket/queue/components/Page'

type QueueRouteProps = {
  params: Promise<{
    id: string
  }>
}

const QueueRoute = async ({ params }: QueueRouteProps) => {
  const { id } = await params

  return <QueuePage ticketId={id} />
}

export default QueueRoute
