import Head from 'next/head';
import RecipeCard from '@/src/components/RecipeCard';

export default function Recipe({ recipe }: any) {
  console.log(recipe);
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
        {/* Recipe list */}
        {recipe.data.map((recipe: any) => (
          <section
            className="relative w-full container grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            key={recipe.id}
          >
            <RecipeCard slug={recipe.id} title={recipe.attributes.title} description={recipe.attributes.description} image={recipe.attributes.image.data.attributes.url} alt={recipe.attributes.image.data.attributes.alternativeText} category={recipe.attributes.categories.data.map((category: any) => category.attributes.name) as string[] } food_preferences={recipe.attributes.food_preferences.data.map((food_preference: any) => food_preference.attributes.name) as string[] } />
          </section>
        ))}
      </main>
    </>
  );
}

export async function getServerSideProps() {
  const res = await fetch(`http://localhost:1337/api/dishes?populate[]=image&populate[]=categories&populate[]=food_preferences`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_KEY}`,
    },
  });
  const recipe = await res.json();
  console.log(recipe);

  return {
    props: {
      recipe,
    },
  };
}
