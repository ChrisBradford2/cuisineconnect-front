import Link from 'next/link'
import Image from 'next/image';

export default function RecipeCard ({ name, image, slug }: any) {
  return (
    <Link href={`/recipe/${slug}`}>
      <div className="flex flex-col items-center justify-center w-full h-full p-10 mx-auto my-0 text-center bg-white rounded-lg shadow-2xl md:my-32 md:w-1/2 cursor-pointer">
        <h1 className="text-3xl font-bold text-gray-800 md:text-5xl">{name}</h1>
        <Image className="object-cover object-center w-full h-full" src={image} alt={name} layout="fill" />
      </div>
    </Link>
  )
}
