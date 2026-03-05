import { memo } from 'react'

interface SeatInfo {
  id: string
  row: string
  number: number
  price: number
  isAvailable: boolean
}

interface SeatButtonProps {
  isSelected: boolean
  onSelect: (seat: SeatInfo) => void
  seatInfo: SeatInfo
}

const SEAT_BUTTON_VARIANT = {
  DISABLED: 'disabled',
  SELECTED: 'selected',
  DEFAULT: 'default',
} as const

export const SeatButton = memo(({ onSelect, isSelected, seatInfo }: SeatButtonProps) => {
  const base = 'text-S-Regular h-12 w-12 rounded border-2 transition-colors'

  const variants: Record<
    (typeof SEAT_BUTTON_VARIANT)[keyof typeof SEAT_BUTTON_VARIANT],
    string
  > = {
    [SEAT_BUTTON_VARIANT.DISABLED]: 'border-neutral-300 bg-gray-500 text-neutral-900',
    [SEAT_BUTTON_VARIANT.SELECTED]: 'border-neutral-900 bg-neutral-900 text-white',
    [SEAT_BUTTON_VARIANT.DEFAULT]:
      'border-neutral-300 bg-white text-neutral-600 hover:border-neutral-900',
  }

  const isDisabled = !seatInfo.isAvailable
  const variant = isDisabled
    ? SEAT_BUTTON_VARIANT.DISABLED
    : isSelected
      ? SEAT_BUTTON_VARIANT.SELECTED
      : SEAT_BUTTON_VARIANT.DEFAULT

  return (
    <button
      className={`${base} ${variants[variant]}`}
      disabled={!seatInfo.isAvailable}
      onClick={() => {
        onSelect(seatInfo)
      }}
      type='button'
    >
      {seatInfo.isAvailable ? `${seatInfo.row} ${seatInfo.number}` : ''}
    </button>
  )
})

SeatButton.displayName = 'SeatButton'
