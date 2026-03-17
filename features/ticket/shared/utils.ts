import {
  TICKETING_ERROR_TYPE,
  type TicketingErrorType,
} from '@/features/ticket/shared/type'

const numberFormatter = new Intl.NumberFormat('ko-KR')
const dateTimeFormatter = new Intl.DateTimeFormat('ko-KR', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
})
const ticketingErrorTypes = new Set<TicketingErrorType>(
  Object.values(TICKETING_ERROR_TYPE),
)

export const formatCurrency = (amount: number) => {
  return `${numberFormatter.format(amount)}원`
}

export const formatDateTime = (timestamp: number) => {
  return dateTimeFormatter.format(timestamp)
}

export const msToMin = (ms: number) => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1_000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return {
    minutes,
    seconds,
  }
}

export const buildErrorSearch = (type: TicketingErrorType, message?: string) => {
  const params = new URLSearchParams({ type })

  if (message !== undefined) {
    params.set('message', message)
  }

  return `?${params.toString()}`
}

const normalizeErrorType = (type: string | null): TicketingErrorType | null => {
  if (type === null) {
    return null
  }

  return ticketingErrorTypes.has(type as TicketingErrorType)
    ? (type as TicketingErrorType)
    : null
}

export const toErrorType = (type: string | null) => {
  const normalizedType = normalizeErrorType(type)

  return normalizedType ?? TICKETING_ERROR_TYPE.TOKEN
}

export const getDefaultErrorMessage = (type: TicketingErrorType) => {
  switch (type) {
    case TICKETING_ERROR_TYPE.TOKEN:
      return '토큰이 만료되었습니다.'
    case TICKETING_ERROR_TYPE.NOT_FOUND:
      return '요청하신 정보를 찾을 수 없습니다.'
    case TICKETING_ERROR_TYPE.BAD_REQUEST:
      return '요청을 처리할 수 없습니다.'
    case TICKETING_ERROR_TYPE.UNEXPECTED:
      return '예상치 못한 오류가 발생했습니다.'
    case TICKETING_ERROR_TYPE.INVALID_TICKET:
      return '티켓을 찾을 수 없습니다.'
    case TICKETING_ERROR_TYPE.EMPTY_TOKEN:
      return '토큰을 찾을 수 없습니다.'
  }
}
