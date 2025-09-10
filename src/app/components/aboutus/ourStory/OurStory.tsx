"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import OwnerImg from "@/assets/kayaa-home/team.png"; // Update this path to your actual image

export default function OurStory() {
  return (
    <div className="py-16 bg-gradient-to-br from-[#fefaf4] to-pink-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-[#F28C8C]/10 to-[#C59D5F]/10 rounded-full animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-[#C59D5F]/8 to-[#F28C8C]/8 rounded-full animate-float-slow"></div>

      {/* Decorative Journey Text - Absolute positioned in background */}
      <motion.div
        className="absolute -top-4 left-0 pointer-events-none z-0"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}>
        <div
          className="
             xs:text-[6rem] sm:text-[2rem] md:text-[6rem] lg:text-[10rem] xl:text-[14rem]
            font-light text-[#c59d5f] italic
            select-none pointer-events-none
            leading-none
            whitespace-nowrap
            opacity-25
            drop-shadow-sm
          "
          style={{ fontFamily: "Quentinregular, cursive" }}>
          Journey
        </div>
      </motion.div>

      {/* Meet Anita Section */}
      <section className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left side - Anita's Photo */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="relative">
            <div className="relative overflow-hidden rounded-lg shadow-2xl">
              <Image
                src={OwnerImg}
                alt="Anita - Owner of Kaya Beauty Spa"
                width={600}
                height={700}
                className="w-full h-[700px] object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#C59D5F]/20 to-transparent"></div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-br from-[#F28C8C] to-[#C59D5F] rounded-full opacity-20"></div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-[#C59D5F] to-[#F28C8C] rounded-full opacity-15"></div>
          </motion.div>

          {/* Right side - About Anita */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="space-y-6">
            <div className="text-xl font-lato text-[#C59D5F] font-bold mb-2 tracking-widest">
              MEET ANITA
            </div>

            <h2 className="text-5xl font-playfair font-bold text-[#B11C5F] leading-tight mb-8">
              Owner & Master Cosmetologist
            </h2>

            <div className="space-y-6 text-lg text-[#444] font-lato leading-relaxed">
              <p>
                Hello, I'm Anita, the owner of Kaya Beauty Spa. I am originally
                from Punjab, northern India, a region renowned for its friendly
                and open-hearted people.
              </p>

              <p>
                From a young age, I was captivated by beauty, my passion for
                beauty, especially Ayurvedic and holistic skin care, never
                waned.
              </p>

              <p>
                I moved to the US in 2003 and continued my journey by obtaining
                my cosmetology and instructor's licenses 20 years ago.
              </p>

              <p>
                I combine the best of my beauty training in the US with my
                Ayurvedic and holistic beauty experience from India. At Kaya
                Beauty Spa, you will experience beauty routines that reflect my
                deep-rooted passion and expertise.
              </p>

              <p className="text-[#B11C5F] font-semibold">
                There is nothing I enjoy more than caring for my clients and
                enhancing their beauty with natural, Ayurvedic products.
              </p>
            </div>

            {/* Credentials/Highlights */}
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-md">
                <h4 className="font-playfair text-xl font-semibold text-[#B11C5F] mb-2">
                  Experience
                </h4>
                <p className="text-[#444] font-lato">
                  20+ years in cosmetology and instruction
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-md">
                <h4 className="font-playfair text-xl font-semibold text-[#B11C5F] mb-2">
                  Specialty
                </h4>
                <p className="text-[#444] font-lato">
                  Ayurvedic and holistic beauty care
                </p>
              </div>
            </div>

            <div className="pt-6">
              <button className="bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] text-white px-8 py-4 rounded-full font-lato font-medium tracking-wide hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                Book Consultation with Anita
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
