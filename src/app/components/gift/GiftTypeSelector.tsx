// import Link from "next/link";
// import Image from "next/image";

// interface GiftTypeSelectorProps {
//   title: string;
//   description: string;
//   linkTo: string;
//   imgSrc: string;
// }

// export function GiftTypeSelector({
//   title,
//   description,
//   linkTo,
//   imgSrc,
// }: GiftTypeSelectorProps) {
//   return (
//     <div className="flex-1 hover:scale-101 transition-transform duration-300">
//       <div className="bg-white rounded-2xl overflow-hidden hover:shadow-lg shadow-[#8B7355] transition-shadow duration-300">
//         <div className="bg-gray-100 overflow-hidden h-64 rounded-t-2xl">
//           <Image src={imgSrc} alt={title} width={500} height={300} />
//         </div>
//         <div className="bg-[#F9F6F1] p-8 pt-14 pb-12 rounded-b-2xl">
//           <h2 className="text-xl text-[#8B7355] tracking-widest mb-4">
//             {title}
//           </h2>
//           <p className="text-gray-600 mb-6">{description}</p>
//           <Link
//             href={linkTo}
//             className="bg-[#BFA78A] text-white py-3 px-10 mt-4 tracking-widest inline-block hover:scale-105 transition-transform duration-300 ">
//             CUSTOMISE NOW
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

import Link from "next/link";
import Image from "next/image";

interface GiftTypeSelectorProps {
  title: string;
  description: string;
  linkTo: string;
  imgSrc: string;
}

export function GiftTypeSelector({
  title,
  description,
  linkTo,
  imgSrc,
}: GiftTypeSelectorProps) {
  return (
    <div className="w-full max-w-md mx-auto flex-1 hover:scale-101 transition-transform duration-300">
      {/* Added max-w-md and mx-auto for better mobile stacking */}
      <div className="bg-white  overflow-hidden hover:shadow-lg shadow-[#8B7355] transition-shadow duration-300">
        <div className="bg-gray-100 overflow-hidden h-56 sm:h-64 md:h-72 relative">
          {/* Responsive height, added relative for Image fill */}
          <Image
            src={imgSrc}
            alt={title}
            layout="fill" // Use layout="fill" for responsive images
            objectFit="cover" // Ensure image covers the area
            className="transition-transform duration-300" // Keep original transition
          />
        </div>
        <div className="bg-[#F9F6F1] p-6 px-8">
          {/* Responsive padding */}
          <h2 className="text-lg sm:text-xl md:text-2xl text-[#8B7355] tracking-widest pb-2 border-b-2 border-[#8B7355]/20">
            {/* Responsive text size */}
            {title}
          </h2>
          <p className="text-gray-600 mb-2 text-sm sm:text-base mt-2">
            {/* Responsive text size */}
            {description}
          </p>
          <div className="text-center">
            <Link
              href={linkTo}
              className="bg-[#BFA78A]  text-white py-2.5 px-6 sm:py-3 sm:px-6 mt-3 sm:mt-4 tracking-widest inline-block hover:scale-105 transition-transform duration-300 text-sm sm:text-base">
              {" "}
              {/* Responsive padding and text size */}
              CUSTOMISE NOW
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
