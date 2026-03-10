import { useRouter } from 'next/navigation'
import { Button } from '@/packages/ui/component/Button'
import { BlockButton } from '@/packages/ui/component/BlockButton'
import { DefaultInput } from '@/packages/ui/component/DefaultInput'
import { SearchField } from '@/packages/ui/component/SearchField'
import { TicketCard } from '@/features/common/component/TicketCard'
import { useTicketListQuery } from '@/features/ticket/list/hooks/queries'

export const TicketListPage = () => {
  const router = useRouter()
  const ticketListQuery = useTicketListQuery()

  return (
    <div className='mx-auto max-w-6xl md:px-6'>
      <div className='flex flex-col gap-2 py-6'>
        <p className='text-3XL-Bold'>Available Events</p>
        <p>Browse and select an event to book tickets</p>
        <div className='flex gap-2'>
          <Button variant='primary'>Primary</Button>
          <Button variant='outline'>Outline</Button>
        </div>

        {/* AI로 생성한 컴포넌트 예시 */}
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

      {/* BlockButton variants */}
      <div className='flex flex-col gap-4 py-4'>
        <p className='text-bodySm-SB'>Blue</p>
        <div className='flex flex-col gap-2'>
          <BlockButton colorType='blue'>Normal</BlockButton>
          <BlockButton colorType='blue' disabled>
            Disabled
          </BlockButton>
          <BlockButton colorType='blue' selected>
            Selected
          </BlockButton>
        </div>

        <p className='text-bodySm-SB'>Grey</p>
        <div className='flex flex-col gap-2'>
          <BlockButton colorType='grey'>Normal</BlockButton>
          <BlockButton colorType='grey' disabled>
            Disabled
          </BlockButton>
          <BlockButton colorType='grey' selected>
            Selected
          </BlockButton>
        </div>
      </div>
      <br />
      <SearchField placeholder='이벤트 검색' />
    </div>
  )
}
