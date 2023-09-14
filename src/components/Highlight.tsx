import Image from 'next/image'

type HighlightProps = {
  image: string;
  alt: string;
  title: string;
};

export default function Highlight({ image, alt, title }: HighlightProps) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-40 h-40 overflow-hidden rounded-full shadow-lg">
        <Image
          src={image}
          className='object-cover object-center w-full h-full hover:scale-110 transform transition-all duration-500 ease-in-out'
          alt={alt}
          layout="fill"
        />
      </div>
      <h3 className="mt-4 text-lg font-medium text-center text-gray-800">{title}</h3>
    </div>
  )
}
