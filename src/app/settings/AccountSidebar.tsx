"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link"; // Import the Link component
import { usePathname, useRouter } from "next/navigation";
import {
  User,
  Calendar,
  Gift,
  Pencil,
  HelpCircle,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useAppDispatch } from "@/store/hook";
import { logoutUser } from "@/store/slices/authSlice";
import { clearCart } from "@/store/slices/cartSlice";

const NAV_LINKS = [
  { id: "profile", href: "/settings/profile", label: "Profile", icon: User },
  {
    id: "appointments",
    href: "/settings/appointments/upcoming",
    label: "My Appointments",
    icon: Calendar,
  },
  {
    id: "giftcards",
    href: "/settings/giftcards",
    label: "My Giftcards",
    icon: Gift,
  },
  {
    id: "change-password",
    href: "/settings/change-password",
    label: "Change Password",
    icon: Pencil,
  },
];

const HELP_LINKS = [
  { id: "faqs", href: "/settings/faq", label: "FAQs", icon: HelpCircle },
];

export default function AccountSidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const Router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => {
    if (path.startsWith("/settings/appointments")) {
      return pathname.startsWith("/settings/appointments");
    }
    return pathname === path;
  };
  const activeLink = [...NAV_LINKS, ...HELP_LINKS].find((link) =>
    isActive(link.href)
  );

  const handleLogout = async () => {
    setIsOpen(false);
    try {
      await dispatch(logoutUser()).unwrap();
      dispatch(clearCart());
      Router.push("/");
    } catch (error) {
      console.log("❌ Logout error:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const NavigationList = () => (
    <nav className="p-2">
      <ul className="space-y-1">
        {NAV_LINKS.map((link) => {
          const active = isActive(link.href);
          return (
            <li key={link.id}>
              <Link
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all duration-300 font-lato ${
                  active
                    ? "bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] text-white font-semibold shadow-lg hover:from-[#B11C5F] hover:to-[#F28C8C] hover:scale-105"
                    : "text-[#444444] hover:bg-[#FFF6F8] hover:text-[#B11C5F] hover:scale-105"
                }`}>
                <link.icon size={20} />
                <span>{link.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="border-t border-[#F28C8C]/30 my-4"></div>
      <ul className="space-y-1">
        {HELP_LINKS.map((link) => {
          const active = isActive(link.href);
          return (
            <li key={link.id}>
              <Link
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all duration-300 font-lato ${
                  active
                    ? "bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] text-white font-semibold shadow-lg hover:from-[#B11C5F] hover:to-[#F28C8C] "
                    : "text-[#444444] hover:bg-[#FFF6F8] hover:text-[#B11C5F]"
                }`}>
                <link.icon size={20} />
                <span>{link.label}</span>
              </Link>
            </li>
          );
        })}
        <li>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-red-50 text-red-500 hover:text-red-600 transition-all duration-300 hover:scale-105 font-lato">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </li>
      </ul>
    </nav>
  );

  return (
    <div className="w-full">
      <div className="hidden lg:block bg-white/95 backdrop-blur-xl border-2 border-[#F28C8C]/30 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-4 bg-[#FFF6F8] border-b border-[#F28C8C]/30">
          <h2 className="text-xl font-playfair font-bold text-[#B11C5F]">
            Account
          </h2>
        </div>
        <NavigationList />
      </div>
      <div ref={dropdownRef} className="relative lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-4 bg-white/95 backdrop-blur-xl border-2 border-[#F28C8C]/30 rounded-2xl shadow-2xl hover:bg-[#FFF6F8] transition-all duration-300">
          <div className="flex items-center gap-3">
            {activeLink ? (
              <activeLink.icon size={20} className="text-[#B11C5F]" />
            ) : (
              <User size={20} className="text-[#B11C5F]" />
            )}
            <span className="font-playfair font-bold text-lg text-[#B11C5F]">
              {activeLink ? activeLink.label : "Account Menu"}
            </span>
          </div>
          <ChevronDown
            size={20}
            className={`transition-transform duration-300 text-[#C59D5F] ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        <div
          className={`absolute top-full mt-2 w-full bg-white/95 backdrop-blur-md rounded-2xl border-2 border-[#F28C8C]/30 overflow-hidden shadow-2xl z-50 transition-all duration-300 ease-in-out ${
            isOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-4 pointer-events-none"
          }`}>
          <NavigationList />
        </div>
      </div>
    </div>
  );
}
