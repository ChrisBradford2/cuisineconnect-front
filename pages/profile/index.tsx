import Head from 'next/head';
import Link from 'next/link';
import { ToastContainer } from 'react-toastify';
import useSession from '@/src/hooks/useSession';
import useIsClient from '@/src/hooks/useIsClient';

export default function Profile() {
  const session = useSession();
  const isClient = useIsClient();

  return (
    <>
      <Head>
        <title>Cuisine Connecté</title>
        <meta name="description" content="Cuisine Connecté" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col mt-10 items-center h-full">
        <h1 className="text-3xl font-bold text-gray-800 md:text-5xl">Profil</h1>

        {isClient && session && (
          // White card with user information
          <section className="relative flex flex-col items-center justify-center w-full py-16">
            <div className="container flex flex-col items-center justify-center">
              <div className="flex items-center mt-8 w-full justify-evenly">
                <div className="flex flex-col items-center justify-center w-full h-full p-10 mx-auto my-0 text-center bg-white rounded-lg shadow-2xl md:my-32 md:w-1/2">
                  <p className="mt-2 text-sm text-gray-500 md:text-base">
                    Email: {session.email}
                  </p>
                  <p className="mt-2 text-sm text-gray-500 md:text-base">
                    Préférences :{' '}
                    {session.foodPreference ?? 'Pas de préférence'}
                  </p>
                  <Link
                    className="px-2 py-1 mt-4 text-green-700 font-medium tracking-wide rounded-md hover:bg-green-100 hover:text-gray-700 transition-all duration-150"
                    href="/profile/edit"
                  >
                    Modifier le profil
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <ToastContainer />
    </>
  );
}
