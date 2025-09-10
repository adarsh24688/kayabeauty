import Image from "next/image";
import Link from "next/link";

interface OccasionCardProps {
  name: string;
  imgSrc: string;
}

export function OccasionCard({ name, imgSrc }: OccasionCardProps) {
  // Create a URL-friendly slug from the occasion name
  const occasionSlug = name.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="bg-[#EBE5D6] overflow-hidden  hover:shadow-lg hover:scale-101 shadow-[#8B7355] transition-transform duration-300">
      <Image
        src={imgSrc}
        alt={name}
        width={400}
        height={300}
        className="w-full"
      />
      <div className="px-4">
        <h3 className="uppercase text-xl font-semibold text-[#8B7355] py-2 tracking-wider border-b-2 border-[#8B7355]/20">
          {name}
        </h3>
        <p className="text-gray-600 my-3">
          The memorable Christmas present that will stand out among all others.
        </p>
        <div className="flex justify-center">
          <Link
            href={`/gifts/value-gifts/${occasionSlug}`}
            className="bg-[#BFA78A] my-2 text-white py-2 px-5 tracking-widest inline-block hover:scale-105 transition-transform duration-300">
            CUSTOMISE NOW
          </Link>
        </div>
      </div>
    </div>
  );
}
