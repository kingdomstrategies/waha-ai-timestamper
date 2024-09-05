import type { Metadata } from 'next'
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
      <body className="antialiased text-default bg-b1 flex flex-col items-center justify-center">
        <main className="page">{children}</main>
      </body>
    </html>
  )
}
