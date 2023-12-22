import Head from 'next/head';
import { useRouter } from 'next/router'


export default function Home() {
    const router = useRouter();
    const recipes = router.query.recipes;

    return (
        <>
            <Head>
                <title>Cuisine Connecté</title>
                <meta name="description" content="Cuisine Connecté" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="flex flex-col items-center min-h-screen">
                {recipes.map((place, index) => {
                    return (
                        <li key={index}>
                            <a href={`/place?place=${place}`}>{place}</a>
                        </li>
                    );
                })}
            </main>
        </>
    );
}
