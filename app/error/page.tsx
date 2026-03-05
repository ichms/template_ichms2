import { TicketingErrorPage } from '@/features/ticket/list/components/ErrorPage'

type ErrorRouteProps = {
  searchParams: Promise<{
    type?: string
    message?: string
  }>
}

const ErrorRoute = async ({ searchParams }: ErrorRouteProps) => {
  const resolvedSearchParams = await searchParams

  return (
    <TicketingErrorPage
      message={resolvedSearchParams.message}
      type={resolvedSearchParams.type ?? null}
    />
  )
}

export default ErrorRoute
