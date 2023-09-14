import Highlight from '@/src/components/Highlight';
import { useSession } from 'next-auth/react';
import { Inter } from 'next/font/google'
import Head from 'next/head';
import { getAllRecipes } from '@/services/firebaseQuery';
import Image from 'next/image';

const inter = Inter({ subsets: ['latin'] })

interface UserData {
  name: string;
}

interface HomeProps {
  data: UserData;
}

export default function Home({ data }: HomeProps) {
  const session = useSession();
  console.log(data);
  return (
    <>
      <Head>
        <title>Cuisine Connecté</title>
        <meta name="description" content="Cuisine Connecté" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col items-center min-h-screen">
        {/* Hero image */}
        <section className="relative flex flex-col items-center justify-center w-full bg-gray-100">
          <div className="absolute inset-0 z-0 w-full h-full bg-gray-100">
            <Image className="object-cover object-center w-full h-full" src="https://as2.ftcdn.net/v2/jpg/01/92/00/85/1000_F_192008586_6VI1Y9joXyCGDgonO9DJbyHE8bzrBDM7.jpg" alt="hero" />
            <div className="absolute inset-0 z-10 w-full h-full bg-black opacity-25"></div>
          </div>
          <div className="relative z-10 flex flex-col items-center justify-center w-full h-full p-10 mx-auto my-0 text-center bg-white rounded-lg shadow-2xl md:my-32 md:w-1/2">
            <h1 className="text-3xl font-bold text-gray-800 md:text-5xl">Cuisine Connecté</h1>
            <p className="mt-2 text-sm text-gray-500 md:text-base">Cuisine Connecté est une application web qui vous permet de gérer vos recettes de cuisine.</p>
            <button className="px-4 py-2 mt-6 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-green-700 rounded-md hover:bg-green-600 focus:outline-none focus:bg-green-600">Découvrir</button>
          </div>
        </section>
        {/* Features section */}
        <section className="relative flex flex-col items-center justify-center w-full py-16">
          <div className="container flex flex-col items-center justify-center">
            <h2 className="text-3xl font-bold text-center text-green-700 md:text-5xl">Lumière sur nos recettes</h2>
            <div className="flex items-center mt-8 w-full justify-evenly">
              <Highlight image="/1000_F_241536600_Rp4ZGcBPRFvwZ19EwoLWIQzZCHajNXCf.jpg" alt="highlight 1" title="Pâtes" />
              <Highlight image="/1000_F_305246337_SiOYQlIkOSA1Zv9lcksEFVxOS5YhFNdY.jpg" alt="highlight 2" title="Salades" />
              <Highlight image="/1000_F_261071201_ypteBc3vVrSPtd43z6O5c7tXxzHdor9c.jpg" alt="highlight 3" title="Desserts" />
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

// Fetch data from internal API
export const getServerSideProps = async (context: any) => {
  const recipes = await getAllRecipes();

  return {
    props: {
      data: recipes
    }
  }
}
