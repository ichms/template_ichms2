'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PreviousButton } from '@/features/common/component/PreviousButton'
import { formatCurrency, formatDateTime } from '@/features/common/utils/format'
import { useMyReservationListQuery } from '@/features/my/hooks/queries'
import {
  RESERVATION_STATUS_LABEL,
  RESERVATION_STATUS_STYLES,
} from '@/features/my/type'
import { ReservationDetailDialog } from '@/features/my/components/elements/ReservationDetailDialog'

export const MyPage = () => {
  const myReservationListQuery = useMyReservationListQuery()
  const [selectedReservationId, setSelectedReservationId] = useState<string | null>(null)

  return (
    <>
      <ReservationDetailDialog
        onClose={() => {
          setSelectedReservationId(null)
        }}
        reservationId={selectedReservationId}
      />

      <div className='mx-auto max-w-6xl md:px-6'>
        <div className='flex h-30 items-center justify-between'>
          <PreviousButton />
          <Link
            className='rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm text-neutral-700 transition-colors hover:bg-neutral-100'
            href='/'
          >
            티켓 홈
          </Link>
        </div>

        <div className='flex flex-col gap-2 pb-6'>
          <p className='text-3XL-Bold'>마이페이지</p>
          <p className='text-neutral-600'>예매 내역을 확인하고 상세 정보를 조회하세요.</p>
        </div>

        {myReservationListQuery.isPending ? (
          <div className='rounded-2xl border border-neutral-200 bg-white p-6'>
            <p>예매 내역을 불러오는 중입니다.</p>
          </div>
        ) : null}

        {myReservationListQuery.isError ? (
          <div className='rounded-2xl border border-red-200 bg-red-50 p-6'>
            <p>예매 내역 조회 중 오류가 발생했습니다.</p>
          </div>
        ) : null}

        {myReservationListQuery.isSuccess && myReservationListQuery.data.length === 0 ? (
          <div className='rounded-2xl border border-neutral-200 bg-white p-6'>
            <p>아직 예매한 내역이 없습니다.</p>
          </div>
        ) : null}

        {myReservationListQuery.isSuccess && myReservationListQuery.data.length > 0 ? (
          <div className='grid gap-4'>
            {myReservationListQuery.data.map((item) => {
              return (
                <button
                  className='grid cursor-pointer gap-4 rounded-2xl border border-neutral-200 bg-white p-5 text-start transition-shadow hover:shadow-md md:grid-cols-[1fr_auto]'
                  key={item.reservation.id}
                  onClick={() => {
                    setSelectedReservationId(item.reservation.id)
                  }}
                  type='button'
                >
                  <div className='flex flex-col gap-2'>
                    <div className='flex items-center gap-3'>
                      <p className='text-XL-Bold'>{item.ticket.title}</p>
                      <span
                        className={`rounded-full border px-3 py-1 text-sm ${RESERVATION_STATUS_STYLES[item.reservation.status]}`}
                      >
                        {RESERVATION_STATUS_LABEL[item.reservation.status]}
                      </span>
                    </div>
                    <p className='text-neutral-600'>{item.ticket.eventDate}</p>
                    <p className='text-neutral-600'>{item.ticket.venue}</p>
                    <p>{formatCurrency(item.reservation.price)}</p>
                  </div>
                  <div className='flex flex-col justify-between gap-4 text-sm text-neutral-500 md:items-end'>
                    <p>{`예매일시 ${formatDateTime(item.reservation.createdAt)}`}</p>
                    <p>상세보기</p>
                  </div>
                </button>
              )
            })}
          </div>
        ) : null}
      </div>
    </>
  )
}
