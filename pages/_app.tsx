import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { SessionProvider, signIn } from 'next-auth/react'

import 'tailwindcss/tailwind.css'
import 'moment/locale/ja'
export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

  useEffect(() => {
    if (!router.isReady) {
      return
    }
  }, [router])

  return (
    <SessionProvider>
      <Component {...pageProps} />
    </SessionProvider>
  )
}
