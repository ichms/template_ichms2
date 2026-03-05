import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ConfirmButton } from '@/features/common/component/ConfirmButton'
import { ImageWithSkeleton } from '@/features/common/component/ImageWithSkeleton'
import { PreviousButton } from '@/features/common/component/PreviousButton'
import { useTicketStore } from '@/features/common/store/useTicketStore'
import { useEnterTicketMutation } from '@/features/ticket/detail/hooks/mutations'
import { useTicketDetailQuery } from '@/features/ticket/detail/hooks/queries'
import { TICKETING_ERROR_TYPE } from '@/features/ticket/shared/type'
import { buildErrorSearch, formatCurrency } from '@/features/ticket/shared/utils'
import { HttpError } from '@/packages/http/client'

interface DetailPageProps {
  ticketId: string
}

export const DetailPage = ({ ticketId }: DetailPageProps) => {
  const ticketDetailQuery = useTicketDetailQuery(ticketId)
  const enterTicketMutation = useEnterTicketMutation()
  const setTokenId = useTicketStore((state) => state.setTokenId)
  const router = useRouter()

  const handleConfirm = useCallback(async () => {
    try {
      if (ticketId.length === 0) {
        router.replace(`/error${buildErrorSearch(TICKETING_ERROR_TYPE.EMPTY_TOKEN)}`)
        return
      }

      const tokenData = await enterTicketMutation.mutateAsync(ticketId)
      setTokenId(tokenData.tokenId)

      if (tokenData.hasQueue) {
        router.push(`/ticket/${ticketId}/queue`)
        return
      }

      router.push(`/ticket/${ticketId}/seat`)
    } catch (error) {
      if (error instanceof HttpError && error.status === 404) {
        router.replace(`/error${buildErrorSearch(TICKETING_ERROR_TYPE.INVALID_TICKET)}`)
        return
      }

      router.replace(`/error${buildErrorSearch(TICKETING_ERROR_TYPE.UNEXPECTED)}`)
    }
  }, [enterTicketMutation, setTokenId, router, ticketId])

  if (ticketDetailQuery.isPending) {
    return (
      <div className='mx-auto max-w-4xl md:px-6'>
        <div className='h-30' />
        <div className='rounded-2xl border border-gray-300 bg-white p-6'>
          <p>티켓 정보를 불러오는 중입니다.</p>
        </div>
      </div>
    )
  }

  if (ticketDetailQuery.isError) {
    return (
      <div className='mx-auto max-w-4xl md:px-6'>
        <div className='h-30' />
        <div className='rounded-2xl border border-red-200 bg-red-50 p-6'>
          <p>티켓 정보를 조회하지 못했습니다.</p>
        </div>
      </div>
    )
  }

  return (
    <div className='mx-auto max-w-4xl md:px-6'>
      <div className='flex h-30 items-center justify-start'>
        <PreviousButton />
      </div>
      <div className='overflow-hidden rounded-2xl border border-gray-300'>
        <div className='bg-neutral-100'>
          <ImageWithSkeleton
            alt={ticketDetailQuery.data.title}
            preset='detail'
            src={ticketDetailQuery.data.image}
          />
        </div>
        <div className='flex flex-col gap-5 p-5'>
          <div className='flex flex-col gap-2'>
            <p className='text-2XL-Medium'>{ticketDetailQuery.data.title}</p>
            <p>{ticketDetailQuery.data.eventDate}</p>
            <p>{ticketDetailQuery.data.venue}</p>
          </div>
          <div className='flex flex-col gap-2'>
            <div>
              <p className='text-XL-Regular'>About This Event</p>
              <p>{ticketDetailQuery.data.description}</p>
            </div>
            <p>{`전석 ${formatCurrency(ticketDetailQuery.data.price)}`}</p>
          </div>

          <ConfirmButton
            buttonText='예약'
            disabled={enterTicketMutation.isPending}
            onClick={handleConfirm}
          />
        </div>
      </div>
    </div>
  )
}
