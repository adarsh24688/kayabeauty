"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiMenu, FiX, FiChevronRight, FiHeart } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { openModal } from "@/store/slices/modalSlice";
import { logoutUser } from "@/store/slices/authSlice";
import { clearCart } from "@/store/slices/cartSlice";

export default function MobileMenu() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const Router = useRouter();
  const { user } = useAppSelector((state) => state.auth);

  // Prevent body scroll when menu is open and ensure full height
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    setMobileMenuOpen(false);
    try {
      await dispatch(logoutUser()).unwrap();
      dispatch(clearCart());
      Router.push("/");
    } catch (error) {
      console.log("âŒ Logout error:", error);
    }
  };

  const NAV_LINKS = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/saloon-services" },
    { label: "Gift Card", href: "/gifts" },
    { label: "About Us", href: "/about-us" },
    { label: "Contact Us", href: "/contact-us" },
    { label: "Account Settings", href: "/settings/profile" },
  ];

  return (
    <>
      {/* Enhanced Hamburger Icon */}
      <button
        onClick={() => setMobileMenuOpen(true)}
        className="lg:hidden p-2 rounded-full bg-white shadow-md hover:shadow-lg hover:bg-[#FFF6F8] transition-all duration-300 hover:scale-110 group"
        aria-label="Open mobile menu">
        <FiMenu className="w-5 h-5 text-[#B11C5F] group-hover:text-[#F28C8C] transition-colors duration-300" />
      </button>

      {/* FIXED: Full Screen Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 h-screen z-50 lg:hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FFF6F8] via-[#FFEEF2] to-[#FFF6F8]">
            {/* Decorative Elements */}
            <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-[#F28C8C]/20 to-[#C59D5F]/20 rounded-full animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-16 h-16 bg-gradient-to-tl from-[#B11C5F]/20 to-[#F28C8C]/20 rounded-full animate-bounce"></div>

            <div className="relative h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-[#F28C8C]/20 bg-gradient-to-r from-[#F28C8C]/10 to-[#C59D5F]/10">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] rounded-full flex items-center justify-center">
                    <FiHeart className="w-5 h-5 text-white animate-pulse" />
                  </div>
                  <div>
                    <h2 className="font-playfair text-xl font-bold text-[#B11C5F]">
                      Kaya Beauty
                    </h2>
                    <p className="font-cormorant text-sm text-[#C59D5F] italic">
                      Wellness & Serenity
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-white/50 transition-all duration-300 group">
                  <FiX className="w-6 h-6 text-[#B11C5F] group-hover:text-[#F28C8C] transition-colors duration-300" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 overflow-y-auto p-6 space-y-2">
                {NAV_LINKS.map((link, index) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`group flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] text-white shadow-lg"
                          : "text-[#444444] hover:bg-white/50 hover:text-[#B11C5F] border border-transparent hover:border-[#F28C8C]/20"
                      }`}
                      style={{
                        animationDelay: `${index * 0.1}s`,
                        animation: mobileMenuOpen
                          ? "slideInLeft 0.5s ease-out forwards"
                          : "none",
                      }}>
                      <span className="font-lato font-medium text-lg">
                        {link.label}
                      </span>
                      <div className="flex items-center space-x-2">
                        {isActive && (
                          <FiHeart className="w-4 h-4 animate-pulse" />
                        )}
                        <FiChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* User Section */}
              <div className="border-t border-[#F28C8C]/20 p-6 bg-gradient-to-r from-[#FFF6F8] to-white">
                {user?.isLoggedIn ? (
                  <div className="space-y-4 pb-10">
                    <div className="text-center">
                      <h3 className="font-playfair text-lg font-bold text-[#B11C5F]">
                        Welcome Back!
                      </h3>
                      <p className="font-cormorant text-[#C59D5F] italic">
                        {user.display_name || user.email}
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] text-white font-lato font-medium py-3 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 pb-10">
                    <div className="text-center">
                      <h3 className="font-playfair text-lg font-bold text-[#B11C5F]">
                        Join Kaya Beauty
                      </h3>
                      <p className="font-cormorant text-[#C59D5F] italic">
                        Your wellness journey starts here
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        dispatch(openModal("login"));
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] text-white font-lato font-medium py-3 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                      <FiHeart className="w-4 h-4" />
                      <span>Sign In</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}
