import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { search } from '@/src/utils';

export default function Recipe() {
  const [error, setError] = useState<unknown | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState<string | null>(null);
  const [fetching, setFetching] = useState(false);
  const router = useRouter();
  const { recipe } = router.query;

  useEffect(() => {
    setFetching(typeof recipe === 'string');
    if (
      !fetching &&
      description === null &&
      error === null &&
      !isLoading &&
      typeof recipe === 'string'
    ) {
      setIsLoading(true);
      search(
        "Écris les étapes d'une recette en utilisant le titre de recette suivant en format HTML, pas la peine d'écrire le titre, mets seulement les étapes, commences avec un <p> tag.",
        String(recipe),
        1000,
      )
        .then((description) => {
          setError(null);
          setDescription(description);
        })
        .catch(setError)
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
        <h2 className="text-xl font-semibold">Recette de : {recipe}</h2>
        <div>
          {error !== null && <div>Désolé, je n&rsquo;ai rien à proposer…</div>}
          {isLoading && <div>Je cherche une recette…</div>}
          {description !== null && (
            <div dangerouslySetInnerHTML={{ __html: description }} />
          )}
        </div>
      </main>
    </>
  );
}
