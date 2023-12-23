import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";


async function search(system: string, prompt: string): Promise<string> {
    const response = await fetch("/api/completion", {
        method: "POST",
        body: JSON.stringify({
            messages: [
                {
                    role: "system",
                    content: system,
                },
                { role: "user", content: prompt },
            ],
            max_tokens: 1000
        }),
    });
    const json = await response.json();
    return json.content;
}

export default function Home() {
    const [error, setError] = useState<unknown | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [about, setAbout] = useState<string | null>(null);
    const [fetching, setFetching] = useState(false);
    const router = useRouter();
    const { recipe } = router.query;

    useEffect(() => {
        setFetching(typeof recipe === "string");
        if (
            !fetching &&
            about === null &&
            error === null &&
            !isLoading &&
            typeof recipe === "string"
        ) {
            setIsLoading(true);
            search(
                "Ecris les étapes d'une recette en utilisant le titre de recette suivant en format HTML, pas la peine d'écrire le titre, mets seuleent les étapes, commences avec un <p> tag.",
                String(recipe),
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
                <meta name="description" content="Cuisine Connecté"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main className="flex flex-col items-center min-h-screen">
                <h2>Recette de :  {recipe}</h2>
                <div>
                    {error !== null && <div>Sorry, I havent found anything…</div>}
                    {isLoading && <div>Reading through the books…</div>}
                    {about !== null && (
                        <div dangerouslySetInnerHTML={{ __html: about }} />
                    )}
                </div>
            </main>
        </>
    );
}
