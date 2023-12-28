import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { search } from '@/src/utils';
import RecipeCard from '@/src/components/RecipeCard';

export async function getRecipes(content: string) {
  const query = await search(
    "Donne une liste d'idées de recettes qui correspondent à la demande de l'utilisateur en ne donnant que les titres des recettes. Suis cet exemple pour mettre en page :\n - titre de la Recette 1\n - titre de la Recette 2",
    content,
    100,
  );
  return query.split('\n').map((line) => line.replace(/ *- */g, ''));
}

export default function Recipes() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<string[]>([]);

  useEffect(() => {
    if (router.query.search) {
      const cachedRecipes = localStorage.getItem('recipes');
      if (cachedRecipes) {
        setRecipes(JSON.parse(cachedRecipes));
      } else {
        getRecipes(String(router.query.search)).then((fetchedRecipes) => {
          setRecipes(fetchedRecipes);
          localStorage.setItem('recipes', JSON.stringify(fetchedRecipes));
        });
      }
    }
  }, [router.query.search]);

  return (
    <>
      <Head>
        <title>Cuisine Connecté</title>
        <meta name="description" content="Cuisine Connecté" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center min-h-screen">
        <section className="relative w-full container grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => {
            return <RecipeCard key={recipe} title={recipe} />;
          })}
        </section>
      </main>
    </>
  );
}
