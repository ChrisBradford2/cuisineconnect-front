import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { search } from '@/src/utils';

export default function Recipe() {
  const [error, setError] = useState<unknown | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPairing, setIsLoadingPairing] = useState(false);
  const [description, setDescription] = useState<string | null>(null);
  const [fetching, setFetching] = useState(false);
  const [pairings, setPairings] = useState<string[]>([]);
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

  const fetchPairings = () => {
    if (typeof recipe === 'string') {
      setIsLoadingPairing(true);
      search(
        "Donne-moi des suggestions d'accompagnements pour la recette suivante. Inclure des options comme des vins, des desserts et des fromages qui se marieraient bien avec. Pas la peine d'écrire le titre, mets seulement les étapes, commences avec un <ul> tag.",
        String(recipe),
        1000,
      )
        .then((value: string) => setPairings([value]))
        .catch(setError)
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

      <main className="flex flex-col items-center min-h-screen">
        <h2 className="text-xl font-semibold">Recette de : {recipe}</h2>
        <div>
          {error !== null && <div>Désolé, je n&rsquo;ai rien à proposer…</div>}
          {isLoading && <div>Je cherche une recette…</div>}
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
                    <>
                      <h3 className="text-xl font-semibold mt-8">
                        Accompagnements
                      </h3>
                      <div dangerouslySetInnerHTML={{ __html: pairing }} />
                    </>
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
