import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import { Session } from 'next-auth';
import { getSession, useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface FoodPreference {
  id: string;
  attributes: {
    name: string;
  };
}

interface ProfileProps {
  data: {
    food_preferences?: FoodPreference[];
  };
  foodPreferences: FoodPreference[];
}

export default function Profile({ data, foodPreferences }: ProfileProps) {
  const session = useSession();
  const router = useRouter();

  const [username, setUsername] = useState<string | null>(
    session.data?.username || null,
  );
  const [email, setEmail] = useState<string | null>(
    session.data?.user?.email || null,
  );
  const [password, setPassword] = useState<string | null>(null);
  const [passwordConfirmation, setPasswordConfirmation] = useState<
    string | null
  >(null);
  const [selectedFood, setSelectedFood] = useState<string[]>(
    data?.food_preferences?.map((foodPreference) => foodPreference.id) || [],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !email) {
      toast.error('Username and email are required');
      return;
    }

    if (password !== passwordConfirmation) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      let payload: {
        username: string;
        email: string;
        food_preferences: string[];
        password?: string;
      } = {
        username: username,
        email: email,
        food_preferences: selectedFood,
      };

      if (password) {
        payload = { ...payload, password: password };
      }

      const response = await fetch(
        `http://localhost:1337/api/users/${session?.data?.id}`,
        {
          method: 'PUT',
          body: JSON.stringify(payload),
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error('Error updating profile');
      }
      localStorage.setItem('profileUpdated', 'true');
      router.push('/profile');
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
      <main className="flex flex-col mt-10 items-center min-h-screen">
        <h1 className="text-3xl font-bold text-gray-800 md:text-5xl">Profil</h1>
        {session.data && (
          // White card with user information
          <section className="relative flex flex-col items-center justify-center w-full py-16">
            <form
              className="container flex flex-col items-center justify-center space-y-4"
              onSubmit={handleSubmit}
            >
              <input
                type="text"
                name="username"
                value={username || ''}
                className="border border-gray-300 p-2 rounded w-64 focus:outline-none focus:border-blue-500"
                placeholder="Username *"
                required
                onChange={(e) => setUsername(e.target.value)}
              />

              <input
                type="email"
                name="email"
                value={email || ''}
                className="border border-gray-300 p-2 rounded w-64 focus:outline-none focus:border-blue-500"
                placeholder="Email *"
                required
                onChange={(e) => setEmail(e.target.value)}
              />

              <select
                name="food_preferences"
                multiple
                value={selectedFood}
                onChange={(e) => {
                  const selectedOptions = Array.from(
                    e.target.selectedOptions,
                  ).map((o) => o.value);
                  setSelectedFood(selectedOptions);
                }}
                className="border border-gray-300 p-2 rounded w-64 focus:outline-none focus:border-blue-500"
              >
                {foodPreferences.map((foodPreference) => (
                  <option key={foodPreference.id} value={foodPreference.id}>
                    {foodPreference.attributes.name}
                  </option>
                ))}
              </select>

              <input
                type="password"
                name="password"
                className="border border-gray-300 p-2 rounded w-64 focus:outline-none focus:border-blue-500"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />

              <input
                type="password"
                name="password_confirmation"
                className="border border-gray-300 p-2 rounded w-64 focus:outline-none focus:border-blue-500"
                placeholder="Password confirmation"
                onChange={(e) => setPasswordConfirmation(e.target.value)}
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  const headers = {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_KEY}`,
    'Content-Type': 'application/json',
  };

  let data, foodPreferences;

  try {
    const profileResponse = await fetch(
      `http://localhost:1337/api/users/${session?.id}?populate=food_preferences`,
      {
        method: 'GET',
        headers: headers,
      },
    );

    if (!profileResponse.ok) {
      throw new Error('Profile fetch failed');
    }

    data = await profileResponse.json();

    const foodPreferencesResponse = await fetch(
      `http://localhost:1337/api/food-preferences`,
      {
        method: 'GET',
        headers: headers,
      },
    );

    if (!foodPreferencesResponse.ok) {
      throw new Error('Food preferences fetch failed');
    }

    foodPreferences = await foodPreferencesResponse.json();
  } catch (e) {
    console.log(e);
  }

  return {
    props: {
      data,
      foodPreferences: foodPreferences.data,
    },
  };
}
