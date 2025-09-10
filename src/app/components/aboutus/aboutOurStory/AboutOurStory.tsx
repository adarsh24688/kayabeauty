"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function AboutOurStory() {
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
    <div className="relative min-h-[75vh] md:min-h-[95vh] py-16 md:py-24 overflow-hidden flex items-center">
      {/* Enhanced Background Image */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: "url('/images/about-us/aboutus3.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: bgAttachment,
          zIndex: 0,
        }}
        aria-hidden="true"
      />

      {/* Enhanced overlay with gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-white/70 via-pink-50/60 to-white/50 md:bg-gradient-to-r md:from-white/60 md:via-pink-50/40 md:to-transparent z-5"
        aria-hidden="true"
      />

      {/* Decorative elements */}
      <div className="absolute top-10 right-10 w-20 h-20 bg-gradient-to-br from-[#F28C8C]/20 to-[#C59D5F]/20 rounded-full animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-16 h-16 bg-gradient-to-br from-[#C59D5F]/15 to-[#F28C8C]/15 rounded-full animate-bounce"></div>

      {/* Enhanced Content */}
      <div className="relative max-w-6xl mx-auto px-4 md:px-6 flex flex-col items-center z-10">
        <motion.div
          className="w-full md:w-3/4 mx-auto relative flex flex-col items-center text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}>
          {/* Enhanced large script text */}
          <div
            className="absolute -top-16 -translate-x-1/2 -translate-y-1/3 select-none pointer-events-none"
            style={{
              fontFamily: "Quentinregular, cursive",
              fontSize: "clamp(1rem, 20vw, 10rem)",
              color: "#c59d5f",
              opacity: 0.25,
              zIndex: 1,
              whiteSpace: "nowrap",
              textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
            }}>
            Excellence
          </div>

          <div className="relative z-10 bg-white/30 backdrop-blur-sm p-8 md:p-12 shadow-2xl border border-pink-100 max-w-4xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}>
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] text-white text-xs md:text-sm font-medium tracking-widest mb-4 uppercase rounded-full">
                Somerville, MA • Since 2003
              </span>

              <h3 className="text-3xl md:text-4xl tracking-wide font-playfair font-bold mb-6 md:mb-8 text-[#B11C5F] leading-tight">
                Our Beauty Legacy
              </h3>

              <div className="space-y-4 text-gray-700 mb-8">
                <p className="text-base md:text-lg leading-relaxed">
                  I combine the best of my beauty training in the US with my
                  Ayurvedic and holistic beauty experience from India. At Kaya
                  Beauty Spa, you will experience beauty routines that reflect
                  my deep-rooted passion and expertise.
                </p>
                <p className="text-base md:text-lg leading-relaxed font-medium text-[#B11C5F]">
                  There is nothing I enjoy more than caring for my clients and
                  enhancing their beauty with natural, Ayurvedic products.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.button
                  className="px-8 py-3 bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] text-white font-medium rounded-full hover:shadow-lg transform transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}>
                  Book Consultation
                </motion.button>

                <button className="text-[#c59d5f] border-b border-[#c59d5f] pb-1 hover:text-[#B11C5F] hover:border-[#B11C5F] transition-all duration-300 font-medium">
                  Learn About Our Services
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
