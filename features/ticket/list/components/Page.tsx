import { useRouter } from 'next/navigation'
import { TicketCard } from '@/features/common/component/TicketCard'
import { useTicketListQuery } from '@/features/ticket/list/hooks/queries'

export const TicketListPage = () => {
  const router = useRouter()
  const ticketListQuery = useTicketListQuery()

  return (
    <div className='mx-auto max-w-6xl md:px-6'>
      <div className='flex h-30 flex-col justify-center gap-2'>
        <p className='text-3XL-Bold'>Available Events</p>
        <p>Browse and select an event to book tickets</p>
      </div>

      {ticketListQuery.isPending ? (
        <div className='rounded-2xl border border-neutral-200 bg-white p-6'>
          <p>티켓 목록을 불러오는 중입니다.</p>
        </div>
      ) : null}

      {ticketListQuery.isError ? (
        <div className='rounded-2xl border border-red-200 bg-red-50 p-6'>
          <p>티켓 목록 조회 중 오류가 발생했습니다.</p>
          <button
            className='mt-3 cursor-pointer rounded-lg bg-neutral-900 px-4 py-2 text-white'
            onClick={() => {
              void ticketListQuery.refetch()
            }}
            type='button'
          >
            다시 시도
          </button>
        </div>
      ) : null}

      {ticketListQuery.isSuccess ? (
        <div className='grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
          {ticketListQuery.data.map((ticketInfo) => {
            return (
              <TicketCard
                key={ticketInfo.id}
                onClick={() => {
                  router.push(`/ticket/${ticketInfo.id}`)
                }}
                {...ticketInfo}
              />
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
