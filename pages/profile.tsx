import { getSession, useSession } from "next-auth/react"
import Head from "next/head";

export default function Profile ({ data, data2 }: any) {
  const session = useSession();
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
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  )
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  console.log('session')
  console.log(session)

  const headers = {
    "Authorization": `Bearer ${process.env.STRAPI_API_KEY}`,
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

    const foodPreferencesResponse = await fetch('http://localhost:1337/api/food-preferences', {
      method: 'GET',
      headers: headers,
    });

    if (!foodPreferencesResponse.ok) {
      throw new Error('Food preferences fetch failed');
    }

    data2 = await foodPreferencesResponse.json();
  } catch (error) {
    console.error(error);
    // Vous pouvez renvoyer une erreur ou des données par défaut ici
    return {
      props: {},
    };
  }

  return {
    props: {
      data,
      data2: data2.data,
    },
  }
}
