import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";
import { FiMapPin, FiMail, FiPhone, FiClock, FiHeart } from "react-icons/fi";
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-[#FFF6F8] via-[#FFEEF2] to-[#FFF6F8] relative overflow-hidden">
      {/* Decorative Elements - Responsive */}
      <div className="absolute top-0 left-0 w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-[#F28C8C] to-[#C59D5F] opacity-10 rounded-full -translate-x-8 sm:-translate-x-12 lg:-translate-x-16 -translate-y-8 sm:-translate-y-12 lg:-translate-y-16 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-12 h-12 sm:w-18 sm:h-18 lg:w-24 lg:h-24 bg-gradient-to-tl from-[#B11C5F] to-[#F28C8C] opacity-10 rounded-full translate-x-6 sm:translate-x-9 lg:translate-x-12 translate-y-6 sm:translate-y-9 lg:translate-y-12 animate-bounce"></div>

      {/* Floating Rose Petals Animation - Responsive */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-5 sm:top-10 left-5 sm:left-10 w-1 h-1 sm:w-2 sm:h-2 bg-[#F28C8C] opacity-30 rounded-full animate-float-slow"></div>
        <div className="absolute top-16 sm:top-32 right-10 sm:right-20 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-[#B11C5F] opacity-40 rounded-full animate-float-medium"></div>
        <div className="absolute bottom-20 sm:bottom-40 left-16 sm:left-32 w-0.5 h-0.5 sm:w-1 sm:h-1 bg-[#C59D5F] opacity-50 rounded-full animate-float-fast"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16 z-10">
        {/* Main Footer Content - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
          {/* Brand Section - Responsive */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-4 sm:space-y-6 group text-center sm:text-left">
            <div className="transform transition-all duration-500 group-hover:scale-105">
              <h1 className="font-playfair text-2xl sm:text-3xl lg:text-4xl font-bold text-[#B11C5F] mb-2 tracking-wide">
                Kaya Beauty Spa
              </h1>
              <p className="font-cormorant text-[#C59D5F] italic text-base sm:text-lg mb-3 sm:mb-4">
                "Enhancing Your Beauty"
              </p>
            </div>

            <p className="font-lato text-[#444444] text-sm leading-relaxed mb-4 sm:mb-6 max-w-sm mx-auto sm:mx-0">
              We are a Spa offering a variety of personal care services for
              skin, and hair.
            </p>

            {/* Social Links - Responsive */}
            <div className="flex items-center justify-center sm:justify-start space-x-3 sm:space-x-4">
              <span className="font-cormorant text-[#B11C5F] text-sm font-medium">
                Follow Us
              </span>
              <div className="flex space-x-2 sm:space-x-3">
                <a
                  href="https://www.facebook.com/kayabeautyspa"
                  aria-label="Facebook"
                  className="group/social w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transform transition-all duration-300 hover:scale-110 hover:bg-[#F28C8C]">
                  <FaFacebookF className="text-[#B11C5F] text-sm sm:text-lg group-hover/social:text-white transition-colors duration-300" />
                </a>
                <a
                  href="https://www.instagram.com/kayabeautyspa/"
                  aria-label="Instagram"
                  className="group/social w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transform transition-all duration-300 hover:scale-110 hover:bg-[#F28C8C]">
                  <FaInstagram className="text-[#B11C5F] text-sm sm:text-lg group-hover/social:text-white transition-colors duration-300" />
                </a>
                <a
                  href="https://twitter.com/kayabeautyspa"
                  aria-label="Twitter"
                  className="group/social w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transform transition-all duration-300 hover:scale-110 hover:bg-[#F28C8C]">
                  <FaTwitter className="text-[#B11C5F] text-sm sm:text-lg group-hover/social:text-white transition-colors duration-300" />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Information - Responsive */}
          <div className="space-y-4 sm:space-y-6 group">
            <h3 className="font-playfair text-lg sm:text-xl font-semibold text-[#B11C5F] mb-4 sm:mb-6 tracking-wide relative">
              Get In Touch
              <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </h3>

            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start space-x-2 sm:space-x-3 group/contact hover:transform hover:translate-x-2 transition-all duration-300">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-[#F28C8C] to-[#C59D5F] rounded-full flex items-center justify-center shadow-sm group-hover/contact:shadow-md transition-all duration-300 flex-shrink-0 mt-0.5">
                  <FiMapPin className="text-white text-xs sm:text-sm" />
                </div>
                <div>
                  <p className="font-lato text-[#444444] text-sm leading-relaxed">
                    92 Highland Ave
                    <br />
                    Somerville, MA 02143
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 sm:space-x-3 group/contact hover:transform hover:translate-x-2 transition-all duration-300">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-[#F28C8C] to-[#C59D5F] rounded-full flex items-center justify-center shadow-sm group-hover/contact:shadow-md transition-all duration-300 flex-shrink-0">
                  <FiMail className="text-white text-xs sm:text-sm" />
                </div>
                <p className="font-lato text-[#444444] text-sm break-all">
                  kayabeautyspa@yahoo.com
                </p>
              </div>

              <div className="flex items-center space-x-2 sm:space-x-3 group/contact hover:transform hover:translate-x-2 transition-all duration-300">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-[#F28C8C] to-[#C59D5F] rounded-full flex items-center justify-center shadow-sm group-hover/contact:shadow-md transition-all duration-300 flex-shrink-0">
                  <FiPhone className="text-white text-xs sm:text-sm" />
                </div>
                <p className="font-lato text-[#444444] text-sm">617-776-2510</p>
              </div>
            </div>
          </div>

          {/* Opening Hours - Responsive */}
          <div className="space-y-4 sm:space-y-6 group">
            <h3 className="font-playfair text-lg sm:text-xl font-semibold text-[#B11C5F] mb-4 sm:mb-6 tracking-wide relative">
              Opening Hours
              <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </h3>

            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4 group/hour hover:transform hover:translate-x-2 transition-all duration-300">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-[#F28C8C] to-[#C59D5F] rounded-full flex items-center justify-center shadow-sm group-hover/hour:shadow-md transition-all duration-300 flex-shrink-0">
                  <FiClock className="text-white text-xs sm:text-sm" />
                </div>
                <span className="font-cormorant text-[#B11C5F] font-medium text-sm sm:text-base">
                  Spa Hours
                </span>
              </div>

              <div className="space-y-1 sm:space-y-2">
                <div className="flex justify-between items-center p-2 rounded-lg hover:bg-white/50 transition-colors duration-300">
                  <span className="font-lato text-[#444444] text-xs sm:text-sm">
                    Monday - Friday
                  </span>
                  <span className="font-lato text-[#C59D5F] text-xs sm:text-sm font-medium">
                    9:00 AM - 7:00 PM
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg hover:bg-white/50 transition-colors duration-300">
                  <span className="font-lato text-[#444444] text-xs sm:text-sm">
                    Saturday
                  </span>
                  <span className="font-lato text-[#C59D5F] text-xs sm:text-sm font-medium">
                    9:00 AM - 6:00 PM
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg hover:bg-white/50 transition-colors duration-300">
                  <span className="font-lato text-[#444444] text-xs sm:text-sm">
                    Sunday
                  </span>
                  <span className="font-lato text-[#C59D5F] text-xs sm:text-sm font-medium">
                    10:00 AM - 5:00 PM
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Location Map - Responsive */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-4 sm:space-y-6 group">
            <h3 className="font-playfair text-lg sm:text-xl font-semibold text-[#B11C5F] mb-4 sm:mb-6 tracking-wide relative">
              Find Us
              <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </h3>

            <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-500 group/map">
              <div className="absolute inset-0 bg-gradient-to-br from-[#F28C8C]/20 to-[#C59D5F]/20 opacity-0 group-hover/map:opacity-100 transition-opacity duration-500 z-10"></div>
              <iframe
                title="Kaya Beauty Spa Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2948.1234567890!2d-71.0975327!3d42.3875968!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e370a5cb30cc5f%3A0x1234567890abcdef!2s92%20Highland%20Ave%2C%20Somerville%2C%20MA%2002143!5e0!3m2!1sen!2sus!4v1683899234567!5m2!1sen!2sus"
                width="100%"
                height="200"
                style={{ border: 0, minHeight: "180px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="transform group-hover/map:scale-105 transition-transform duration-700 w-full h-40 sm:h-48 lg:h-52"
              />
            </div>
          </div>
        </div>

        {/* Newsletter Subscription - Responsive */}
        <div className="mt-8 sm:mt-12 lg:mt-16 p-4 sm:p-6 lg:p-8 bg-white/60 backdrop-blur-sm rounded-3xl shadow-lg border border-[#F28C8C]/20 group hover:bg-white/80 transition-all duration-500">
          <div className="text-center space-y-3 sm:space-y-4">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <FiHeart className="text-[#B11C5F] text-lg sm:text-xl animate-pulse" />
              <h3 className="font-playfair text-xl sm:text-2xl font-semibold text-[#B11C5F]">
                Stay Beautiful
              </h3>
              <FiHeart className="text-[#B11C5F] text-lg sm:text-xl animate-pulse" />
            </div>
            <p className="font-cormorant text-[#444444] text-base sm:text-lg max-w-2xl mx-auto px-4">
              Subscribe to our newsletter for exclusive beauty tips, special
              offers on Ayurvedic treatments, and updates on our latest holistic
              services
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto mt-4 sm:mt-6 px-4">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-full border border-[#F28C8C]/30 focus:border-[#B11C5F] focus:outline-none focus:ring-2 focus:ring-[#F28C8C]/20 transition-all duration-300 font-lato text-sm"
              />
              <button className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] text-white font-lato font-medium rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300 hover:from-[#B11C5F] hover:to-[#F28C8C] text-sm sm:text-base">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Footer Bottom - Responsive */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-[#F28C8C]/20">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
            <p className="font-lato text-[#444444] text-xs sm:text-sm text-center sm:text-left">
              &copy; {new Date().getFullYear()} Kaya Beauty Spa. All rights
              reserved.
            </p>
            <div className="flex flex-wrap justify-center sm:justify-end space-x-4 sm:space-x-6 text-xs sm:text-sm">
              <a
                href="#"
                className="font-lato text-[#444444] hover:text-[#B11C5F] transition-colors duration-300">
                Cancellation Policy
              </a>
              <a
                href="#"
                className="font-lato text-[#444444] hover:text-[#B11C5F] transition-colors duration-300">
                Book Online
              </a>
              <a
                href="#"
                className="font-lato text-[#444444] hover:text-[#B11C5F] transition-colors duration-300">
                Gift Certificates
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
        @keyframes float-medium {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(90deg);
          }
        }
        @keyframes float-fast {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(270deg);
          }
        }
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        .animate-float-medium {
          animation: float-medium 4s ease-in-out infinite;
        }
        .animate-float-fast {
          animation: float-fast 3s ease-in-out infinite;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
