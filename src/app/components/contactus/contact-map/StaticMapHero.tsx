"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FaMapMarkerAlt } from "react-icons/fa";
import locationMap from "@/assets/kayaa-home/location.jpg";
export default function StaticMapHero() {
  return (
    <>
      <div className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden bg-gradient-to-br from-pink-100 to-purple-100">
        {/* Enhanced Background */}
        <div className="absolute inset-0">
          <Image
            src={locationMap}
            alt="Kaya Beauty Spa Location Map"
            width={1920}
            height={1080}
            className="h-full w-full object-cover opacity-80"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-pink-900/20"></div>
        </div>

        {/* Animated Location Icons */}
        <motion.div
          className="absolute top-1/3 left-1/4 transform -translate-x-1/2 -translate-y-1/2 "
          animate={{
            y: [0, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}>
          <div className="relative">
            <FaMapMarkerAlt className="text-[#F28C8C] text-4xl md:text-5xl drop-shadow-lg" />
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
              <span className="text-xs font-medium text-[#B11C5F] whitespace-nowrap">
                Main Location
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="absolute top-1/2 right-1/3 transform translate-x-1/2 -translate-y-1/2"
          animate={{
            y: [0, -8, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}>
          <div className="relative">
            <FaMapMarkerAlt className="text-[#C59D5F] text-3xl md:text-4xl drop-shadow-lg" />
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
              <span className="text-xs font-medium text-[#B11C5F] whitespace-nowrap">
                Nearby Parking
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 translate-y-1/2"
          animate={{
            y: [0, -12, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}>
          <div className="relative">
            <FaMapMarkerAlt className="text-[#B11C5F] text-5xl md:text-6xl drop-shadow-lg" />
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
              <span className="text-xs font-medium text-[#B11C5F] whitespace-nowrap">
                Kaya Beauty Spa
              </span>
            </div>
          </div>
        </motion.div>

        {/* Hero Content */}
        <div className="absolute inset-0 flex mt-3 justify-center z-10 pt-24">
          <motion.div
            className="text-center text-black h-48 p-4 shadow-black/20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}>
            <h1 className="bg-pink-50 p-2 text-2xl sm:text-4xl md:text-5xl font-bold font-playfair text-gray-900  drop-shadow-lg">
              FIND KAYA BEAUTY SPA
            </h1>

            <p className="bg-pink-50 p-2 text-lg font-extrabold text-gray-900 max-w-2xl mx-auto">
              92 Highland Ave, Somerville, MA 02143
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
}
