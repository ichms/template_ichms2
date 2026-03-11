import type { Metadata } from 'next'
import './globals.css'
import { ClientProvider } from '@/features/shell/provider/ClientProvider'

export const metadata: Metadata = {
  title: 'Ticketing System MVP',
  description: 'MSW 기반 티켓팅 대기열/좌석 예약 예제',
}

type RootLayoutProps = Readonly<{
  children: React.ReactNode
}>

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang='ko'>
      <body className='antialiased'>
        <ClientProvider>
          <div className='h-lvh w-lvw'>
            <div className='bg-common-100 min-h-screen pb-12'>{children}</div>
          </div>
        </ClientProvider>
      </body>
    </html>
  )
}

export default RootLayout
