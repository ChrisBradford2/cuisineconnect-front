import { signOut, useSession } from 'next-auth/react';
import { Inter } from 'next/font/google'
import Head from 'next/head';

const inter = Inter({ subsets: ['latin'] })

interface UserData {
  name: string;
}

interface HomeProps {
  data: UserData;
}

export default function Home({ data, completionData }: any) {
  const session = useSession();
  return (
    <>
      <Head>
        <title>Cuisine Connecté</title>
        <meta name="description" content="Cuisine Connecté" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        className={`min-h-screen p-24 ${inter.className}`}
      >
        <h1 className="text-6xl font-bold text-center mb-6">
          Welcome to Cuisine Connecté&nbsp;!
        </h1>
        {session && session.data ? (
          <>
            <p className="text-2xl text-center">
              Signed in as {session?.data?.user?.email} <br />
            </p>
            <div className='text-2xl text-center mt-6'>
              <button className='text-green-700 font-bold' onClick={() => signOut()}>Logout</button>
            </div>
          </>
        ) : (
          <p className="text-2xl text-center">Pas encore connecté ? <a href="/login" className='text-green-700 font-bold'>Connectez-vous</a></p>
        )}
      </main>
    </>
  )
}

// Fetch data from internal API
export async function getServerSideProps() {
  const response = await fetch('http://localhost:3000/api/hello')
  const data = await response.json()
  return {
    props: {
      data
    }
  }
}
