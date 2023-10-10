import { getSession, useSession } from "next-auth/react"
import Head from "next/head";
import Link from "next/link";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";

export default function Profile ({ data }: any) {
  const session = useSession();

  useEffect(() => {
    if (localStorage.getItem('profileUpdated')) {
      toast.success('Profil mis à jour avec succès!');
      localStorage.removeItem('profileUpdated');
    }
  }, []);

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
            <div className="container flex flex-col items-center justify-center">
              <div className="flex items-center mt-8 w-full justify-evenly">
                <div className="flex flex-col items-center justify-center w-full h-full p-10 mx-auto my-0 text-center bg-white rounded-lg shadow-2xl md:my-32 md:w-1/2">
                  <h1 className="text-3xl font-bold text-gray-800 md:text-5xl">{session.data.username}</h1>
                  <p className="mt-2 text-sm text-gray-500 md:text-base">Email: {session.data?.user?.email}</p>
                  {
                    data?.food_preferences?.length > 0 ? (
                      <p className="mt-2 text-sm text-gray-500 md:text-base">
                        Food preference: {data.food_preferences.map((fp: any) => fp.name).join(', ')}
                      </p>
                    ) : (
                      <p className="mt-2 text-sm text-gray-500 md:text-base">
                        Pas de préférence
                      </p>
                    )
                  }
                  <Link className="px-2 py-1 mt-4 text-green-700 font-medium tracking-wide rounded-md hover:bg-green-100 hover:text-gray-700 transition-all duration-150" href="/profile/edit">Modifier le profil</Link>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
      <ToastContainer />
    </>
  )
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  console.log('session')
  console.log(session)

  const headers = {
    "Authorization": `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_KEY}`,
    'Content-Type': 'application/json',
  };

  let data;

  try {
    const profileResponse = await fetch(`http://localhost:1337/api/users/1?populate=food_preferences`, {
      method: 'GET',
      headers: headers,
    });

    if (!profileResponse.ok) {
      throw new Error('Profile fetch failed');
    }

    data = await profileResponse.json();
  } catch (e) {
    console.log(e);
  }

  return {
    props: {
      data
    },
  }
}
