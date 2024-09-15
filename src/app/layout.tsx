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
      <body
        className="antialiased text-default bg-b1 flex flex-col w-full items-center scroll-smooth
          min-h-fit h-screen"
      >
        <div className="flex flex-col w-full items-center flex-1">
          <Header />
          <div className="w-full flex-1 flex flex-col items-center">
            {children}
            {/* <div className="w-full pb-1 pt-2 px-4 text-xs text-f2 text-center">
              Made with ❤️ by the{' '}
              <a href="https://waha.app" className="underline">
                Waha
              </a>{' '}
              team. © 2024
            </div> */}
          </div>
        </div>
      </body>
    </html>
  )
}
