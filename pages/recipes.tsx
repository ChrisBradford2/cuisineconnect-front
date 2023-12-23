import Head from 'next/head';
import { useState, useEffect } from 'react';  // Modification: Import de useEffect
import Router, { useRouter } from 'next/router'

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
            max_tokens: 100
        }),
    });
    const json = await response.json();
    return json.content;
}

export async function getRecipes(content: string){
    const query = await search(
        "Donne une liste d'idées de recettes qui correspondent à la demande de l'utilisateur en ne donnant que les titres des recettes. Suis cet exemple pour mettre en page :\n - titre de la Recette 1\n - titre de la Recette 2",
        content
    );
    const recipes = query.split("\n").map((line) => line.replace(/ *- */g, ""))
    return recipes
}

export default function Home() {
    const router = useRouter();
    const [recipes, setRecipes] = useState<string[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            if (router.query.content) {
                const cachedRecipes = localStorage.getItem('recipes');
                if (cachedRecipes) {
                    setRecipes(JSON.parse(cachedRecipes));
                } else {
                    const fetchedRecipes = await getRecipes(String(router.query.content));
                    setRecipes(fetchedRecipes);
                    localStorage.setItem('recipes', JSON.stringify(fetchedRecipes));
                }
            }
        };

        fetchData();
    }, [router.query.content]);

    return (
        <>
            <Head>
                <title>Cuisine Connecté</title>
                <meta name="description" content="Cuisine Connecté"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main className="flex flex-col items-center min-h-screen">
                <section>
                    {recipes && (
                        recipes.map((recipe, index)=>{
                            return (
                                <li key={index}>
                                    <a href={`/recipe?recipe=${recipe}`}>{recipe}</a>
                                </li>
                            );
                        })
                    )}
                </section>
            </main>
        </>
    );
}

