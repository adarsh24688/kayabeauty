"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Hero() {
  const [bgAttachment, setBgAttachment] = useState("scroll");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setBgAttachment("fixed");
      } else {
        setBgAttachment("scroll");
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative h-[20rem] md:h-[35rem] overflow-hidden">
      {/* Next.js Image Component */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/images/about-us/aboutus1.webp" // or use "/images/about-us/aboutus1.webp" directly
          alt="About Kaya Beauty Spa"
          fill
          className={`object-cover object-top ${
            bgAttachment === "fixed" ? "fixed" : ""
          }`}
          style={{
            objectPosition: "center",
          }}
          priority
          draggable={false}
        />
      </div>

      {/* Enhanced gradient overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-pink-900/40 z-10"
        aria-hidden="true"
      />

      {/* Decorative elements */}
      <div className="absolute top-8 left-8 w-16 h-16 bg-gradient-to-br from-[#F28C8C]/20 to-[#C59D5F]/20 rounded-full animate-pulse z-20"></div>
      <div className="absolute bottom-12 right-12 w-24 h-24 bg-gradient-to-br from-[#C59D5F]/15 to-[#F28C8C]/15 rounded-full animate-bounce z-20"></div>

      <div className="absolute inset-0 flex flex-col justify-center items-center text-white z-30">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center">
          <p className="text-base md:text-xl font-playfair italic mb-4 text-pink-100 tracking-wide">
            Enhancing Your Beauty for 20 Years
          </p>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-wider text-center font-playfair text-pink-50 drop-shadow-lg">
            ABOUT KAYA
          </h1>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1, delay: 0.5 }}
            className="w-24 h-1 bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] mx-auto mt-6 rounded-full"
          />
        </motion.div>
      </div>
    </div>
  );
}
