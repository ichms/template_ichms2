import { createPortal } from 'react-dom'
import type { PropsWithChildren } from 'react'
import { ConfirmButton } from '@/features/common/component/ConfirmButton'

interface DialogProps extends PropsWithChildren {
  isOpen: boolean
  onClose: () => void
}

export const Dialog = ({ children, isOpen, onClose }: DialogProps) => {
  if (!isOpen || typeof document === 'undefined') {
    return null
  }

  return createPortal(
    <div className='fixed inset-0 z-50 mx-auto flex h-full w-full flex-col items-center justify-center bg-[#000000ba]'>
      <div className='flex flex-col rounded-2xl border border-neutral-300 bg-neutral-200 p-6 shadow-2xl'>
        {children}
        <div className='flex flex-1' />

        <ConfirmButton buttonText='확인' onClick={onClose} />
      </div>
    </div>,
    document.body,
  )
}
