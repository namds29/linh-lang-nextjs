import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import Sidebar from '@/components/layout/sidebar'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'Linh Lang Company',
  description: 'Linh Lang Đồ Gỗ',
  icons: 'icon/logo.png'
}

export default function RootLayout ({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className='container-fluid'>
          <Header />
          <div className=' h-[calc(100vh-56px)] w-full flex'>
           <Sidebar />
            <section id='main-content' className='w-full p-4'>
              {children}
            </section>
          </div>
        </div>
      </body>
    </html>
  )
}
