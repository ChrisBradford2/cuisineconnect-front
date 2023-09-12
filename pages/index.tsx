import { Inter } from 'next/font/google'
import Head from 'next/head';
import OpenAI from "openai";

const inter = Inter({ subsets: ['latin'] })

interface UserData {
  name: string;
}

interface HomeProps {
  data: UserData;
}

export default function Home({ data, completionData }: any) {
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
        <h2 className="text-2xl text-center">
          Voici une blague : {completionData.joke}
        </h2>
      </main>
    </>
  )
}

// Fetch data from internal API
export async function getServerSideProps() {
  const response = await fetch('http://localhost:3000/api/hello')
  const completion = await fetch('http://localhost:3000/api/completion')
  const data = await response.json()
  const completionData = await completion.json()
  console.log(data)
  console.log(completionData)
  return {
    props: {
      data,
      completionData
    }
  }
}
