import Head from 'next/head';
import RecipeCard from '@/src/components/RecipeCard';

interface Category {
  id: number;
  attributes: {
    name: string;
  };
}

interface FoodPreference {
  id: number;
  attributes: {
    name: string;
  };
}

interface RecipeImage {
  id: number;
  attributes: {
    url: string;
    alternativeText: string;
  };
}

export interface RecipeAttributes {
  title: string;
  description: string;
  image: {
    data: RecipeImage;
  };
  categories: {
    data: Category[];
  };
  food_preferences: {
    data: FoodPreference[];
  };
}

export interface RecipeData {
  id: number;
  attributes: RecipeAttributes;
}

interface RecipeProp {
  data: RecipeData[];
}

export default function Recipe({ recipe }: { recipe: RecipeProp }) {
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
        {recipe.data.map((recipeItem) => (
          <section
            className="relative w-full container grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            key={recipeItem.id}
          >
            <RecipeCard
              slug={recipeItem.id}
              title={recipeItem.attributes.title}
              description={recipeItem.attributes.description}
              image={recipeItem.attributes.image.data.attributes.url}
              alt={recipeItem.attributes.image.data.attributes.alternativeText}
              category={recipeItem.attributes.categories.data.map(
                (category) => category.attributes.name,
              )}
              food_preferences={recipeItem.attributes.food_preferences.data.map(
                (food_preference) => food_preference.attributes.name,
              )}
            />
          </section>
        ))}
      </main>
    </>
  );
}

export async function getServerSideProps() {
  const res = await fetch(
    `{${process.env.NEXT_PUBLIC_API_URL}/api/dishes?populate[]=image&populate[]=categories&populate[]=food_preferences`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_KEY}`,
      },
    },
  );
  const recipe = await res.json();

  return {
    props: {
      recipe,
    },
  };
}
