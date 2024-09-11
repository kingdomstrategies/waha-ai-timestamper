import type { Metadata } from 'next'
import Header from '../components/Header'
import './globals.css'

export const metadata: Metadata = {
  title: 'Timestamp',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased text-default bg-b1 flex flex-col w-full items-center h-screen">
        <div className="h-screen flex flex-col w-full items-center flex-1">
          <Header />
          <div className="max-w-2xl w-full px-4 flex-1 flex flex-col overflow-auto">
            {children}
          </div>
          <div className="w-full pb-1 px-4 text-xs text-f2 text-center">
            Made with love by the Waha team. © 2021
          </div>
        </div>
      </body>
    </html>
  )
}
