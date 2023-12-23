import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { search } from '@/src/utils';

export default function Recipe() {
  const [error, setError] = useState<unknown | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [detailledRecipe, setAbout] = useState<string | null>(null);
  const [fetching, setFetching] = useState(false);
  const router = useRouter();
  const { recipe } = router.query;

  useEffect(() => {
    setFetching(typeof recipe === 'string');
    if (
      !fetching &&
      detailledRecipe === null &&
      error === null &&
      !isLoading &&
      typeof recipe === 'string'
    ) {
      setIsLoading(true);
      search(
        "Ecris les étapes d'une recette en utilisant le titre de recette suivant en format HTML, pas la peine d'écrire le titre, mets seulement les étapes, commences avec un <p> tag.",
        String(recipe),
        1000,
      )
        .then(setAbout)
        .catch((err) => {
          setError(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [recipe]);

  return (
    <>
      <Head>
        <title>Cuisine Connecté</title>
        <meta name="description" content="Cuisine Connecté" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center min-h-screen">
        <h2>Recette de : {recipe}</h2>
        <div>
          {error !== null && <div>Désolé, je n&rsquo;ai rien à proposer…</div>}
          {isLoading && <div>Je cherche une recette…</div>}
          {detailledRecipe !== null && (
            <div dangerouslySetInnerHTML={{ __html: detailledRecipe }} />
          )}
        </div>
      </main>
    </>
  );
}
