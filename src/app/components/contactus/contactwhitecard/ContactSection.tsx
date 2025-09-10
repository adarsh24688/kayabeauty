"use client";

import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaClock } from "react-icons/fa";
import { motion } from "framer-motion";

export default function ContactSection() {
  const animationVariants = {
    initial: { opacity: 0, y: 50 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  return (
    <div className="bg-gradient-to-br from-[#fefaf4] to-pink-50 py-16 md:py-24 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-[#F28C8C]/8 to-[#C59D5F]/8 rounded-full animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-[#C59D5F]/6 to-[#F28C8C]/6 rounded-full animate-bounce"></div>

      <motion.div
        className="w-full flex justify-center items-center"
        variants={animationVariants}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}>
        <div className="w-[90vw] max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-pink-100">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl font-playfair font-bold text-[#B11C5F] mb-6">
                Get In Touch
              </h2>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                Ready to enhance your natural beauty? Contact us to schedule
                your consultation or learn more about our Ayurvedic treatments.
              </p>

              <form
                className="flex flex-col gap-6"
                onSubmit={(e) => e.preventDefault()}>
                <motion.input
                  type="text"
                  placeholder="Your Name"
                  className="border-2 border-gray-300 px-6 py-4 text-gray-800 placeholder-gray-500 bg-white rounded-lg outline-none transition-all duration-300
                  focus:border-[#F28C8C] focus:shadow-lg focus:shadow-[#F28C8C]/20 hover:border-[#C59D5F]"
                  whileFocus={{ scale: 1.02 }}
                />
                <motion.input
                  type="email"
                  placeholder="Your Email"
                  className="border-2 border-gray-300 px-6 py-4 text-gray-800 placeholder-gray-500 bg-white rounded-lg outline-none transition-all duration-300
                  focus:border-[#F28C8C] focus:shadow-lg focus:shadow-[#F28C8C]/20 hover:border-[#C59D5F]"
                  whileFocus={{ scale: 1.02 }}
                />
                <motion.input
                  type="tel"
                  placeholder="Phone Number"
                  className="border-2 border-gray-300 px-6 py-4 text-gray-800 placeholder-gray-500 bg-white rounded-lg outline-none transition-all duration-300
                  focus:border-[#F28C8C] focus:shadow-lg focus:shadow-[#F28C8C]/20 hover:border-[#C59D5F]"
                  whileFocus={{ scale: 1.02 }}
                />
                <motion.textarea
                  placeholder="Tell us about your beauty goals or ask any questions..."
                  rows={5}
                  className="border-2 border-gray-300 px-6 py-4 text-gray-800 placeholder-gray-500 bg-white rounded-lg outline-none transition-all duration-300
                  focus:border-[#F28C8C] focus:shadow-lg focus:shadow-[#F28C8C]/20 hover:border-[#C59D5F] resize-none"
                  whileFocus={{ scale: 1.02 }}
                />
                <motion.button
                  type="submit"
                  className="w-full md:w-auto bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] text-white font-bold tracking-wider py-4 px-8 rounded-lg transition-all duration-300"
                  style={{ letterSpacing: "0.1em" }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0px 10px 25px rgba(242, 140, 140, 0.3)",
                  }}
                  whileTap={{ scale: 0.95 }}>
                  SEND MESSAGE
                </motion.button>
              </form>
            </motion.div>
          </div>

          {/* Contact Info */}
          <motion.div
            className="flex flex-col space-y-8"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}>
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-10 shadow-xl border border-pink-100">
              <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-6 text-[#B11C5F]">
                Visit Kaya Beauty Spa
              </h2>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                Experience 20 years of beauty excellence with our holistic,
                Ayurvedic, and cruelty-free treatments in the heart of
                Somerville, Massachusetts.
              </p>

              <div className="space-y-6">
                <motion.div
                  className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-pink-50 to-purple-50 hover:shadow-lg transition-all duration-300"
                  whileHover={{ x: 5 }}>
                  <div className="w-12 h-12 bg-gradient-to-br from-[#F28C8C] to-[#C59D5F] rounded-full flex items-center justify-center shadow-lg">
                    <FaMapMarkerAlt className="text-white text-lg" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#B11C5F] mb-1">
                      Our Location
                    </h4>
                    <p className="text-gray-700">
                      92 Highland Ave
                      <br />
                      Somerville, MA 02143
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-pink-50 to-purple-50 hover:shadow-lg transition-all duration-300"
                  whileHover={{ x: 5 }}>
                  <div className="w-12 h-12 bg-gradient-to-br from-[#F28C8C] to-[#C59D5F] rounded-full flex items-center justify-center shadow-lg">
                    <FaEnvelope className="text-white text-lg" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#B11C5F] mb-1">Email Us</h4>
                    <p className="text-gray-700">kayabeautyspa@yahoo.com</p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-pink-50 to-purple-50 hover:shadow-lg transition-all duration-300"
                  whileHover={{ x: 5 }}>
                  <div className="w-12 h-12 bg-gradient-to-br from-[#F28C8C] to-[#C59D5F] rounded-full flex items-center justify-center shadow-lg">
                    <FaPhone className="text-white text-lg" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#B11C5F] mb-1">Call Us</h4>
                    <p className="text-gray-700">617-776-2510</p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-pink-50 to-purple-50 hover:shadow-lg transition-all duration-300"
                  whileHover={{ x: 5 }}>
                  <div className="w-12 h-12 bg-gradient-to-br from-[#F28C8C] to-[#C59D5F] rounded-full flex items-center justify-center shadow-lg">
                    <FaClock className="text-white text-lg" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#B11C5F] mb-1">
                      Business Hours
                    </h4>
                    <p className="text-gray-700">
                      Mon-Fri: 9AM-7PM
                      <br />
                      Sat: 9AM-6PM
                      <br />
                      Sun: 10AM-5PM
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
