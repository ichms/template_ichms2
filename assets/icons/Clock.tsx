interface ClockProps {
  textColor?: string
}

export const Clock = ({ textColor }: ClockProps) => {
  return (
    <svg
      aria-hidden='true'
      className={`lucide lucide-clock h-8 w-8 ${textColor ?? 'text-red-600'}`}
      fill='none'
      height='24'
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='2'
      viewBox='0 0 24 24'
      width='24'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path d='M12 6v6l4 2' />
      <circle cx='12' cy='12' r='10' />
    </svg>
  )
}
