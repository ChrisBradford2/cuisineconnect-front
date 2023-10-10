import Image from 'next/image';
import Link from 'next/link';
import Markdown from 'react-markdown'
import formatDate from '@/lib/formatDate';

export default function Recipe(recipe: any) {

  console.log(recipe);
  return (
    <>
      <main className="min-h-screen my-8">
        <div className="flex justify-around container mx-auto px-4">
          <div className="flex flex-col justify-center">
            <Link href="/recipes" className="text-green-700 hover:text-green-500 transition-all duration-150 mb-4">
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
              <h1 className="text-3xl font-bold text-gray-800 md:text-5xl mb-4">
                {recipe.recipe.attributes.title}
              </h1>
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
                      href="/recipes/pates" // @TODO: Change this to the correct link
                      className="text-green-700 hover:text-green-500 transition-all duration-150"
                      key={category.id}
                    >
                      {category.attributes.name}
                    </Link>
                  )
                )}
              </p>
              <p>
                Difficulté : <b>{recipe.recipe.attributes.difficulty}</b>
              </p>
              <p>
                Convient aux :{' '}
                {recipe.recipe.attributes.food_preferences.data.map(
                  (food_preference: any) => (
                    <Link
                      href="/recipes/pates" // @TODO: Change this to the correct link
                      className="text-green-700 hover:text-green-500 transition-all duration-150"
                      key={food_preference.id}
                    >
                      {food_preference.attributes.name}
                    </Link>
                  )
                ).reduce((prev: any, curr: any) => [prev, ', ', curr])}
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
                {recipe.recipe.attributes.ingredients.map(
                  (ingredient: any) => (
                    <li className="text-base" key={ingredient.id}>
                      {ingredient.name} : {ingredient.quantity}
                    </li>
                  )
                )}
              </ul>
            </div>
            <div className="flex flex-col justify-start col-span-2">
              <h2 className="text-2xl font-bold text-green-700 md:text-4xl mb-4">
                Recette
              </h2>
              <Markdown>
                {recipe.recipe.attributes.recipe}
              </Markdown>
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
              <div className="flex flex-col justify-center mb-4 rounded-xl p-4 bg-green-200" key={comment.id}>
                <div className="flex flex-row justify-between">
                  <div className="flex flex-col justify-center">
                    <p className="text-lg font-bold">{comment.attributes.users_permissions_user.data.attributes.username}</p>
                    <p className="text-sm text-gray-500">{formatDate(comment.attributes.createdAt)}</p>
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-sm text-gray-500">Note : {comment.attributes.note}/5</p>
                  </div>
                </div>
                <p className="text-base">
                  {comment.attributes.content}
                </p>
              </div>
            ))}
            </div>
          </div>
      </main>
    </>
  );
}


export async function getServerSideProps(context: any) {
  // Fetch data from external API with auth token
  const { slug } = context.params;
  const res = await fetch(`http://localhost:1337/api/dishes/1?populate=image&populate=categories&populate=food_preferences&populate=comments.users_permissions_user&populate=ingredients`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_KEY}`,
    },
  });
  const recipe = await res.json();

  console.log(recipe);

  return {
    props: {
      recipe: recipe.data,
    },
  };
}
