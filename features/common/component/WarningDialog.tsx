import { ErrorIcon } from '@/assets/icons/ErrorIcon'
import { Dialog } from '@/features/common/component/Dialog'

interface WarningDialogProps {
  errorMsg: string
  onClose: () => void
}

export const WarningDialog = ({ errorMsg, onClose }: WarningDialogProps) => {
  return (
    <Dialog isOpen={errorMsg !== ''} onClose={onClose}>
      <div className='flex h-full w-full flex-col items-center gap-4 px-10 pb-4'>
        <div className='h-12 w-12 rounded-full bg-red-200 p-3'>
          <ErrorIcon />
        </div>
        <p className='text-L-Medium'>{errorMsg}</p>
      </div>
    </Dialog>
  )
}
