import Link from 'next/link';
import Image from 'next/image';

type Props = {
  slug: number;
  title: string;
  description: string;
  image: string;
  alt: string;
  category: string[];
  food_preferences: string[];
};

export default function RecipeCard({
  slug,
  title,
  description,
  image,
  alt,
  category,
  food_preferences,
}: Props) {
  return (
    <div className="sm:max-w-md w-full mt-4 bg-white shadow-lg rounded-lg overflow-hidden">
      <Link href={`/recipes/${slug}`}>
        <Image
          className="w-full h-56 object-cover object-center hover:scale-110 transition-all duration-200"
          src={`${process.env.NEXT_PUBLIC_API_URL}${image}`}
          alt={alt}
          width={150}
          height={150}
        />
      </Link>

      <div className="p-4">
        <Link href={`/recipes/${slug}`}>
          <h1 className="text-xl font-semibold">{title}</h1>
        </Link>

        <p className="text-gray-600 mt-2 truncate">{description}</p>

        <div className="mt-3 flex items-center space-x-2">
          <Link
            href={'/'}
            className="text-sm bg-blue-200 text-blue-800 py-1 px-2 rounded-full"
          >
            {category}
          </Link>

          {food_preferences.map((food_preference: string) => (
            <Link
              href={'/'}
              className="text-sm bg-green-200 text-green-800 py-1 px-2 rounded-full"
              key={food_preference}
            >
              {food_preference}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
