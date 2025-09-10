"use client";

import { motion } from "framer-motion";
import { FaCalendarCheck, FaGift, FaCreditCard } from "react-icons/fa";

export default function BookingSection() {
  const bookingOptions = [
    {
      icon: FaCalendarCheck,
      title: "Online Booking",
      description:
        "Book your appointment 24/7 through our convenient online system",
      action: "Book Now",
      link: "https://dingg.app/booking/kaya-beauty-spa-salon-somerville",
    },
    {
      icon: FaGift,
      title: "Gift Certificates",
      description: "Give the gift of beauty with our spa gift certificates",
      action: "Buy Gift Card",
      link: "https://dingg.app/booking/kaya-beauty-spa-salon-somerville",
    },
    {
      icon: FaCreditCard,
      title: "Buy Products",
      description: "Shop our premium GlyMed Plus and Natlique products online",
      action: "Shop Now",
      link: "https://glymedplus.io/store/kayabeautyspa",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-[#fefaf4] to-pink-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-[#F28C8C]/8 to-[#C59D5F]/8 rounded-full animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-[#C59D5F]/6 to-[#F28C8C]/6 rounded-full animate-bounce"></div>

      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}>
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-[#B11C5F] mb-6">
            Easy Booking & Shopping
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
            Multiple convenient ways to book appointments, purchase gift
            certificates, and shop our premium beauty products
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {bookingOptions.map((option, index) => (
            <motion.div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-pink-100 hover:shadow-2xl transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#F28C8C] to-[#C59D5F] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <option.icon className="text-white text-2xl" />
                </div>

                <h3 className="text-2xl font-playfair font-bold text-[#B11C5F] mb-4">
                  {option.title}
                </h3>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  {option.description}
                </p>

                <motion.a
                  href={option.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] text-white px-6 py-3 rounded-full font-bold tracking-wider transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}>
                  {option.action}
                </motion.a>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-16 bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-pink-200"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}>
          <h3 className="text-2xl font-playfair font-bold text-[#B11C5F] mb-4">
            Need Help?
          </h3>
          <p className="text-gray-600 mb-6">
            Our friendly staff is here to assist you with bookings, questions,
            or special requests
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="tel:617-776-2510"
              className="bg-white border-2 border-[#F28C8C] text-[#B11C5F] px-6 py-3 rounded-full font-bold hover:bg-[#F28C8C] hover:text-white transition-all duration-300">
              Call: 617-776-2510
            </a>
            <a
              href="mailto:kayabeautyspa@yahoo.com"
              className="bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] text-white px-6 py-3 rounded-full font-bold hover:shadow-lg transition-all duration-300">
              Email Us
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
