import { useState } from 'react'
import Image from 'next/image'

interface ImageWithSkeletonProps {
  src: string
  alt: string
  preset?: keyof typeof imagePresetConfig
  aspectRatio?: string
  className?: string
  sizes?: string
}

export const ImageWithSkeleton = ({
  src,
  alt,
  preset,
  aspectRatio,
  className,
  sizes,
}: ImageWithSkeletonProps) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const config = preset !== undefined ? imagePresetConfig[preset] : undefined
  const resolvedAspectRatio = aspectRatio ?? config?.aspectRatio ?? 'aspect-video'
  const resolvedSizes = sizes ?? config?.sizes ?? '100vw'

  return (
    <div className={`relative overflow-hidden ${resolvedAspectRatio} ${className ?? ''}`}>
      {!isLoaded ? (
        <div
          aria-hidden
          className='absolute inset-0 flex animate-pulse items-center justify-center bg-neutral-400'
        />
      ) : null}

      <Image
        alt={alt}
        className={`object-cover transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        fill
        onError={() => {
          setIsLoaded(true)
        }}
        onLoad={() => {
          setIsLoaded(true)
        }}
        sizes={resolvedSizes}
        src={src}
        unoptimized
      />
    </div>
  )
}

const imagePresetConfig = {
  card: {
    aspectRatio: 'aspect-5/3',
    sizes: '(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw',
  },
  detail: {
    aspectRatio: 'aspect-video',
    sizes: '(max-width: 1024px) 100vw, 1024px',
  },
} as const
