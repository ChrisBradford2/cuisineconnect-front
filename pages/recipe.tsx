import Head from 'next/head';
import { useState } from 'react';
import { search } from '@/src/utils';
import { GetServerSidePropsContext } from 'next';
import getCompletion from '@/src/getCompletion';

type Props = {
  recipe: string;
  description: string;
};

export default function Recipe({ recipe, description }: Props) {
  const [isLoadingPairing, setIsLoadingPairing] = useState(false);
  const [pairings, setPairings] = useState<string[]>([]);

  const fetchPairings = () => {
    if (typeof recipe === 'string') {
      setIsLoadingPairing(true);
      search(
        "Donne-moi des suggestions d'accompagnements pour la recette suivante. Inclure des options comme des vins, des desserts et des fromages qui se marieraient bien avec. Pas la peine d'écrire le titre, mets seulement les étapes, commences avec un <ul> tag.",
        recipe,
        1000,
      )
        .then((value: string) => setPairings([value]))
        .finally(() => {
          setIsLoadingPairing(false);
        });
    }
  };

  return (
    <>
      <Head>
        <title>Cuisine Connecté</title>
        <meta name="description" content="Cuisine Connecté" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center h-full">
        <h2 className="text-xl font-semibold">Recette de : {recipe}</h2>
        <div>
          {description !== null && (
            <>
              <div dangerouslySetInnerHTML={{ __html: description }} />
              {pairings.length === 0 && (
                <button
                  onClick={fetchPairings}
                  className={`my-4 p-2 bg-blue-500 text-white rounded ${
                    pairings.length > 0 ? 'hidden' : ''
                  }`}
                >
                  Trouver des accompagnements
                </button>
              )}
              {pairings && (
                <div>
                  {isLoadingPairing && (
                    <div>Je cherche des accompagnements…</div>
                  )}
                  {pairings.map((pairing) => (
                    <div key={pairing}>
                      <h3 className="text-xl font-semibold mt-8">
                        Accompagnements
                      </h3>
                      <div dangerouslySetInnerHTML={{ __html: pairing }} />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const recipe = context.query.recipe;

  if (!recipe) {
    return {
      notFound: true,
    };
  }

  const description = await getCompletion(
    [
      {
        role: 'system',
        content:
          "Écris les étapes d'une recette en utilisant le titre de recette suivant en format HTML, pas la peine d'écrire le titre, mets seulement les étapes, commences avec un <p> tag.",
      },
      { role: 'user', content: String(recipe) },
    ],
    1000,
  );

  return {
    props: {
      recipe,
      description,
    },
  };
}
