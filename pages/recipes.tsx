import Head from 'next/head';
import RecipeCard from '@/src/components/RecipeCard';
import { GetServerSidePropsContext } from 'next';
import getCompletion from '@/src/getCompletion';
import { useLanguage } from '@/src/contexts/LanguageContext';

type Props = {
  recipes: string[];
};

export default function Recipes({ recipes }: Props) {
  return (
    <>
      <Head>
        <title>Cuisine Connecté</title>
        <meta name="description" content="Cuisine Connecté" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center h-full">
        <section className="relative w-full container grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => {
            return <RecipeCard key={recipe} title={recipe} />;
          })}
        </section>
      </main>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const search = context.query.search;
  const { lang } = useLanguage();

  if (!search) {
    return {
      notFound: true,
    };
  }

  const query = await getCompletion(
    [
      {
        role: 'system',
        content:
          `Donne une liste d'idées de recettes qui correspondent à la demande de l'utilisateur en ne donnant que les titres des recettes et en langue ${lang}. Suis cet exemple pour mettre en page :\n - titre de la Recette 1\n - titre de la Recette 2`,
      },
      { role: 'user', content: String(search) },
    ],
    100,
  );

  const recipes = query.split('\n').map((line) => line.replace(/ *- */g, ''));

  return {
    props: {
      recipes,
    },
  };
}
