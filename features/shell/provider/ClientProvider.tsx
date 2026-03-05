'use client'

import { useEffect, useState } from 'react'
import type { PropsWithChildren } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

let mockWorkerStarted = false

const startMockWorker = async () => {
  if (process.env.NODE_ENV !== 'development') {
    return
  }

  if (mockWorkerStarted) {
    return
  }

  const { worker } = await import('@/mocks/browser')

  await worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: '/mockServiceWorker.js',
    },
  })

  mockWorkerStarted = true
}

export const ClientProvider = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(() => {
    return new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          retry: 1,
        },
      },
    })
  })

  const [isReady, setIsReady] = useState(() => {
    return process.env.NODE_ENV !== 'development'
  })

  useEffect(() => {
    let mounted = true

    const bootstrap = async () => {
      try {
        await startMockWorker()
      } finally {
        if (mounted) {
          setIsReady(true)
        }
      }
    }

    void bootstrap()

    return () => {
      mounted = false
    }
  }, [])

  if (!isReady) {
    return null
  }

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
