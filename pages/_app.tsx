import '@/styles/globals.scss';
import '@/styles/like.scss';
import type { AppProps } from 'next/app';
import NavBar from '@/src/components/NavBar';
import 'react-toastify/dist/ReactToastify.css';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <Component {...pageProps} />
    </div>
  );
}
