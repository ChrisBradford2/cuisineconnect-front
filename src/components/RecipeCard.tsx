import Link from 'next/link';

type Props = {
  title: string;
};

export default function RecipeCard({ title }: Props) {
  return (
    <div className="sm:max-w-md w-full mt-4 bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-4">
        <Link href={`/recipe?recipe=${title}`}>
          <h1 className="text-xl font-semibold">{title}</h1>
        </Link>
      </div>
    </div>
  );
}
