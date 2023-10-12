import '@/styles/globals.scss'
import "@/styles/like.scss"
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react';
import NavBar from '@/src/components/NavBar';

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <NavBar />
      <Component {...pageProps} />
    </SessionProvider>
  )
}
