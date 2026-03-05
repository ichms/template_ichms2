'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ConfirmButton,
  ExpiredTime,
  PreviousButton,
  SeatButton,
  WarningDialog,
} from '@/features/common/component'
import { useTicketStore } from '@/features/common/store/useTicketStore'
import { useQueueStatusQuery } from '@/features/ticket/shared/hooks/queries'
import { useCreateReservationMutation } from '@/features/ticket/seat/hooks/mutations'
import { useTicketSeatsQuery } from '@/features/ticket/seat/hooks/queries'
import { TICKETING_ERROR_TYPE, type Seat } from '@/features/ticket/shared/type'
import { buildErrorSearch, formatCurrency } from '@/features/ticket/shared/utils'
import { HttpError } from '@/packages/http/client'

interface SeatSelectionPageProps {
  ticketId: string
}

export const SeatSelectionPage = ({ ticketId }: SeatSelectionPageProps) => {
  const router = useRouter()
  const tokenId = useTicketStore((state) => state.tokenId)
  const setTokenId = useTicketStore((state) => state.setTokenId)
  const [errorMsg, setErrorMsg] = useState('')
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null)

  const queueStatusQuery = useQueueStatusQuery(tokenId, {
    polling: false,
  })

  const seatListQuery = useTicketSeatsQuery(ticketId, {
    enabled: queueStatusQuery.data?.token.status === 'ready',
  })

  const createReservationMutation = useCreateReservationMutation()

  useEffect(() => {
    if (tokenId !== null) {
      return
    }

    router.replace(`/ticket/${ticketId}`)
  }, [router, ticketId, tokenId])

  useEffect(() => {
    if (!queueStatusQuery.isSuccess) {
      return
    }

    if (queueStatusQuery.data.token.status === 'waiting') {
      router.replace(`/ticket/${ticketId}/queue`)
      return
    }

    if (queueStatusQuery.data.token.status === 'expired') {
      setTokenId(null)
      router.replace(`/error${buildErrorSearch(TICKETING_ERROR_TYPE.TOKEN)}`)
    }
  }, [queueStatusQuery.data, queueStatusQuery.isSuccess, router, setTokenId, ticketId])

  useEffect(() => {
    if (!queueStatusQuery.isError) {
      return
    }

    if (
      queueStatusQuery.error instanceof HttpError &&
      queueStatusQuery.error.status === 404
    ) {
      setTokenId(null)
      router.replace(`/error${buildErrorSearch(TICKETING_ERROR_TYPE.TOKEN)}`)
      return
    }

    router.replace(`/error${buildErrorSearch(TICKETING_ERROR_TYPE.UNEXPECTED)}`)
  }, [queueStatusQuery.error, queueStatusQuery.isError, router, setTokenId])

  const seatSections = useMemo(() => {
    const section: Record<string, Seat[]> = {}

    ;(seatListQuery.data ?? []).forEach((seat) => {
      if (section[seat.row] === undefined) {
        section[seat.row] = []
      }
      section[seat.row].push(seat)
    })

    return Object.values(section)
  }, [seatListQuery.data])

  const handleSelect = useCallback((seat: Seat) => {
    setSelectedSeat(seat)
  }, [])

  const timeOutCallback = useCallback(() => {
    setTokenId(null)
    router.replace(`/error${buildErrorSearch(TICKETING_ERROR_TYPE.TOKEN)}`)
  }, [router, setTokenId])

  return (
    <>
      <WarningDialog
        errorMsg={errorMsg}
        onClose={() => {
          setErrorMsg('')
        }}
      />
      <div className='mx-auto max-w-4xl md:px-6'>
        <div className='flex h-30 items-center justify-between'>
          <PreviousButton />
          <ExpiredTime onTime={timeOutCallback} />
        </div>
        <div className='overflow-hidden rounded-2xl border border-gray-300'>
          <div className='flex flex-col gap-3 p-5'>
            <div className='w-full rounded-xl bg-neutral-200 px-4 py-4'>
              <p className='text-center text-gray-500'>Stage</p>
            </div>

            <div className='flex w-full flex-col items-center gap-3 overflow-scroll py-10'>
              {seatSections.map((seatSection) => {
                return (
                  <div className='flex gap-2' key={seatSection[0].row}>
                    {seatSection.map((seat) => {
                      return (
                        <SeatButton
                          key={seat.id}
                          isSelected={selectedSeat?.id === seat.id}
                          onSelect={handleSelect}
                          seatInfo={seat}
                        />
                      )
                    })}
                  </div>
                )
              })}
            </div>

            <div className='flex gap-3'>
              <div className='flex gap-2'>
                <div className='h-6 w-6 rounded border-2 border-neutral-300 bg-white text-neutral-600 transition-colors' />
                <p>선택가능</p>
              </div>
              <div className='flex gap-2'>
                <div className='h-6 w-6 rounded border-2 border-neutral-900 bg-neutral-900 text-white transition-colors' />
                <p>선택</p>
              </div>
            </div>

            {selectedSeat !== null ? (
              <div className='py-3'>
                <div className='rounded-2xl border border-neutral-200 bg-neutral-100 p-4'>
                  <p className='text-L-Regular text-neutral-600'>선택좌석</p>
                  <p>{`${selectedSeat.row} ${selectedSeat.number}`}</p>
                  <p>{formatCurrency(selectedSeat.price)}</p>
                </div>
              </div>
            ) : null}

            <ConfirmButton
              buttonText='좌석 선택'
              disabled={
                selectedSeat === null ||
                createReservationMutation.isPending ||
                tokenId === null ||
                queueStatusQuery.data?.token.status !== 'ready'
              }
              onClick={async () => {
                if (selectedSeat === null || tokenId === null) {
                  return
                }

                try {
                  const response = await createReservationMutation.mutateAsync({
                    seatId: selectedSeat.id,
                    tokenId,
                  })

                  setTokenId(null)
                  router.replace(`/ticket/${ticketId}/complete/${response.id}`)
                } catch (error) {
                  if (error instanceof HttpError) {
                    if (error.status === 410) {
                      timeOutCallback()
                      return
                    }

                    if (error.status === 400 || error.status === 404) {
                      setErrorMsg(error.message)
                    }

                    return
                  }

                  router.replace(
                    `/error${buildErrorSearch(TICKETING_ERROR_TYPE.UNEXPECTED)}`,
                  )
                }
              }}
            />
          </div>
        </div>
      </div>
    </>
  )
}
