import React, { FormEvent, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { toast, ToastContainer } from 'react-toastify';
import useSession from '@/src/hooks/useSession';
import useIsClient from '@/src/hooks/useIsClient';
import { saveFoodPreferences } from '@/services/getFoodPreferences';

export default function Profile() {
  const session = useSession();
  const router = useRouter();
  const isClient = useIsClient();
  const [foodPreference, setFoodPreference] = useState('');

  useEffect(() => {
    setFoodPreference(session?.foodPreference ?? '');
  }, [session?.foodPreference]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      if (session?.token) {
        await saveFoodPreferences(session.token, foodPreference);
        await router.push('/profile');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An unexpected error occurred');
      }
    }
  };

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
            <form
              className="container flex flex-col items-center justify-center space-y-4"
              onSubmit={handleSubmit}
            >
              <input
                value={foodPreference}
                onChange={({ currentTarget }) => {
                  setFoodPreference(currentTarget.value);
                }}
                className="border border-gray-300 p-2 rounded w-64 focus:outline-none focus:border-blue-500"
              />

              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded focus:outline-none"
              >
                Submit
              </button>
            </form>
          </section>
        )}
      </main>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}
