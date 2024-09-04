import RootLayout from './layout'

export default function MyApp({ Component, pageProps, router }) {
  return (
    <RootLayout>
      <Component {...pageProps} />
    </RootLayout>
  )
}
