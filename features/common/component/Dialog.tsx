import { createPortal } from 'react-dom'
import type { PropsWithChildren, ReactNode } from 'react'
import { ConfirmButton } from '@/features/common/component/ConfirmButton'

interface DialogProps extends PropsWithChildren {
  isOpen: boolean
  onClose: () => void
  confirmText?: string
  footer?: ReactNode
  panelClassName?: string
}

export const Dialog = ({
  children,
  isOpen,
  onClose,
  confirmText = '확인',
  footer,
  panelClassName = '',
}: DialogProps) => {
  if (!isOpen || typeof document === 'undefined') {
    return null
  }

  return createPortal(
    <div className='fixed inset-0 z-50 mx-auto flex h-full w-full flex-col items-center justify-center bg-[#000000ba]'>
      <div
        className={`flex w-full max-w-lg flex-col rounded-2xl border border-neutral-300 bg-neutral-200 p-6 shadow-2xl ${panelClassName}`}
      >
        {children}
        <div className='flex flex-1' />

        {footer ?? <ConfirmButton buttonText={confirmText} onClick={onClose} />}
      </div>
    </div>,
    document.body,
  )
}
