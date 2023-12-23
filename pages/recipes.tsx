import Head from 'next/head';
import { useState, useEffect } from 'react';
import Router, { useRouter } from 'next/router';
import { search } from '@/src/utils';

export async function getRecipes(content: string) {
  const query = await search(
    "Donne une liste d'idées de recettes qui correspondent à la demande de l'utilisateur en ne donnant que les titres des recettes. Suis cet exemple pour mettre en page :\n - titre de la Recette 1\n - titre de la Recette 2",
    content,
    100,
  );
  const recipes = query.split('\n').map((line) => line.replace(/ *- */g, ''));
  return recipes;
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
        <section>
          {recipes &&
            recipes.map((recipe, index) => {
              return (
                <li key={index}>
                  <a href={`/recipe?recipe=${recipe}`}>{recipe}</a>
                </li>
              );
            })}
        </section>
      </main>
    </>
  );
}
