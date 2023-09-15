import Highlight from "@/src/components/Highlight";
import Head from "next/head";
import Link from "next/link";

export default function Recipe() {
  return (
    <>
      <Head>
        <title>Cuisine Connecté</title>
        <meta name="description" content="Cuisine Connecté" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col items-center min-h-screen">
        <h1 className="text-3xl font-bold text-gray-800 md:text-5xl">Liste des recettes</h1>
        {/* Recipe list */}
        <section className="relative flex flex-col items-center justify-center w-full py-16">
          <div className="container flex flex-col items-center justify-center">
            <div className="flex items-center mt-8 w-full justify-evenly">
              <Link href="/recipe/1" >
                <Highlight image="/pates.jpg" alt="Plat de pâtes" title="Pâtes" />
              </Link>
              <Link href="/recipe/2">
                <Highlight image="/salade.jpg" alt="Plat de salade" title="Salades" />
              </Link>
              <Link href="/recipe/3">
                <Highlight image="/dessert.jpg" alt="Présentation de Tiramistu" title="Desserts" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}