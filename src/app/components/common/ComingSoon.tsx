"use client";

import { PartyPopper, Sparkles, Heart } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface ComingSoonProps {
  isEmbedded?: boolean;
}

export default function ComingSoon({ isEmbedded = false }: ComingSoonProps) {
  const containerClasses =
    "relative flex flex-col items-center justify-center text-center px-4 sm:px-6 w-full";
  const layoutClasses = isEmbedded
    ? "py-16 sm:py-20"
    : "min-h-screen bg-gradient-to-br from-white via-pink-50 to-yellow-50 overflow-hidden";

  return (
    <div className={`${containerClasses} ${layoutClasses}`}>
      {/* Enhanced Background Effects */}
      {!isEmbedded && (
        <>
          <motion.div
            className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-gradient-to-r from-[#F28C8C]/20 to-[#C59D5F]/20 rounded-full filter blur-3xl opacity-40"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-gradient-to-l from-[#C59D5F]/20 to-[#F28C8C]/20 rounded-full filter blur-3xl opacity-40"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute top-20 left-10 w-2 h-2 bg-[#F28C8C] rounded-full opacity-60"
              animate={{
                y: [0, -20, 0],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute top-32 right-16 w-1 h-1 bg-[#C59D5F] rounded-full opacity-50"
              animate={{
                y: [0, -15, 0],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            />
          </div>
        </>
      )}

      <div className="relative z-10 flex flex-col items-center justify-center max-w-4xl">
        {/* Enhanced Icon Container */}
        <motion.div
          className="relative mb-8 sm:mb-8"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}>
          <div className="absolute inset-0 bg-gradient-to-r from-[#F28C8C]/20 to-[#C59D5F]/20 rounded-full filter blur-xl animate-pulse" />
          <div className="relative p-2 sm:p-4 bg-white/80 backdrop-blur-sm border-2 border-[#F28C8C]/30 rounded-full shadow-xl">
            <div className="flex items-center justify-center space-x-2">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}>
                <PartyPopper
                  className="text-[#B11C5F]"
                  size={20}
                  strokeWidth={1.5}
                />
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}>
                <Sparkles
                  className="text-[#F28C8C]"
                  size={20}
                  strokeWidth={1.5}
                />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Main Heading */}
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-playfair font-bold mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}>
          <span className="bg-gradient-to-r from-[#B11C5F] via-[#F28C8C] to-[#C59D5F] bg-clip-text text-transparent drop-shadow-sm">
            Coming Soon
          </span>
        </motion.h1>

        {/* Enhanced Subheading */}
        <motion.div
          className="text-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-2xl mb-4 leading-relaxed">
            We&apos;re working hard to bring you something amazing for your
            beauty journey.
          </p>
          <div className="flex items-center justify-center space-x-2 text-[#B11C5F]">
            <Heart className="w-5 h-5 animate-pulse" fill="currentColor" />
            <p className="text-sm sm:text-base font-medium">
              Stay beautiful with us, thank you for your patience!
            </p>
            <Heart className="w-5 h-5 animate-pulse" fill="currentColor" />
          </div>
        </motion.div>

        {/* Enhanced CTA Section */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}>
          <Link href="/">
            <button className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] text-white font-bold rounded-full shadow-lg hover:shadow-[#F28C8C]/40 transform hover:scale-105 transition-all duration-300 text-sm sm:text-base tracking-wide">
              Go Back Home
            </button>
          </Link>
          <Link href="/contact">
            <button className="px-6 sm:px-8 py-3 sm:py-4 bg-white/80 backdrop-blur-sm border-2 border-[#F28C8C]/30 text-[#B11C5F] font-semibold rounded-full hover:bg-[#F28C8C]/10 transform hover:scale-105 transition-all duration-300 text-sm sm:text-base">
              Contact Us
            </button>
          </Link>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          className="mt-12 sm:mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}>
          <p className="text-xs sm:text-sm text-gray-500 mb-4">
            In the meantime, explore our existing services:
          </p>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {["Facials", "Threading", "Hair Color", "Keratin"].map(
              (service, index) => (
                <span
                  key={service}
                  className="px-3 py-1 bg-white/60 backdrop-blur-sm rounded-full text-xs sm:text-sm text-[#B11C5F] border border-[#F28C8C]/20">
                  {service}
                </span>
              )
            )}
          </div>
        </motion.div>
      </div>

      {/* Enhanced Custom Styles */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-shimmer {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent
          );
          background-size: 200% 100%;
          animation: shimmer 2s ease-in-out infinite;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
        }

        .animation-delay-800 {
          animation-delay: 0.8s;
        }
      `}</style>
    </div>
  );
}
