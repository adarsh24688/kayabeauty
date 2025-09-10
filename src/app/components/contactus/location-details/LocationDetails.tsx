"use client";

import { motion } from "framer-motion";
import { FaParking, FaSubway, FaBus, FaWalking } from "react-icons/fa";

export default function LocationDetails() {
  const locationFeatures = [
    {
      icon: FaParking,
      title: "Easy Parking",
      description: "Street parking and nearby parking lots available",
    },
    {
      icon: FaSubway,
      title: "Public Transit",
      description: "Close to Davis Square T Station (Red Line)",
    },
    {
      icon: FaBus,
      title: "Bus Routes",
      description: "Multiple bus lines serve Highland Avenue",
    },
    {
      icon: FaWalking,
      title: "Walkable Area",
      description: "Located in the heart of Somerville's vibrant community",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-[#F28C8C]/5 to-[#C59D5F]/5 rounded-full animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-24 h-24 bg-gradient-to-br from-[#C59D5F]/5 to-[#F28C8C]/5 rounded-full animate-bounce"></div>

      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}>
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-[#B11C5F] mb-6">
            Easy to Find & Visit
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
            Our convenient Somerville location makes it easy for clients from
            Boston, Cambridge, and surrounding areas to visit us
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {locationFeatures.map((feature, index) => (
            <motion.div
              key={index}
              className="text-center p-6 rounded-2xl bg-gradient-to-br from-pink-50 to-purple-50 hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}>
              <div className="w-12 h-12 bg-gradient-to-br from-[#F28C8C] to-[#C59D5F] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <feature.icon className="text-white text-lg" />
              </div>
              <h3 className="text-lg font-bold text-[#B11C5F] mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-3xl p-8 md:p-12 border border-pink-200"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-playfair font-bold text-[#B11C5F] mb-6">
                Visit Our Neighborhood
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Kaya Beauty Spa is located on Highland Avenue in Somerville,
                just minutes from Davis Square. Our neighborhood is known for
                its diverse dining options, local shops, and welcoming community
                atmosphere.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#F28C8C] rounded-full"></div>
                  <span className="text-gray-700">
                    5 minutes from Davis Square
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#C59D5F] rounded-full"></div>
                  <span className="text-gray-700">
                    15 minutes from Harvard Square
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#F28C8C] rounded-full"></div>
                  <span className="text-gray-700">
                    20 minutes from Downtown Boston
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <h4 className="text-xl font-bold text-[#B11C5F] mb-4">
                Directions from Boston:
              </h4>
              <ol className="space-y-2 text-gray-700">
                <li>1. Take Red Line to Davis Square</li>
                <li>2. Walk north on Highland Ave</li>
                <li>3. We're at 92 Highland Ave</li>
                <li>4. Look for our spa sign!</li>
              </ol>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
