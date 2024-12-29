import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/header'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/sidebar/sidebar'


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
          <SidebarProvider>
            <div className=' h-[calc(100vh-56px)] w-full flex'>
              <AppSidebar />
              <section id='main-content' className='w-full px-8 py-4'>
                {children}
              </section>
            </div>
          </SidebarProvider>
        </div>
      </body>
    </html>
  )
}
