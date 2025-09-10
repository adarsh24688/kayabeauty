"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LocationSelectorPanel from "../ui/LocationSelectorPanel";
import CartPopup from "../ui/CartPopup";
import ProfileDropdown from "../ui/ProfileDropdown";
import MobileMenu from "../ui/MobileMenu";
import Image from "next/image";
import { FiMenu, FiX } from "react-icons/fi";
import Logo from "@/assets/kayaa-home/hedarKayaBeauty.png";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/saloon-services" },
  { label: "Gift Card", href: "/gifts" },
  { label: "About Us", href: "/about-us" },
  { label: "Contact Us", href: "/contact-us" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 0);

      if (currentScrollY > lastScrollY && currentScrollY > 70) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`w-screen fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      } ${
        scrolled
          ? "bg-gradient-to-r from-black/70 via-gray-900/70 to-black/70 backdrop-blur-2xl shadow-[0_12px_48px_rgba(0,0,0,0.5)] border-b-2 border-[#F28C8C]/50"
          : "bg-gradient-to-r from-black/55 via-gray-900/55 to-black/55 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] border-b border-[#F28C8C]/30"
      } animate-gradient bg-[length:400%_400%]`}>
      {/* Floating animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-4 left-10 w-1 h-1 bg-[#F28C8C] rounded-full opacity-40 animate-ping"></div>
        <div className="absolute top-8 right-16 w-0.5 h-0.5 bg-[#C59D5F] rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute bottom-4 left-1/4 w-1 h-1 bg-[#F28C8C] rounded-full opacity-30 animate-bounce"></div>
      </div>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <div className="overflow-hidden h-20">
            <div className="flex space-x-4 group">
              <Link href="/" className="transition-transform duration-300">
                <Image
                  src={Logo}
                  alt="Kaya Beauty"
                  width={80}
                  height={80}
                  className="w-32 h-24 object-contain -translate-y-2  filter transition-all duration-300 group-hover:scale-105"
                />
              </Link>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1 gap-2">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 rounded-full font-lato font-bold transition-all duration-300 group ${
                    isActive
                      ? "text-white bg-gradient-to-br from-[#F28C8C] to-[#B11C5F]/80 shadow-md"
                      : "text-[#7F8CAA] hover:text-[#B11C5F] hover:bg-[#FFF6F8]/50"
                  }`}>
                  <span className="relative z-10 capitalize">{link.label}</span>
                  {!isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-[#F28C8C]/10 to-[#C59D5F]/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Location Selector */}

            <LocationSelectorPanel />

            {/* Cart and Profile */}
            <div className="flex items-center space-x-2">
              <CartPopup />
              <div className=" hidden md:block">
                <ProfileDropdown />
              </div>
              {/* Mobile Menu */}
              <MobileMenu />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
