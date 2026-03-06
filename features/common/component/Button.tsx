import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/packages/ui'

/**
 * [shadcn/ui 치환 참고] 추후 shadcn Button으로 교체 시:
 * - variant: primary → default, default → secondary 느낌으로 매핑. destructive는 shadcn에 있으니 필요 시 추가.
 * - size: md → default. icon 전용은 size="icon" 추가 시 호환 좋음.
 * - fullWidth/isLoading/leftIcon/rightIcon 등은 shadcn에 없음 → 래퍼 유지 또는 shadcn 소스에 반영.
 * - 매핑 상세: .agents/skills/design-system/HUMAN_GUIDE.md §9
 *
 * ---------------------------------------------------------------------------
 * cva (class-variance-authority) 사용법
 * ---------------------------------------------------------------------------
 * Tailwind 클래스를 variant 기반으로 타입 안전하게 관리할 때 사용합니다.
 *
 * 1. cva('공통베이스클래스', { variants: { ... }, defaultVariants: { ... } })
 *    - 첫 인자: 항상 적용되는 베이스 클래스
 *    - variants: 키별로 선택 가능한 스타일 맵 (variant, size 등)
 *    - defaultVariants: 기본 선택값
 *
 * 2. 반환값은 (props) => string 함수. 예: buttonVariants({ variant: 'primary', size: 'md' })
 *
 * 3. VariantProps<typeof buttonVariants> 로 props 타입 추출 → variant/size 등 자동 완성
 *
 * ---------------------------------------------------------------------------
 * cn (classnames merge) 사용법
 * ---------------------------------------------------------------------------
 * Tailwind 클래스를 병합할 때 사용합니다. clsx + twMerge 조합.
 *
 * - cn('클래스1', '클래스2') → 충돌 시 뒤에 오는 클래스가 우선 (twMerge)
 * - cn(buttonVariants({ ... }), className) → variant 스타일 + 사용자 className 병합
 * - cn(condition && '클래스') → 조건부 클래스 (clsx)
 *
 * ---------------------------------------------------------------------------
 * Button Variants (이 컴포넌트 전용)
 * ---------------------------------------------------------------------------
 * - variant: default | primary | secondary | outline | ghost | link
 * - size: sm | md | lg
 * - fullWidth: true | false
 */
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none',
  {
    variants: {
      variant: {
        default:
          'bg-neutral-100 text-neutral-900 border border-neutral-200 hover:bg-neutral-200 active:bg-neutral-300',
        primary:
          'bg-primary text-white hover:bg-primary-700 active:bg-primary-800 focus-visible:ring-primary-500 disabled:bg-gray-300 disabled:opacity-100',
        secondary:
          'bg-secondary text-white hover:bg-secondary-700 active:bg-secondary-800 disabled:bg-gray-300 disabled:opacity-100',
        outline:
          'border-2 border-neutral-200 bg-transparent text-neutral-900 hover:bg-neutral-200 active:bg-neutral-300',
        ghost:
          'bg-transparent text-neutral-900 hover:bg-neutral-200 active:bg-neutral-300',
        link:
          'bg-transparent text-primary underline-offset-4 hover:underline hover:text-primary-700',
      },
      size: {
        sm: 'h-8 px-3 text-sm rounded-radius-md',
        md: 'h-10 px-4 text-base rounded-radius-lg',
        lg: 'h-12 px-6 text-lg rounded-radius-xl',
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-auto',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      fullWidth: false,
    },
  },
)

/** cva variant 결과. <a>에 버튼 스타일 적용 시 등에 사용. shadcn 도입 시에도 동일 패턴으로 export 됨. */
export { buttonVariants }

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** 로딩 중 여부 */
  isLoading?: boolean
  /** 로딩 중일 때 표시할 텍스트 */
  loadingText?: string
  /**
   * 버튼의 좌측에 표시될 아이콘
   */
  leftIcon?: React.ReactNode
  /**
   * 버튼의 우측에 표시될 아이콘
   */
  rightIcon?: React.ReactNode
  /**
   * 버튼이 로딩 중일 때 표시될 스피너 아이콘
   */
  loadingIcon?: React.ReactNode
}

/**
 * Button Component
 *
 * @description
 * Figma 디자인 시스템을 기반으로 한 버튼 컴포넌트입니다.
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="md">
 *   Click me
 * </Button>
 *
 * <Button variant="outline" leftIcon={<Icon />}>
 *   With Icon
 * </Button>
 *
 * <Button isLoading loadingText="Processing...">
 *   Submit
 * </Button>
 * ```
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      disabled,
      isLoading,
      loadingText,
      leftIcon,
      rightIcon,
      loadingIcon,
      children,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading

    return (
      <button
        ref={ref}
        className={cn(
          buttonVariants({ variant, size, fullWidth }), // cva로 만든 variant 클래스
          className, // 외부에서 넘긴 className은 cn으로 병합 (충돌 시 className 우선)
        )}
        disabled={isDisabled}
        aria-busy={isLoading}
        aria-disabled={isDisabled}
        {...props}
      >
        {isLoading ? (
          <>
            {loadingIcon || <LoadingSpinner />}
            {loadingText || children}
          </>
        ) : (
          <>
            {leftIcon && <span className='inline-flex shrink-0'>{leftIcon}</span>}
            {children}
            {rightIcon && <span className='inline-flex shrink-0'>{rightIcon}</span>}
          </>
        )}
      </button>
    )
  },
)

Button.displayName = 'Button'

/**
 * Loading Spinner Component
 * 버튼 로딩 상태에서 사용되는 스피너
 */
const LoadingSpinner = () => (
  <svg
    className='h-4 w-4 animate-spin'
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    aria-hidden='true'
  >
    <circle
      className='opacity-25'
      cx='12'
      cy='12'
      r='10'
      stroke='currentColor'
      strokeWidth='4'
    />
    <path
      className='opacity-75'
      fill='currentColor'
      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
    />
  </svg>
)
