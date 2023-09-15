import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import React from "react";
import { useState } from "react";

export default function Profile ({ data, data2 }: any) {
  const session = useSession();

  const [message, setMessage] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(session.data?.username || null);
  const [email, setEmail] = useState<string | null>(session.data?.user?.email || null);
  const [selectedFood, setSelectedFood] = useState<string[]>(data?.food_preferences?.map((fp: any) => fp.id) || []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:1337/api/users/${session?.data?.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          username : username,
          email : email,
          food_preferences: selectedFood
        }),
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_KEY}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Error updating profile');
      }

      const responseData = await response.json();
      console.log('Profile updated successfully!'); // ou utilisez responseData.message ou similaire selon la réponse de votre API

    } catch (error: any) {
      setMessage(error.message);
    }
  }

  return (
    <>
      <Head>
        <title>Cuisine Connecté</title>
        <meta name="description" content="Cuisine Connecté" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col items-center min-h-screen">
        <h1 className="text-3xl font-bold text-gray-800 md:text-5xl">Profil</h1>
        {session.data && (
          // White card with user information
<section className="relative flex flex-col items-center justify-center w-full py-16">
    <form className="container flex flex-col items-center justify-center space-y-4" onSubmit={handleSubmit}>
        <input 
            type="text" 
            name="username" 
            value={username || ''}
            className="border border-gray-300 p-2 rounded w-64 focus:outline-none focus:border-blue-500" 
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
        />
        
        <input 
            type="email" 
            name="email" 
            value={email || ''}
            className="border border-gray-300 p-2 rounded w-64 focus:outline-none focus:border-blue-500" 
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
        />
        
        <select 
            name="food_preferences" 
            multiple 
            value={selectedFood}
            onChange={(e) => {
                const selectedOptions = Array.from(e.target.selectedOptions).map(o => o.value);
                setSelectedFood(selectedOptions);
            }}
            className="border border-gray-300 p-2 rounded w-64 focus:outline-none focus:border-blue-500"
        >
            {data2.map((fp: any) => (
                <option key={fp.id} value={fp.id}>{fp.attributes.name}</option>
            ))}
        </select>
        
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
    </>
  )
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  const headers = {
    "Authorization": `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_KEY}`,
    'Content-Type': 'application/json',
  };

  let data, data2;

  try {
    const profileResponse = await fetch(`http://localhost:1337/api/users/${session?.id}?populate=food_preferences`, {
      method: 'GET',
      headers: headers,
    });

    if (!profileResponse.ok) {
      throw new Error('Profile fetch failed');
    }

    data = await profileResponse.json();

    const foodPreferencesResponse = await fetch(`http://localhost:1337/api/food-preferences`, {
      method: 'GET',
      headers: headers,
    });

    if (!foodPreferencesResponse.ok) {
      throw new Error('Food preferences fetch failed');
    }

    data2 = await foodPreferencesResponse.json();
  } catch (e) {
    console.log(e);
  }

  return {
    props: {
      data,
      data2: data2.data,
    },
  }
}
