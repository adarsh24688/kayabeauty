import Image from "next/image";
import Link from "next/link"; // Import Link

interface TreatmentCardProps {
  title: string;
  description: string;
  details: string[];
  price: number;
  imgSrc: string;
}

export function TreatmentCard({
  title,
  description,
  details,
  price,
  imgSrc,
}: TreatmentCardProps) {
  // Create a URL-friendly slug from the title
  const treatmentSlug = title
    .toLowerCase()
    .replace(/ & /g, " ")
    .replace(/\s+/g, "-");

  return (
    <div className="bg-[#EBE5D6] text-left rounded-2xl hover:shadow-lg hover:scale-101 shadow-[#8B7355] transition-transform duration-300">
      <Image
        src={imgSrc}
        alt={title}
        width={400}
        height={250}
        className="w-full"
      />
      <div className="p-6">
        <h3 className="text-xl text-[#8B7355] tracking-wider mb-2">{title}</h3>
        <p className="text-gray-600 italic mb-4">{description}</p>
        <ul className="text-gray-700 space-y-1 mb-4">
          {details.map((detail, i) => (
            <li key={i}>• {detail}</li>
          ))}
        </ul>
        <div className="text-lg font-bold text-[#8B7355] mb-4">
          FROM €{price}
        </div>
        {/* Updated Button to be a Link */}
        <Link
          href={`/gifts/select-your-treatment-or-package/${treatmentSlug}`}
          className="bg-[#BFA78A] text-white w-full py-3 tracking-widest text-center inline-block hover:scale-101 transition-transform duration-300">
          CUSTOMISE NOW
        </Link>
      </div>
    </div>
  );
}
