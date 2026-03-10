{
  /* AI로 생성한 컴포넌트 예시 */
}

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/packages/ui'

const inputVariants = cva(
  'w-full border bg-white text-neutral-900 placeholder:text-neutral-400 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'border-neutral-200 focus-visible:ring-primary-500 focus-visible:border-primary',
        error: 'border-red-400 focus-visible:ring-red-400 focus-visible:border-red-500',
      },
      size: {
        sm: 'h-8 px-3 text-sm rounded-radius-md',
        md: 'h-10 px-4 text-base rounded-radius-lg',
        lg: 'h-12 px-6 text-lg rounded-radius-xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
)

export interface DefaultInputProps
  extends
    Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  /** 입력 필드 레이블 */
  label?: string
  /** 에러 메시지 */
  errorMessage?: string
  /** 입력 필드 좌측 아이콘 */
  leftIcon?: React.ReactNode
  /** 입력 필드 우측 아이콘 */
  rightIcon?: React.ReactNode
}

/**
 * DefaultInput Component
 *
 * @example
 * ```tsx
 * <DefaultInput label="이름" placeholder="이름을 입력하세요" />
 *
 * <DefaultInput
 *   variant="error"
 *   errorMessage="필수 항목입니다"
 *   label="이메일"
 * />
 *
 * <DefaultInput size="lg" leftIcon={<SearchIcon />} placeholder="검색" />
 * ```
 */
export const DefaultInput = React.forwardRef<HTMLInputElement, DefaultInputProps>(
  (
    { className, variant, size, label, errorMessage, leftIcon, rightIcon, id, ...props },
    ref,
  ) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    const resolvedVariant = errorMessage ? 'error' : variant

    return (
      <div className='flex flex-col gap-1'>
        {label && (
          <label htmlFor={inputId} className='text-sm font-medium text-neutral-700'>
            {label}
          </label>
        )}
        <div className='relative flex items-center'>
          {leftIcon && (
            <span className='absolute left-3 inline-flex shrink-0 text-neutral-400'>
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              inputVariants({ variant: resolvedVariant, size }),
              leftIcon && 'pl-9',
              rightIcon && 'pr-9',
              className,
            )}
            aria-invalid={resolvedVariant === 'error'}
            aria-describedby={errorMessage ? `${inputId}-error` : undefined}
            {...props}
          />
          {rightIcon && (
            <span className='absolute right-3 inline-flex shrink-0 text-neutral-400'>
              {rightIcon}
            </span>
          )}
        </div>
        {errorMessage && (
          <p id={`${inputId}-error`} className='text-sm text-red-500'>
            {errorMessage}
          </p>
        )}
      </div>
    )
  },
)

DefaultInput.displayName = 'DefaultInput'
