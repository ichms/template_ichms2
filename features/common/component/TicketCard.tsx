import { ImageWithSkeleton } from '@/features/common/component/ImageWithSkeleton'

interface TicketCardProps {
  id: string
  title: string
  description: string
  eventDate: string
  venue: string
  image: string
  price: number
  onClick: () => void
}

const numberFormatter = new Intl.NumberFormat('ko-KR')

const formatCurrency = (amount: number) => {
  return `${numberFormatter.format(amount)}원`
}

export const TicketCard = ({ onClick, ...ticket }: TicketCardProps) => {
  return (
    <button
      className='relative z-0 flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-300 hover:z-10 hover:shadow-lg'
      onClick={() => {
        onClick()
      }}
      type='button'
    >
      <ImageWithSkeleton alt={ticket.description} preset='card' src={ticket.image} />
      <div className='flex flex-col gap-1 p-4 text-start'>
        <p className='text-XL-Medium'>{ticket.title}</p>
        <p>{ticket.eventDate}</p>
        <p>{ticket.venue}</p>
        <p className='text-M-Medium'>{formatCurrency(ticket.price)}</p>
      </div>
    </button>
  )
}
