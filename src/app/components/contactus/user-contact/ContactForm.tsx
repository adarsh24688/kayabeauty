"use client";

import { motion } from "framer-motion";
import { FiUser, FiMail, FiMessageSquare } from "react-icons/fi";

export default function ContactForm() {
  return (
    <div className="w-full bg-gradient-to-r from-[#2C1810] to-[#3C2817] py-12 flex justify-center relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-[#F28C8C]/10 to-[#C59D5F]/10 rounded-full animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-16 h-16 bg-gradient-to-br from-[#C59D5F]/8 to-[#F28C8C]/8 rounded-full animate-bounce"></div>

      <motion.div
        className="w-full max-w-6xl px-4"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}>
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-white mb-4">
            Quick Contact
          </h2>
          <p className="text-pink-200 text-lg">
            Get in touch for appointments or inquiries
          </p>
        </div>

        <form
          className="flex flex-col lg:flex-row gap-4 md:gap-6 items-stretch lg:items-center"
          onSubmit={(e) => e.preventDefault()}>
          <div className="flex-1 relative">
            <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Your Name"
              className="w-full pl-12 pr-6 py-4 bg-white/10 backdrop-blur-sm border border-white/30 text-white placeholder-pink-300 rounded-lg outline-none transition-all duration-300
                focus:border-[#F28C8C] focus:bg-white/15 focus:shadow-lg focus:shadow-[#F28C8C]/20
                hover:border-[#C59D5F] hover:bg-white/12"
            />
          </div>

          <div className="flex-1 relative">
            <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full pl-12 pr-6 py-4 bg-white/10 backdrop-blur-sm border border-white/30 text-white placeholder-pink-300 rounded-lg outline-none transition-all duration-300
                focus:border-[#F28C8C] focus:bg-white/15 focus:shadow-lg focus:shadow-[#F28C8C]/20
                hover:border-[#C59D5F] hover:bg-white/12"
            />
          </div>

          <div className="flex-1 relative">
            <FiMessageSquare className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Service Interest"
              className="w-full pl-12 pr-6 py-4 bg-white/10 backdrop-blur-sm border border-white/30 text-white placeholder-pink-300 rounded-lg outline-none transition-all duration-300
                focus:border-[#F28C8C] focus:bg-white/15 focus:shadow-lg focus:shadow-[#F28C8C]/20
                hover:border-[#C59D5F] hover:bg-white/12"
            />
          </div>

          <motion.button
            type="submit"
            className="bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] text-white font-bold uppercase tracking-widest px-10 py-4 rounded-lg transition-all duration-300 w-full md:w-auto"
            style={{ letterSpacing: "0.15em" }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 30px rgba(242, 140, 140, 0.3)",
            }}
            whileTap={{ scale: 0.95 }}>
            SEND MESSAGE
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
