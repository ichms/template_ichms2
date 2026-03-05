import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PrintInfo } from '@/features/common/component/PrintInfo'
import { useReservationDetailQuery } from '@/features/ticket/complete/hooks/queries'
import { TICKETING_ERROR_TYPE } from '@/features/ticket/shared/type'
import { buildErrorSearch, formatCurrency } from '@/features/ticket/shared/utils'
import { HttpError } from '@/packages/http/client'
import { CheckCircle } from '@/assets/icons/CheckCircle'

interface ReservationCompletePageProps {
  reservationId: string
}

export const ReservationCompletePage = ({
  reservationId,
}: ReservationCompletePageProps) => {
  const router = useRouter()
  const reservationDetailQuery = useReservationDetailQuery(reservationId)
  const reservationErrorStatus =
    reservationDetailQuery.error instanceof HttpError
      ? reservationDetailQuery.error.status
      : null

  useEffect(() => {
    if (!reservationDetailQuery.isError) {
      return
    }

    if (reservationErrorStatus === 404) {
      router.replace(`/error${buildErrorSearch(TICKETING_ERROR_TYPE.NOT_FOUND)}`)
      return
    }

    router.replace(`/error${buildErrorSearch(TICKETING_ERROR_TYPE.UNEXPECTED)}`)
  }, [reservationDetailQuery.isError, reservationErrorStatus, router])

  if (reservationDetailQuery.isPending || reservationDetailQuery.isError) {
    return (
      <div className='mx-auto max-w-xl md:px-6'>
        <div className='h-30' />
        <div className='rounded-lg border border-neutral-200 bg-white p-8 text-center'>
          <p>예약 정보를 불러오는 중입니다.</p>
        </div>
      </div>
    )
  }

  return (
    <div className='mx-auto max-w-xl md:px-6'>
      <div className='h-30' />
      <div className='flex flex-col items-center gap-4 rounded-lg border border-neutral-200 bg-white p-8 text-center'>
        <div className='flex h-16 w-16 items-center justify-center rounded-full bg-green-100'>
          <CheckCircle />
        </div>
        <div>
          <p className='text-XL-Bold'>예약 확정</p>
          <p className='pt-2'>예약이 성공적으로 완료되었습니다.</p>
        </div>
        <div className='w-full border-t border-neutral-200' />

        <div className='flex w-full flex-col gap-3 text-start'>
          <PrintInfo category='티켓명' info={reservationDetailQuery.data.ticket.title} />
          <PrintInfo
            category='시간'
            info={reservationDetailQuery.data.ticket.eventDate}
          />
          <PrintInfo category='장소' info={reservationDetailQuery.data.ticket.venue} />
          <PrintInfo
            category='예약 좌석'
            info={`${reservationDetailQuery.data.seat.row}열 ${reservationDetailQuery.data.seat.number}석`}
          />
        </div>
        <div className='w-full border-t border-neutral-200' />
        <div className='flex w-full'>
          <PrintInfo
            category='가격'
            className='flex w-full items-center justify-between'
            info={formatCurrency(reservationDetailQuery.data.reservation.price)}
          />
        </div>
        <div className='my-2 rounded-2xl border border-neutral-200 bg-neutral-200 p-4'>
          <p className='text-neutral-700'>
            티켓 세부 정보와 이벤트 정보가 포함된 확인 이메일이 등록된 이메일 주소로
            발송되었습니다.
          </p>
        </div>
        <Link
          className='w-full cursor-pointer rounded-lg bg-neutral-900 px-6 py-2 text-white transition-colors hover:bg-neutral-600'
          href='/'
          replace
        >
          확인
        </Link>
      </div>
    </div>
  )
}
