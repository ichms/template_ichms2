import { ArrowLeft } from '@/assets/icons/ArrowLeft'
import { useRouter } from 'next/navigation'

export const PreviousButton = () => {
  const router = useRouter()

  return (
    <button
      className='flex cursor-pointer gap-2'
      onClick={() => {
        router.back()
      }}
      type='button'
    >
      <ArrowLeft />
      <p>Back to Events</p>
    </button>
  )
}
