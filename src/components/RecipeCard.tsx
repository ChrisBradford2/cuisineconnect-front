import Link from 'next/link';
import Image from 'next/image';

type Props = {
  slug: number;
  title: string;
  description: string;
  image: string;
  alt: string;
};

export default function RecipeCard({
  slug,
  title,
  description,
  image,
  alt,
}: Props) {
  return (
    <div className="sm:max-w-md w-full mt-4 bg-white shadow-lg rounded-lg overflow-hidden">
      <Link href={`/recipes/${slug}`}>
        <Image
          className="w-full h-56 object-cover object-center hover:scale-110 transition-all duration-200"
          src={image}
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
      </div>
    </div>
  );
}
