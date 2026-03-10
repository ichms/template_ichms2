import { useMemo, useState } from 'react'
import {
  ConfirmButton,
  Dialog,
  ImageWithSkeleton,
  PrintInfo,
} from '@/features/common/component'
import { formatCurrency, formatDateTime } from '@/features/common/utils/format'
import {
  RESERVATION_STATUS_LABEL,
  RESERVATION_STATUS_STYLES,
  RESERVATION_STATUS,
} from '@/features/my/type'
import { useCancelReservationMutation } from '@/features/my/hooks/mutations'
import { useMyReservationDetailQuery } from '@/features/my/hooks/queries'
import { HttpError } from '@/packages/http/client'

interface ReservationDetailDialogProps {
  reservationId: string | null
  onClose: () => void
}

export const ReservationDetailDialog = ({
  reservationId,
  onClose,
}: ReservationDetailDialogProps) => {
  const reservationDetailQuery = useMyReservationDetailQuery(reservationId)
  const { mutateAsync: cancelReservation, isPending: isCancelingReservation } =
    useCancelReservationMutation()
  const [errorMessage, setErrorMessage] = useState('')

  const isCancelable =
    reservationDetailQuery.data?.reservation.status === RESERVATION_STATUS.BOOKED

  const footer = useMemo(() => {
    return (
      <div className='mt-6 flex w-full gap-3'>
        {isCancelable ? (
          <button
            className='flex-1 cursor-pointer rounded-lg border border-red-300 bg-red-50 px-6 py-3 text-red-700 transition-colors hover:bg-red-100 disabled:cursor-default disabled:border-neutral-200 disabled:bg-neutral-100 disabled:text-neutral-400'
            disabled={isCancelingReservation}
            onClick={() => {
              if (reservationId === null) {
                return
              }

              void cancelReservation(reservationId).catch((error) => {
                if (error instanceof HttpError) {
                  setErrorMessage(error.message)
                  return
                }

                setErrorMessage('예매 취소 중 오류가 발생했습니다.')
              })
            }}
            type='button'
          >
            예매 취소
          </button>
        ) : null}
        <ConfirmButton
          buttonText='닫기'
          className={isCancelable ? 'flex-1' : ''}
          onClick={onClose}
        />
      </div>
    )
  }, [cancelReservation, isCancelable, isCancelingReservation, onClose, reservationId])

  return (
    <Dialog
      footer={footer}
      isOpen={reservationId !== null}
      onClose={() => {
        setErrorMessage('')
        onClose()
      }}
      panelClassName='max-w-2xl'
    >
      {reservationDetailQuery.isPending ? (
        <div className='p-4'>
          <p>예매 정보를 불러오는 중입니다.</p>
        </div>
      ) : null}

      {reservationDetailQuery.isError ? (
        <div className='p-4'>
          <p className='text-red-600'>예매 정보를 조회하지 못했습니다.</p>
        </div>
      ) : null}

      {reservationDetailQuery.isSuccess ? (
        <div className='flex flex-col gap-5'>
          <div className='overflow-hidden rounded-2xl bg-neutral-100'>
            <ImageWithSkeleton
              alt={reservationDetailQuery.data.ticket.description}
              preset='detail'
              src={reservationDetailQuery.data.ticket.image}
            />
          </div>

          <div className='flex items-start justify-between gap-4'>
            <div>
              <p className='text-2XL-Bold'>{reservationDetailQuery.data.ticket.title}</p>
              <p className='pt-1 text-neutral-600'>
                {reservationDetailQuery.data.ticket.venue}
              </p>
            </div>
            <span
              className={`rounded-full border px-3 py-1 text-sm ${RESERVATION_STATUS_STYLES[reservationDetailQuery.data.reservation.status]}`}
            >
              {RESERVATION_STATUS_LABEL[reservationDetailQuery.data.reservation.status]}
            </span>
          </div>

          <p className='text-neutral-700'>
            {reservationDetailQuery.data.ticket.description}
          </p>

          <div className='grid gap-3 rounded-2xl border border-neutral-300 bg-white p-4'>
            <PrintInfo
              category='공연 일시'
              info={reservationDetailQuery.data.ticket.eventDate}
            />
            <PrintInfo
              category='공연 장소'
              info={reservationDetailQuery.data.ticket.venue}
            />
            <PrintInfo
              category='좌석'
              info={`${reservationDetailQuery.data.seat.row}열 ${reservationDetailQuery.data.seat.number}석`}
            />
            <PrintInfo
              category='예매 일시'
              info={formatDateTime(reservationDetailQuery.data.reservation.createdAt)}
            />
            <PrintInfo
              category='예매 상태'
              info={
                RESERVATION_STATUS_LABEL[reservationDetailQuery.data.reservation.status]
              }
            />
            <PrintInfo
              category='결제 금액'
              info={formatCurrency(reservationDetailQuery.data.reservation.price)}
            />
            {reservationDetailQuery.data.reservation.canceledAt !== undefined ? (
              <PrintInfo
                category='취소 일시'
                info={formatDateTime(reservationDetailQuery.data.reservation.canceledAt)}
              />
            ) : null}
          </div>

          {errorMessage !== '' ? (
            <p className='text-sm text-red-600'>{errorMessage}</p>
          ) : null}
        </div>
      ) : null}
    </Dialog>
  )
}
