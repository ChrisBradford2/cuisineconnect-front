import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { search } from '@/src/utils';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Recipe() {
  const [error, setError] = useState<unknown | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPairing, setIsLoadingPairing] = useState(false);
  const [isLoadingShoppingList, setIsLoadingShoppingList] = useState(false);
  const [description, setDescription] = useState<string | null>(null);
  const [fetching, setFetching] = useState(false);
  const [pairings, setPairings] = useState<string[]>([]);
  const [shoppingList, setShoppingList] = useState<string[]>([]);
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

  const fetchShoppingList = () => {
    if (typeof recipe === 'string') {
      setIsLoadingShoppingList(true);
      search(
        "Donne-moi la liste d'épicerie pour la recette suivante, avec le poind en gramme si applicable, sinon en nombre. Pas la peine d'écrire le titre, mets seulement les étapes, commences avec un <ul> tag.",
        String(recipe),
        1000,
      )
        .then((value: string) => setShoppingList([value]))
        .catch(setError)
        .finally(() => {
          setIsLoadingShoppingList(false);
        });
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shoppingList.join('\n'));
    console.log('copied to clipboard');
    toast.success('Liste d\'épicerie copiée dans le presse-papier');
  }

  function stripHtml(html: string) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  }

  const cleanShoppingListText = shoppingList.map(item => stripHtml(item)).join('\n');
  const title = `Voici ma liste de courses pour le plat ${recipe}`;
  const mailtoLink = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(cleanShoppingListText)}`;
  const twitterLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title + ':\n' + cleanShoppingListText + '\n\nEnvoyé avec <3 par Cuisine Connecté')}`;

  return (
    <>
      <Head>
        <title>{recipe} | Cuisine Connecté</title>
        <meta name="description" content="Cuisine Connecté" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center min-h-screen">
        <h2 className="text-xl font-semibold">Recette de : {recipe}</h2>
        <div>
          {error !== null && <div>Désolé, je n&rsquo;ai rien à proposer...</div>}
          {isLoading && <div>Je cherche une recette...</div>}
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
                    <div>Je cherche des accompagnements...</div>
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
              {shoppingList.length === 0 && (
                <button
                  onClick={fetchShoppingList}
                  className={`my-4 p-2 bg-blue-500 text-white rounded ${
                    shoppingList.length > 0 ? 'hidden' : ''
                  }`}
                >
                  Trouver la liste d'épicerie
                </button>
              )}
              {shoppingList && (
                <div>
                  {isLoadingShoppingList && (
                    <div>Je cherche la liste d'épicerie...</div>
                  )}
                  {shoppingList.map((item) => (
                    <div key={item}>
                      <h3 className="text-xl font-semibold mt-8">
                        Liste d'épicerie
                      </h3>
                      <div dangerouslySetInnerHTML={{ __html: item }} />
                      <div>
                        <h4 className="text-xl font-semibold mt-8">
                          Partagez votre liste d'épicerie
                        </h4>
                        <div className='flex gap-4'>
                          <button
                            className="my-4 p-2 bg-blue-500 text-white rounded"
                            onClick={copyToClipboard}
                          >
                            Copier
                          </button>
                          <a
                            className="my-4 p-2 bg-blue-500 text-white rounded"
                            href={mailtoLink}
                          >
                            Envoyer par courriel
                          </a>
                          <a
                            className="my-4 p-2 bg-blue-500 text-white rounded"
                            href={twitterLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Partager sur Twitter
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        pauseOnHover={true}
      />
    </>
  );
}
