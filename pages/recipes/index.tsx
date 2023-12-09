import Head from 'next/head';
import { db } from '@/services/model';
import RecipeCard from '@/src/components/RecipeCard';

type Recipe = {
  id: number;
  title: string;
  content: string;
};

type Props = {
  recipes: Recipe[];
};

export default function Recipe({ recipes }: Props) {
  return (
    <>
      <Head>
        <title>Liste des recettes - Cuisine Connecté</title>
        <meta name="description" content="Cuisine Connecté" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen container mx-auto px-4 my-8">
        <h1 className="text-3xl font-bold text-gray-800 md:text-5xl text-center mb-4">
          Liste des recettes
        </h1>

        {recipes.map((recipe) => {
          return (
            <section
              className="relative w-full container grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
              key={recipe.id}
            >
              {/*// @ts-ignore*/}
              <pre>{JSON.stringify(recipe, ' ', 2)}</pre>
              <RecipeCard
                slug={recipe.id}
                title={recipe.title}
                description={recipe.content}
                image={''}
                alt={recipe.title}
              />
            </section>
          );
        })}
      </main>
    </>
  );
}

export async function getServerSideProps() {
  const dbRecipes = await db.Recipe.findAll();

  const recipes: Recipe[] = dbRecipes.map((recipe) => ({
    id: recipe.id,
    content: recipe.content,
    title: recipe.title,
  }));

  return {
    props: {
      recipes,
    },
  };
}
