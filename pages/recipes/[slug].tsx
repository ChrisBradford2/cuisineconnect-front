import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AddToFavoriteSVG from '@/components/AddToFavoriteSVG';
import formatDate from '@/lib/formatDate';
import { useSession } from 'next-auth/react';
import Markdown from 'react-markdown';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GetServerSidePropsContext } from 'next';
import { RecipeData } from '@/pages/recipes/index';

async function fetchUserData(
  token: string,
  slug: string | string[] | undefined,
) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/me?populate=favorite_dishes.dish`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    const json = await response.json();
    const user_data = json.data as Record<string, any>;
    const favorite = user_data.favorite_dishes.find(
      (fav: { dish: { id: number } }) =>
        fav.dish.id === parseInt(slug as string),
    );
    const is_favorite = Boolean(favorite);
    const favorite_id = favorite ? favorite.id : null;
    return [user_data, is_favorite, favorite_id];
  } catch (error: unknown) {
    console.error(`Error fetching user data: ${error}`);
    return [null, false, null];
  }
}

// Add or remove a dish from favorites.
async function addToFavoritesRequest(
  token: string,
  id: number,
  slug: string | string[] | undefined,
  is_favorite: boolean,
  favorite_id: number | null,
) {
  const url = is_favorite
    ? `${process.env.NEXT_PUBLIC_API_URL}/api/favorite-dishes/${favorite_id}`
    : `${process.env.NEXT_PUBLIC_API_URL}/api/favorite-dishes`;
  const method = is_favorite ? 'DELETE' : 'POST';
  const data = !is_favorite
    ? {
        data: {
          users_permissions_user: id,
          dish: parseInt(slug as string),
        },
      }
    : null;
  try {
    const response = await fetch(url, {
      method,
      body: JSON.stringify(data),
      headers: { Authorization: `Bearer ${token}` },
    });
    return await response.json();
  } catch (error: unknown) {
    console.error(`Error updating favorites: ${error}`);
    return null;
  }
}

type Props = {
  recipe: { recipe: RecipeData };
};

export default function Recipe({ recipe }: Props) {
  const [isFavorite, setIsFavorite] = useState(false as boolean);
  const [favoriteId, setFavoriteId] = useState(null as number | null);
  const [userData, setUserData] = useState(null as any);

  // Use the session from next-auth
  const session = useSession();

  // Use the router from next
  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    if (session.data) {
      fetchUserData(session.data.jwt, slug)
        .then((response) => {
          setUserData(response.data);
          const favorite = response.data.favorite_dishes.find(
            (fav: { dish: { id: number } }) =>
              fav.dish.id === parseInt(slug as string),
          );
          if (favorite) {
            setIsFavorite(true);
            setFavoriteId(favorite.id);
          }
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
        });
    }
  }, [slug]);

  function addToFavorites() {
    if (session.data) {
      const url = isFavorite
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/favorite-dishes/${favoriteId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/favorite-dishes`;
      const method = isFavorite ? 'DELETE' : 'POST';

      addToFavoritesRequest(
        session.data.jwt,
        session.data.id,
        slug,
        isFavorite,
        favoriteId,
      )
        .then((response) => {
          if (method === 'POST') {
            setIsFavorite(true);
            const newFavoriteId =
              response.data && response.data.data && response.data.data.id
                ? response.data.data.id
                : null;
            setFavoriteId(newFavoriteId);
          } else {
            setIsFavorite(false);
            setFavoriteId(null);
          }
        })
        .catch((error) => {
          toast.error(error);
        });
    } else {
      toast.error(
        'Vous devez être connecté pour ajouter une recette à vos favoris',
      );
      console.error('You must be logged in to add a recipe to your favorites');
    }
  }

  return (
    <>
      <Head>
        <title>{recipe.recipe.attributes.title} | Recettes de cuisine</title>
        <meta
          name="description"
          content={recipe.recipe.attributes.description}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen my-8">
        <div className="flex justify-around container mx-auto px-4">
          <div className="flex flex-col justify-center">
            <Link
              href="/recipes"
              className="text-green-700 hover:text-green-500 transition-all duration-150 mb-4"
            >
              ← Retour
            </Link>

            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}${recipe.recipe.attributes.image.data.attributes.url}`}
              alt="avatar"
              width={500}
              height={500}
              className="rounded-xl"
            />
          </div>

          <div className="flex flex-col justify-between mt-8">
            <div className="flex flex-col justify-center">
              <div className="flex flex-row justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-800 md:text-5xl">
                  {recipe.recipe.attributes.title}
                </h1>

                {session.data && (
                  <button>
                    <input
                      type="checkbox"
                      id="checkbox"
                      checked={isFavorite}
                      onChange={addToFavorites}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="checkbox">
                      <AddToFavoriteSVG />
                    </label>
                  </button>
                )}
              </div>

              {/* Description */}
              <p className="text-base">
                {recipe.recipe.attributes.description}
              </p>
            </div>

            <div className="flex flex-col justify-center">
              <p>
                Catégorie :{' '}
                {recipe.recipe.attributes.categories.data.map(
                  (category: any) => (
                    <Link
                      href="/recipes" // @TODO: Change this to the correct link
                      className="text-green-700 hover:text-green-500 transition-all duration-150"
                      key={category.id}
                    >
                      {category.attributes.name}
                    </Link>
                  ),
                )}
              </p>

              <p>
                Difficulté : <b>{recipe.recipe.attributes.difficulty}</b>
              </p>

              <p>
                Convient aux :{' '}
                {recipe.recipe.attributes.food_preferences.data
                  .map((food_preference: any) => (
                    <Link
                      href="/recipes" // @TODO: Change this to the correct link
                      className="text-green-700 hover:text-green-500 transition-all duration-150"
                      key={food_preference.id}
                    >
                      {food_preference.attributes.name}
                    </Link>
                  ))
                  .join(',')}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-200">
          <div className="grid grid-cols-3 gap-4 mt-8 p-4 container mx-auto">
            <div className="flex flex-col justify-start col-span-1">
              <h2 className="text-2xl font-bold text-green-700 md:text-4xl mb-4">
                Ingrédients
              </h2>

              <ul className="list-disc list-inside">
                {recipe.recipe.attributes.ingredients.map((ingredient: any) => (
                  <li className="text-base" key={ingredient.id}>
                    {ingredient.name} : {ingredient.quantity}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col justify-start col-span-2">
              <h2 className="text-2xl font-bold text-green-700 md:text-4xl mb-4">
                Recette
              </h2>

              <Markdown>{recipe.recipe.attributes.recipe}</Markdown>
            </div>
          </div>
        </div>

        {/* Comments */}
        <div className="container mx-auto px-4 mt-4">
          <h2 className="text-2xl font-bold text-green-700 md:text-4xl mb-4">
            Commentaires
          </h2>

          <div className="flex flex-col justify-center">
            {recipe.recipe.attributes.comments.data.map((comment: any) => (
              <div
                className="flex flex-col justify-center mb-4 rounded-xl p-4 bg-green-200"
                key={comment.id}
              >
                <div className="flex flex-row justify-between">
                  <div className="flex flex-col justify-center">
                    <p className="text-lg font-bold">
                      {
                        comment.attributes.users_permissions_user.data
                          .attributes.username
                      }
                    </p>

                    <p className="text-sm text-gray-500">
                      {formatDate(comment.attributes.createdAt)}
                    </p>
                  </div>

                  <div className="flex flex-col justify-center">
                    <p className="text-sm text-gray-500">
                      Note : {comment.attributes.note}/5
                    </p>
                  </div>
                </div>

                <p className="text-base">{comment.attributes.content}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // Fetch data from external API with auth token
  const slug = String(context.params?.slug);

  const res = await fetch(
    `${process.env.NEXT_APP_API_BASE}/dishes/1?populate=image&populate=categories&populate=food_preferences&populate=comments.users_permissions_user&populate=ingredients`,
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
      recipe: recipe.data,
    },
  };
}
