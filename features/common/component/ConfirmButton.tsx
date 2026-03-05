import type { ButtonHTMLAttributes } from 'react'

interface ConfirmButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  onClick: () => void | Promise<void>
  buttonText: string
}

export const ConfirmButton = ({ onClick, buttonText, ...props }: ConfirmButtonProps) => {
  return (
    <button
      className='w-full cursor-pointer rounded-lg bg-neutral-900 px-6 py-3 text-white transition-colors hover:bg-neutral-800 disabled:cursor-default disabled:bg-gray-300'
      onClick={() => {
        void onClick()
      }}
      {...props}
    >
      {buttonText}
    </button>
  )
}
