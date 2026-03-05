import type { HTMLAttributes } from 'react'

interface PrintInfoProps {
  category: string
  info: string
  className?: HTMLAttributes<HTMLDivElement>['className']
}

export const PrintInfo = ({ category, info, className }: PrintInfoProps) => {
  return (
    <div className={className}>
      <p className='text-M-Light text-neutral-500'>{category}</p>
      <p className='text-M-Medium text-neutral-700'>{info}</p>
    </div>
  )
}
