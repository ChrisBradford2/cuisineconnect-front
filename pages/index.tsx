import { Inter } from 'next/font/google'
import Head from 'next/head';

const inter = Inter({ subsets: ['latin'] })

interface UserData {
  name: string;
}

interface HomeProps {
  data: UserData;
}

export default function Home({ data }: HomeProps) {
  return (
    <>
      <Head>
        <title>Cuisine Connecté</title>
        <meta name="description" content="Cuisine Connecté" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        className={`min-h-screenitems-center p-24 ${inter.className}`}
      >
        <h1 className="text-6xl font-bold text-center mb-6">
          Welcome to <a href="https://nextjs.org">Cuisine Connecté</a> !
        </h1>
        <p className="text-2xl text-center">
          Vous êtes connecté en tant que {data.name}.
        </p>
      </main>
    </>
  )
}

// Fetch data from internal API
export async function getServerSideProps() {
  const response = await fetch('http://localhost:3000/api/hello')
  const data = await response.json()
  console.log(data)
  return {
    props: {
      data
    }
  }
}
