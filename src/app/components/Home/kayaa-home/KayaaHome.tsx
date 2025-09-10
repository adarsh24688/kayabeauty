"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";

// Image imports
import ultrasonic_facial from "@/assets/landing_page/ultrasonic_facial.jpg";
import keratine_treatment from "@/assets/landing_page/keratine_treatment.jpg";
import Hydra_Facials from "@/assets/kayaa-home/Geothermalcard.webp";
import facial_services1 from "@/assets/landing_page/facial_services1.jpg";
import facial_services2 from "@/assets/landing_page/facial_services2.jpg";
import facial_services3 from "@/assets/landing_page/facial_services3.jpg";
import team_esthetician from "@/assets/landing_page/team_esthetician.jpg";
import team_hair_color from "@/assets/landing_page/team_hair_color.jpg";
import team_threading from "@/assets/landing_page/team_threading.jpg";
import team_facial from "@/assets/landing_page/team_facial.jpg";
import beauty_excellence from "@/assets/landing_page/beauty_excellence.jpg";
import hero1 from "@/assets/landing_page/hero1.jpg";
import hero2 from "@/assets/landing_page/hero2.jpg";
import hero3 from "@/assets/landing_page/hero3.jpg";
import hero4 from "@/assets/landing_page/hero4.jpg";
import hero5 from "@/assets/landing_page/hero5.jpg";
import hero6 from "@/assets/landing_page/hero6.jpg";
import hero7 from "@/assets/landing_page/hero7.jpg";
import mainimage from "@/assets/kayaa-home/mainimage1.webp";
import Flawors from "@/assets/kayaa-home/merafool.webp";
import leftside from "@/assets/kayaa-home/leftsidebackground.webp";
import facesScrub from "@/assets/kayaa-home/facescrub.webp";
import dailyProgram from "@/assets/kayaa-home/dailyProgram.webp";
import volcanicStones from "@/assets/kayaa-home/volcanicStones.webp";
import Finnish from "@/assets/kayaa-home/Finnishmasaaj.webp";
import videoimage from "@/assets/kayaa-home/videoimage.jpg";
import Aromatherapy from "@/assets/kayaa-home/Aromatherapy.webp";
import Hydrotherapy from "@/assets/kayaa-home/Hydrotherapy.webp";
import Facials from "@/assets/kayaa-home/Facials.webp";
import { useRouter } from "next/navigation";

// Safe Image Component to prevent errors
type SafeImageProps = {
  src: any;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  quality?: number;
  sizes?: string;
  priority?: boolean;
  onError?: () => void;
  onLoadingComplete?: () => void;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
};

const SafeImage = ({ src, alt, ...props }: SafeImageProps) => {
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    return (
      <div
        className={`bg-gradient-to-r from-pink-100 to-rose-100 flex items-center justify-center ${props.className}`}>
        <span className="text-gray-400 text-sm">Image not available</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      {...props}
      onError={() => setImageError(true)}
      onLoadingComplete={() => setImageError(false)}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvtKa6to9VNKDDEfSwrzZz7KpTGRaV6Ql3wgLcXKl1O7rkr6"
    />
  );
};

export default function Page() {
  const router = useRouter();
  const servicePageRoute = () => {
    router.push("/saloon-services");
  };
  // Data Arrays
  const slides = [
    {
      id: 1,
      image: hero1,
      title: "PREMIUM PRODUCTS",
      subtitle:
        "We'll elevate your looks using AVEDA®, GlyMed Plus®, and Dermalogica® products and a host of beautifying services.",
    },
    {
      id: 2,
      image: hero2,
      title: "KAYA BEAUTY SPA",
      subtitle:
        "Enhancing your beauty for 20 years with top-tier holistic, ayurvedic, and cruelty-free products.",
    },
    {
      id: 3,
      image: hero3,
      title: "REJUVENATION & RELAXATION",
      subtitle:
        "Rejuvenation and relaxation are what you need to look and feel your best, and Kaya Beauty Spa can give that to you.",
    },
    {
      id: 4,
      image: hero4,
      title: "SPECIALIZED SERVICES",
      subtitle:
        "We offer different Specialized Services such as the Ultrasonic and Hydra facials, Keratin Treatments, Threading, and Henna for Hair.",
    },
    {
      id: 5,
      image: hero5,
      title: "HOLISTIC BEAUTY",
      subtitle:
        "Experience holistic treatments with natural and cruelty-free products to nourish both body and soul.",
    },
    {
      id: 6,
      image: hero6,
      title: "PREMIUM PRODUCTS",
      subtitle:
        "We'll elevate your looks using AVEDA®, GlyMed Plus®, and Dermalogica® products and a host of beautifying services.",
    },
    {
      id: 7,
      image: hero7,
      title: "YOUR BEAUTY, OUR PASSION",
      subtitle:
        "Our expert team is dedicated to enhancing your beauty with personalized treatments and care.",
    },
  ];

  const services = [
    {
      title: "Ultrasonic Facials",
      desc: "Ultrasonic Clinical Skin Treatment system use a highly effective and unique 3-stage system for safer mechanical therapy.",
      img: ultrasonic_facial,
    },
    {
      title: "Hydra Facials",
      desc: "Our signature treatment includes the works! triple cleansing, dermasound elite microcurrent, powerful enzyme mask.",
      img: Hydra_Facials,
    },
    {
      title: "Keratin Treatments",
      desc: "Keratin Treatment upon consultation. Treat and rejuvenate damaged and dry hair with professional care and premium products.",
      img: keratine_treatment,
    },
  ];

  const SaunaServices = [
    {
      icon: Finnish,
      title: "Threading",
      desc: "Eyebrow Threading, Chin, Upper Lip/Lower lip, Full Face. Professional threading services for perfect shaping.",
    },
    {
      icon: dailyProgram,
      title: "Henna for Hair",
      desc: "Henna Treatment with wash, Indigo with wash. Natural henna treatments for hair coloring and conditioning.",
    },
    {
      icon: volcanicStones,
      title: "Hair Color",
      desc: "Single Color Process, Partial Foil, Full Foil, Balayage. Professional hair coloring services.",
    },
    {
      icon: facesScrub,
      title: "Waxing Services",
      desc: "Eyebrow, Bikini, Brazilian, Full Legs. For Female only. Gentle and effective waxing services for smooth skin.",
    },
  ];

  const facialServices = [facial_services1, facial_services2, facial_services3];

  const testimonials = [
    {
      text: "I've been coming to Kaya Beauty Spa for years and Anita always does an amazing job with my eyebrow threading. The Ayurvedic treatments are so relaxing and my skin always feels incredible afterward.",
      name: "Sarah M.",
      role: "Regular Client",
      image: Hydra_Facials,
    },
    {
      text: "The Hydra facial at Kaya Beauty Spa completely transformed my skin! The staff is so knowledgeable about Ayurvedic treatments and they use the best products. Highly recommend!",
      name: "Maria L.",
      role: "Happy Customer",
      image: Hydra_Facials,
    },
    {
      text: "Anita is the best! Her expertise with natural henna treatments is unmatched. I love that they use holistic and cruelty-free products. My hair has never looked better.",
      name: "Jennifer K.",
      role: "Satisfied Client",
      image: Hydra_Facials,
    },
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "Senior Esthetician",
      image: team_esthetician,
    },
    {
      name: "Maria Rodriguez",
      role: "Hair Color Specialist",
      image: team_hair_color,
    },
    { name: "Lisa Chen", role: "Threading Expert", image: team_threading },
    { name: "Amanda Davis", role: "Facial Therapist", image: team_facial },
  ];

  const Blissspa = [
    {
      img: Aromatherapy,
      title: "Chemical Exfoliation",
      desc: "Lactic Peel, Jessner Peel, Vitamin A Peel, 5 Berry Pigment Control Peel. Professional chemical peels for skin rejuvenation.",
    },
    {
      img: Hydrotherapy,
      title: "Micro Needling",
      desc: "Advanced Micro Needling treatment. This treatment focuses on fine lines and wrinkles with immediate tightening effect and deeper product penetration.",
    },
    {
      img: Facials,
      title: "Eye Lift Treatment",
      desc: "Eye Lift Treatment with Dermasound Elite 20 mins. This treatment focuses more directly on fine lines and wrinkles around the eye area.",
    },
  ];

  // State Management
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <>
      <style jsx global>{`
        .hero-image-transition {
          transition: opacity 0.8s ease-in-out;
        }
        .swiper-pagination-bullet-custom {
          width: 12px !important;
          height: 12px !important;
          background: rgba(255, 255, 255, 0.5) !important;
          border-radius: 50% !important;
          transition: all 0.3s ease !important;
          cursor: pointer !important;
          margin: 0 4px !important;
        }
        .swiper-pagination-bullet-active-custom {
          background: white !important;
          transform: scale(1.2) !important;
        }
        .swiper-pagination-bullet-custom:hover {
          background: rgba(255, 255, 255, 0.8) !important;
        }

        /* Facial Slider Custom Styles */
        .facial-pagination-bullet {
          width: 8px !important;
          height: 8px !important;
          background: rgba(194, 157, 95, 0.5) !important;
          border-radius: 50% !important;
          transition: all 0.3s ease !important;
          cursor: pointer !important;
          margin: 0 2px !important;
        }
        .facial-pagination-bullet-active {
          background: #c59d5f !important;
          transform: scale(1.3) !important;
        }
        .facial-pagination-bullet:hover {
          background: rgba(194, 157, 95, 0.8) !important;
        }

        /* Testimonial Slider Custom Styles */
        .testimonial-pagination-bullet {
          width: 12px !important;
          height: 12px !important;
          background: #d1d5db !important;
          border-radius: 50% !important;
          transition: all 0.3s ease !important;
          cursor: pointer !important;
          margin: 0 4px !important;
        }
        .testimonial-pagination-bullet-active {
          background: #c59d5f !important;
          transform: scale(1.2) !important;
        }
        .testimonial-pagination-bullet:hover {
          background: rgba(194, 157, 95, 0.7) !important;
        }
      `}</style>

      <div className="overflow-x-hidden">
        {/* Hero Section */}
        <section className="relative h-screen overflow-hidden">
          <Swiper
            modules={[Autoplay, EffectFade, Navigation, Pagination]}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            loop={true}
            speed={1000}
            navigation={{
              nextEl: ".swiper-button-next-custom",
              prevEl: ".swiper-button-prev-custom",
            }}
            pagination={{
              el: ".swiper-pagination-custom",
              clickable: true,
              bulletClass: "swiper-pagination-bullet-custom",
              bulletActiveClass: "swiper-pagination-bullet-active-custom",
            }}
            onSlideChange={(swiper) => setCurrentSlideIndex(swiper.realIndex)}
            className="h-full">
            {slides.map((slide, index) => (
              <SwiperSlide key={slide.id} className="relative h-full">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <SafeImage
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover"
                    priority={index === 0}
                    quality={90}
                    sizes="100vw"
                  />
                  <div className="absolute inset-0 bg-black/40" />
                </div>

                {/* Content */}
                <div className="relative z-10 h-full flex items-center justify-center">
                  <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center text-white">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`slide-content-${slide.id}`}
                          initial={{ opacity: 0, y: 50 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -50 }}
                          transition={{
                            duration: 0.8,
                            ease: [0.25, 0.46, 0.45, 0.94],
                          }}>
                          {/* Title */}
                          <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              delay: 0.2,
                              duration: 0.8,
                              ease: "easeOut",
                            }}
                            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-wide"
                            style={{
                              textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                            }}>
                            {slide.title}
                          </motion.h1>

                          {/* Subtitle */}
                          <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              delay: 0.4,
                              duration: 0.8,
                              ease: "easeOut",
                            }}
                            className="text-lg md:text-xl lg:text-2xl mb-8 leading-relaxed max-w-3xl mx-auto"
                            style={{
                              textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
                            }}>
                            {slide.subtitle}
                          </motion.p>

                          {/* Call to Action Button */}
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                              delay: 0.6,
                              duration: 0.6,
                              ease: "easeOut",
                            }}
                            onClick={servicePageRoute}>
                            <motion.button
                              whileHover={{
                                scale: 1.05,
                                boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                              }}
                              whileTap={{ scale: 0.98 }}
                              className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold py-4 px-8 rounded-full text-lg transition-all duration-300 shadow-lg">
                              Book Your Service
                            </motion.button>
                          </motion.div>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 0.1, scale: 1 }}
                  transition={{ delay: 0.8, duration: 1 }}
                  className="absolute top-10 right-10 w-32 h-32 border-2 border-white rounded-full hidden md:block"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 0.1, scale: 1 }}
                  transition={{ delay: 1, duration: 1 }}
                  className="absolute bottom-20 left-10 w-20 h-20 border-2 border-white rounded-full hidden md:block"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <div className="hidden sm:block swiper-button-prev-custom absolute left-4 top-1/2 transform -translate-y-1/2 z-20">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className=" backdrop-blur-sm hover:bg-white/30 transition-all duration-300 rounded-full p-3 group">
              <ArrowLeft className="w-6 h-6 text-white group-hover:text-gray-200" />
            </motion.button>
          </div>

          <div className="hidden sm:block swiper-button-next-custom absolute right-4 top-1/2 transform -translate-y-1/2 z-20">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className=" backdrop-blur-sm hover:bg-white/30 transition-all duration-300 rounded-full p-3 group">
              <ArrowRight className="w-6 h-6 text-white group-hover:text-gray-200" />
            </motion.button>
          </div>

          {/* Custom Pagination */}
          <div className="swiper-pagination-custom absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20"></div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-white text-sm font-light">
              <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
                <motion.div
                  animate={{ y: [0, 12, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-1 h-3 bg-white rounded-full mt-2"
                />
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* KAYA BEAUTY SPA Section */}
        <section className="relative px-1 py-36 bg-gradient-to-br from-[#fefaf4] to-pink-50 min-h-screen flex items-center justify-center overflow-hidden">
          {/* Background floral images */}
          <SafeImage
            src={Flawors}
            width={500}
            height={300}
            alt="Spa floral decoration"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-64 pointer-events-none"
          />
          <SafeImage
            src={leftside}
            width={500}
            height={300}
            alt="Spa floral decoration"
            className="absolute right-0 top-1/2 -translate-y-1/2 w-64 pointer-events-none"
          />
          <SafeImage
            src={Flawors}
            width={500}
            height={300}
            alt="Spa floral decoration"
            className="absolute top-8 left-1/2 -translate-x-1/2 w-72 pointer-events-none opacity-85"
          />

          <div className="flex flex-col items-center justify-center gap-20">
            <motion.div
              className="relative text-center max-w-4xl"
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut" }}>
              <h3 className="text-[#C59D5F] text-sm md:text-2xl font-medium mb-4 font-playfair leading-snug italic">
                WELCOME TO KAYA BEAUTY SPA!
              </h3>
              <h1 className="md:text-5xl text-3xl font-playfair font-bold text-[#B11C5F] leading-tight tracking-wide mb-6">
                Enhancing your beauty for 20 years <br /> with top-tier
                services.
              </h1>
              <p className="text-[#444] font-lato md:text-lg leading-relaxed">
                We are a Spa offering a variety of personal care services for
                skin, and hair. We offer different Specialized Services such as
                the Ultrasonic and Hydra facials, Keratin Treatments, Threading,
                and Henna for Hair. We'll elevate your looks using AVEDA®,
                GlyMed Plus®, and Dermalogica® products and a host of
                beautifying services. Rejuvenation and relaxation are what you
                need to look and feel your best, and Kaya Beauty Spa can give
                that to you.
              </p>
            </motion.div>

            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
              {services.map((service, idx) => (
                <motion.div
                  key={`service-${idx}`}
                  initial={{ opacity: 0, y: 80 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: 0.8,
                    delay: idx * 0.2,
                    ease: "easeOut",
                  }}
                  className="relative overflow-hidden rounded-lg shadow-lg group">
                  {/* Background Image */}
                  <SafeImage
                    src={service.img}
                    alt={service.title}
                    width={500}
                    height={600}
                    className="w-full h-[500px] object-center group-hover:scale-110 transition-all duration-300 ease-in-out"
                  />
                  {/* Text Overlay Card */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white p-6 shadow-md w-11/12 max-w-sm text-center z-10">
                    <h3 className="text-2xl font-playfair text-[#B11C5F] font-medium mb-2">
                      {service.title}
                    </h3>
                    <p className="text-[#444] font-lato mb-4 leading-relaxed">
                      {service.desc}
                    </p>
                    <button
                      className="font-lato uppercase tracking-wide text-[#F28C8C] hover:text-[#C59D5F] hover:-translate-0.5 active:translate-0.5 px-6 py-3 shadow-md transition"
                      onClick={servicePageRoute}>
                      Book Now
                    </button>
                  </div>
                  <div className="absolute inset-0 bg-pink-200 opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none"></div>
                </motion.div>
              ))}
            </div>

            {/* Our Services */}
            <div className="relative w-full overflow-hidden">
              {/* Decorative Background Flowers */}
              <SafeImage
                src={leftside}
                width={250}
                height={250}
                alt="flower left"
                className="absolute bottom-0 left-0 opacity-40 pointer-events-none"
              />
              <SafeImage
                src={Flawors}
                width={250}
                height={250}
                alt="flower right"
                className="absolute top-0 right-0 opacity-30 pointer-events-none"
              />

              {/* Services Grid */}
              <div className="max-w-7xl mx-auto px-6 pt-3 grid md:grid-cols-4 gap-12 text-center">
                {SaunaServices.map((service, idx) => (
                  <motion.div
                    key={`sauna-service-${idx}`}
                    initial={{ opacity: 0, y: 80 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{
                      duration: 0.8,
                      delay: idx * 0.2,
                      ease: "easeOut",
                    }}
                    className="flex flex-col items-center">
                    {/* Icon */}
                    <SafeImage
                      src={service.icon}
                      alt={service.title}
                      width={100}
                      height={100}
                      className="mb-4"
                    />

                    {/* Title */}
                    <h3 className="cormorant font-semibold text-2xl text-[#B11C5F] leading-snug mb-2">
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="font-lato text-[#444444] leading-relaxed max-w-xs">
                      {service.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* We are expert - WITH SWIPER LIBRARY */}
        <section className="relative pb-36 bg-gradient-to-tr from-[#fefaf4] to-pink-50">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-14 items-center justify-between px-6">
            {/* LEFT: Swiper Image Slider */}
            <div className="relative w-full h-[550px] overflow-hidden">
              <Swiper
                modules={[Autoplay, EffectFade, Navigation, Pagination]}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                }}
                loop={true}
                speed={800}
                navigation={{
                  nextEl: ".facial-slider-next",
                  prevEl: ".facial-slider-prev",
                }}
                pagination={{
                  el: ".facial-slider-pagination",
                  clickable: true,
                  bulletClass: "facial-pagination-bullet",
                  bulletActiveClass: "facial-pagination-bullet-active",
                }}
                className="w-full h-full rounded-lg">
                {facialServices.map((service, index) => (
                  <SwiperSlide
                    key={`facial-service-${index}`}
                    className="relative">
                    <SafeImage
                      src={service}
                      alt={`Facial Service ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      quality={90}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Custom Pagination Dots */}
              <div className="facial-slider-pagination absolute bottom-4 right-4 flex gap-1 z-10"></div>
            </div>

            {/* RIGHT: Text Content (unchanged) */}
            <div>
              <h1 className="md:text-xl text-lg font-semibold text-[#C59D5F] mb-2">
                WE ARE EXPERTS
              </h1>
              <h2 className="md:text-6xl text-4xl font-playfair font-semibold text-[#B11C5F] mb-6 relative">
                Professional Facial Services
              </h2>

              <ul className="space-y-2 text-[#444] mb-6 md:text-lg">
                <li>
                  ✨ Kaya Signature Facial - customized for your skin type
                </li>
                <li>✨ Ultrasonic Facial - advanced skin treatment system</li>
                <li>✨ Hydra Facial - triple cleansing with microcurrent</li>
              </ul>

              <p className="text-gray-600 leading-relaxed mb-4 md:text-lg">
                Our skin specialist will customize this facial to meet the needs
                of your skin. Specific facial for any type of skin, specially
                for Age Management and Acneic Skin. This exclusive formulation
                is a super exfoliate and powerful antioxidant that re-textures
                the skin, restores skin hydration, tone and firmness.
              </p>

              <button
                className="font-lato uppercase tracking-wide text-[#F28C8C] hover:text-[#C59D5F] hover:-translate-0.5 active:translate-0.5 md:px-6 md:py-3 px-3 py-2 shadow-md transition"
                onClick={servicePageRoute}>
                Book Service
              </button>
            </div>
          </div>
        </section>

        {/* Specialty Services Section */}
        <section className="pb-28 bg-gradient-to-br from-[#fefaf4] to-pink-50 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="md:text-5xl text-4xl font-playfair font-bold text-[#B11C5F] mb-4">
                Advanced Treatments
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-[#F28C8c] to-[#C59D5F] mx-auto mb-6 rounded-full"></div>
              <p className="font-lato text-[#444] max-w-2xl md:text-lg mx-auto">
                Enjoy a more youthful and gorgeous YOU after leaving our spa and
                salon in Somerville, Massachusetts. We plan on being here to
                help YOU look and feel more beautiful than you already are!
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {Blissspa.map((service, index) => (
                <motion.div
                  key={`bliss-spa-${index}`}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 group">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full overflow-hidden">
                    <SafeImage
                      src={service.img}
                      alt={service.title}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover group-hover:animate-pulse"
                    />
                  </div>
                  <h4 className="cormorant text-2xl font-semibold text-[#B11C5F] mb-4">
                    {service.title}
                  </h4>
                  <p className="font-lato text-[#444] leading-relaxed">
                    {service.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section with Photos */}
        {/* Testimonials Section with Photos - WITH SWIPER LIBRARY */}
        <section className="pb-20 pt-10 bg-gradient-to-tr from-[#fefaf4] to-pink-50 relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <Swiper
              modules={[Autoplay, EffectFade, Pagination]}
              effect="fade"
              fadeEffect={{ crossFade: true }}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              loop={true}
              speed={800}
              pagination={{
                el: ".testimonial-pagination",
                clickable: true,
                bulletClass: "testimonial-pagination-bullet",
                bulletActiveClass: "testimonial-pagination-bullet-active",
              }}
              className="w-full">
              {testimonials.map((testimonial, index) => (
                <SwiperSlide key={`testimonial-slide-${index}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="bg-white rounded-3xl p-12 shadow-xl">
                    <blockquote className="text-2xl cormorant italic text-gray-700 mb-8 leading-relaxed">
                      "{testimonial.text}"
                    </blockquote>

                    <div className="flex items-center justify-center space-x-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden shadow-lg">
                        <SafeImage
                          src={testimonial.image}
                          alt={testimonial.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-left">
                        <h4 className="cormorant text-xl font-semibold text-[#F28C8C]">
                          {testimonial.name}
                        </h4>
                        <p className="open-sans text-gray-500">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Pagination */}
            <div className="testimonial-pagination flex justify-center space-x-2 mt-8"></div>
          </div>
        </section>

        {/* Team Section */}
        <section className="pt-10 pb-20 bg-gradient-to-br from-[#fefaf4] to-pink-50 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="md:text-5xl text-4xl font-playfair font-bold text-[#B11C5F] mb-4">
                Experienced Beauty Experts
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-[#F28C8c] to-[#C59D5F] mx-auto mb-6 rounded-full"></div>
              <p className="font-lato md:text-lg text-[#444] max-w-2xl mx-auto">
                Our skilled Experts specialize in Ultrasonic and Hydra facials,
                Keratin Treatments, Threading, and Henna for Hair using AVEDA®,
                GlyMed Plus®, and Dermalogica® products.
              </p>
            </div>

            <div className="grid lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <motion.div
                  key={`team-member-${index}`}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center group border-2 border-gray-200 rounded-lg shadow-lg pb-2">
                  <div className="relative mb-4 overflow-hidden rounded-t-lg">
                    <SafeImage
                      src={member.image}
                      alt={member.name}
                      width={300}
                      height={300}
                      className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#C59D5F]/30 to-transparent"></div>
                  </div>
                  <h4 className="cormorant text-xl font-semibold text-[#B11C5F] tracking-wide leading-tight">
                    {member.name}
                  </h4>
                  <p className="font-lato text-gray-500 leading-relaxed mb-3">
                    {member.role}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Video Section */}
        <section className="pb-20 pt-10 bg-gradient-to-tr from-[#fefaf4] to-pink-50">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}>
              <div className="text-sm font-lato text-[#C59D5F] font-semibold mb-2 tracking-widest">
                KAYA BEAUTY SPA
              </div>
              <h2 className="text-4xl font-playfair font-bold text-gray-800 mb-4">
                <span className="text-[#B11C5F]">
                  Experience Our Spa Services
                </span>
              </h2>
              <p className="font-lato text-[#444] leading-relaxed mb-10 max-w-3xl mx-auto text-lg">
                Rejuvenation and relaxation are what you need to look and feel
                your best, and Kaya Beauty Spa can give that to you. We plan on
                being here to help YOU look and feel more beautiful than you
                already are!
              </p>

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative aspect-video rounded-lg overflow-hidden group cursor-pointer shadow-2xl max-w-4xl mx-auto"
                onClick={() => setIsVideoOpen(true)}>
                <SafeImage
                  src={videoimage}
                  alt="Kaya Beauty Spa"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 80vw"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl">
                    <Play
                      className="text-[#C59D5F] ml-1 group-hover:text-[#B11C5F]"
                      size={32}
                    />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Skills Section with Progress Bars */}
        <section className="md:py-20 pt-0 pb-20 bg-gradient-to-tr from-[#fefaf4] to-pink-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-center sm:flex-nowrap flex-wrap gap-16">
              {/* Left side - Image */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="flex-shrink-0">
                <SafeImage
                  src={beauty_excellence}
                  width={400}
                  height={400}
                  alt="Kaya Beauty Spa Treatment"
                  className="shadow-xl shadow-[#C59D5F]/30 hidden sm:block"
                />
              </motion.div>

              {/* Right side - Skills */}
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="flex-grow">
                <div className="md:text-xl text-lg font-lato text-[#C59D5F] font-bold mb-1 tracking-widest">
                  OUR EXPERTISE
                </div>
                <h2 className="md:text-5xl text-4xl font-playfair font-semibold text-[#B11C5F] mb-6 leading-tight">
                  <span>Beauty Excellence</span>
                  <br />
                  with Ayurvedic Expertise
                </h2>
                <p className="font-lato md:text-lg text-[#444] leading-relaxed mb-8">
                  We combine the best of beauty training with Ayurvedic and
                  holistic beauty experience. Our expertise includes Ultrasonic
                  and Hydra facials, Keratin Treatments, Threading, and Henna
                  for Hair using premium products.
                </p>

                {/* Progress Bars */}
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="open-sans text-[#C59D5F] font-medium">
                        Ayurvedic Treatments
                      </span>
                      <span className="text-[#C59D5F] font-semibold">95%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "95%" }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-r from-[#F28C8C] to-[#F28C8C] h-2 rounded-full"></motion.div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="open-sans text-[#C59D5F] font-medium">
                        Facial Services
                      </span>
                      <span className="text-[#C59D5F] font-semibold">92%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "92%" }}
                        transition={{ duration: 1.5, delay: 0.7 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-r from-[#F28C8C] to-[#F28C8C] h-2 rounded-full"></motion.div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="open-sans text-[#C59D5F] font-medium">
                        Hair Care & Threading
                      </span>
                      <span className="text-[#C59D5F] font-semibold">88%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "88%" }}
                        transition={{ duration: 1.5, delay: 0.9 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-r from-[#F28C8C] to-[#F28C8C] h-2 rounded-full"></motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Parallax Section */}
        <section
          className="relative h-[400px] w-full bg-fixed bg-center bg-cover bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${
              (mainimage as any).src
            })`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}></section>
      </div>
    </>
  );
}
