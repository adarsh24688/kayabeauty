"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiHeart, FiMail } from "react-icons/fi";

export default function Newsletter() {
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
    <div className="relative py-20 md:py-32 bg-gray-900 text-white overflow-hidden">
      {/* Enhanced Background Image */}
      <div
        className="absolute inset-0 w-full h-full opacity-40"
        style={{
          backgroundImage: "url('/images/about-us/aboutus2.webp')",
          backgroundSize: "cover",
          backgroundAttachment: bgAttachment,
          backgroundPosition: "center",
        }}
        aria-hidden="true"
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-pink-900/60 to-purple-900/60 z-5"
        aria-hidden="true"
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-2 h-2 bg-pink-300 opacity-30 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-white opacity-40 rounded-full animate-bounce"></div>
        <div className="absolute bottom-32 left-40 w-1.5 h-1.5 bg-pink-200 opacity-50 rounded-full animate-pulse"></div>
      </div>

      {/* Enhanced Content */}
      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <FiHeart className="text-pink-300 text-xl animate-pulse" />
            <p className="text-sm md:text-md uppercase tracking-wider font-medium text-pink-200">
              STAY BEAUTIFUL WITH US
            </p>
            <FiHeart className="text-pink-300 text-xl animate-pulse" />
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-playfair font-bold mb-4 leading-tight">
            Get Exclusive Beauty Tips & Special Offers
          </h2>

          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Subscribe to receive Ayurvedic beauty secrets, seasonal discounts on
            our holistic treatments, and early access to new services at Kaya
            Beauty Spa
          </p>

          <motion.form
            className="max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2 border border-white/20">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-0">
                <div className="flex-1 relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    className="w-full pl-12 pr-4 py-3 bg-white text-gray-800 rounded-xl sm:rounded-l-xl sm:rounded-r-none border-0 focus:ring-2 focus:ring-pink-300 placeholder-gray-500"
                    placeholder="Enter your email address"
                  />
                </div>
                <motion.button
                  type="submit"
                  className="bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] text-white px-8 py-3 uppercase font-semibold rounded-xl sm:rounded-r-xl sm:rounded-l-none hover:shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}>
                  Subscribe
                </motion.button>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              * We respect your privacy. Unsubscribe at any time.
            </p>
          </motion.form>
        </motion.div>
      </div>
    </div>
  );
}
