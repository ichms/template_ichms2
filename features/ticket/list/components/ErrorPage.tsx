import Link from 'next/link'

import { getDefaultErrorMessage, toErrorType } from '@/features/ticket/shared/utils'
import { Clock } from '@/assets/icons/Clock'

interface TicketingErrorPageProps {
  type: string | null
  message?: string
}

export const TicketingErrorPage = ({ type, message }: TicketingErrorPageProps) => {
  const errorType = toErrorType(type)
  const errorMessage = message ?? getDefaultErrorMessage(errorType)

  return (
    <div className='mx-auto max-w-xl md:px-6'>
      <div className='h-30' />
      <div className='flex flex-col items-center gap-4 rounded-lg border border-neutral-200 bg-white p-8 text-center'>
        <div className='flex h-16 w-16 items-center justify-center rounded-full bg-red-100'>
          <Clock />
        </div>
        <div>
          <p className='text-L-Regular text-red-400'>{errorMessage}</p>
        </div>
        <Link
          className='cursor-pointer rounded-lg bg-neutral-900 px-6 py-2 text-white transition-colors hover:bg-neutral-600'
          href='/'
          replace
        >
          티켓 리스트로 이동
        </Link>
      </div>
    </div>
  )
}
