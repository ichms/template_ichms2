interface ProgressBarProps {
  progress: number
}

export const ProgressBar = ({ progress }: ProgressBarProps) => {
  const gaugeWidth = Math.min(100, Math.max(0, progress))

  return (
    <div className='flex w-full flex-col gap-3 py-4'>
      <div className='h-4 w-full overflow-hidden rounded-full bg-gray-200'>
        <div
          className='h-full bg-neutral-600 transition-all duration-500 ease-out'
          style={{ width: `${gaugeWidth}%` }}
        />
      </div>

      <div className='w-full'>
        <p>{gaugeWidth}%</p>
      </div>
    </div>
  )
}
