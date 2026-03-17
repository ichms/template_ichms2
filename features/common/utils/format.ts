const numberFormatter = new Intl.NumberFormat('ko-KR')
const dateTimeFormatter = new Intl.DateTimeFormat('ko-KR', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
})

export const formatCurrency = (amount: number) => {
  return `${numberFormatter.format(amount)}원`
}

export const formatDateTime = (timestamp: number) => {
  return dateTimeFormatter.format(timestamp)
}
