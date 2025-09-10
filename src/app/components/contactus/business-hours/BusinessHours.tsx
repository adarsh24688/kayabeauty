"use client";

import { motion } from "framer-motion";
import { FaClock, FaCalendarAlt } from "react-icons/fa";

export default function BusinessHours() {
  const hours = [
    { day: "Monday - Friday", time: "9:00 AM - 7:00 PM", highlight: false },
    { day: "Saturday", time: "9:00 AM - 6:00 PM", highlight: false },
    { day: "Sunday", time: "10:00 AM - 5:00 PM", highlight: true },
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-r from-[#2C1810] to-[#3C2817] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-10 right-10 w-24 h-24 bg-gradient-to-br from-[#F28C8C]/10 to-[#C59D5F]/10 rounded-full animate-pulse"></div>
      <div className="absolute bottom-10 left-10 w-32 h-32 bg-gradient-to-br from-[#C59D5F]/8 to-[#F28C8C]/8 rounded-full animate-bounce"></div>

      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}>
          <div className="flex items-center justify-center space-x-3 mb-4">
            <FaClock className="text-[#F28C8C] text-2xl" />
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-white">
              Business Hours
            </h2>
            <FaCalendarAlt className="text-[#C59D5F] text-2xl" />
          </div>
          <p className="text-pink-200 text-lg max-w-2xl mx-auto">
            We're here to serve you with flexible hours throughout the week
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {hours.map((schedule, index) => (
            <motion.div
              key={index}
              className={`relative p-8 rounded-2xl backdrop-blur-sm border transition-all duration-300 hover:scale-105 ${
                schedule.highlight
                  ? "bg-gradient-to-br from-[#F28C8C]/20 to-[#C59D5F]/20 border-[#F28C8C]/30"
                  : "bg-white/10 border-white/20"
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}>
              <div className="text-center">
                <h3
                  className={`text-xl font-bold mb-3 ${
                    schedule.highlight ? "text-[#F28C8C]" : "text-white"
                  }`}>
                  {schedule.day}
                </h3>
                <p
                  className={`text-lg ${
                    schedule.highlight ? "text-pink-200" : "text-gray-300"
                  }`}>
                  {schedule.time}
                </p>
              </div>

              {schedule.highlight && (
                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] text-white px-3 py-1 rounded-full text-xs font-bold">
                  Weekend
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}>
          <p className="text-pink-200 mb-6">
            * 24 hour cancellation policy applies. Please call ahead for
            appointments.
          </p>
          <motion.button
            className="bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] text-white px-8 py-4 rounded-full font-bold tracking-wider transition-all duration-300"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 30px rgba(242, 140, 140, 0.3)",
            }}
            whileTap={{ scale: 0.95 }}>
            BOOK APPOINTMENT
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
