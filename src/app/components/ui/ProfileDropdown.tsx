"use client";

import { useState, useRef, useEffect } from "react";
import {
  User,
  UserPlus,
  Sparkles,
  LogOut,
  Loader2,
  Settings,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { logoutUser } from "@/store/slices/authSlice";
import { clearCart } from "@/store/slices/cartSlice";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { openModal } from "@/store/slices/modalSlice";
import { FiHeart, FiUser } from "react-icons/fi";

type AuthScreen =
  | "login"
  | "password"
  | "forgot"
  | "otp"
  | "signup"
  | "success";

export default function ProfileDropdown() {
  const Router = useRouter();
  const dispatch = useAppDispatch();
  const { user, tempToken, isLoadingProfile, isInitialized, isLoggingOut } =
    useAppSelector((state) => state.auth);

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle mouse enter
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  // Handle mouse leave with delay
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Close dropdown when clicking outside
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

  const handleAuthAction = (screen: AuthScreen) => {
    dispatch(openModal(screen));
    setIsOpen(false);
  };

  const handleAccountSetting = () => {
    Router.push("/settings/profile");
    setIsOpen(false);
  };

  const handleLogout = async () => {
    console.log("ðŸšª Logout button clicked");
    setIsOpen(false);
    try {
      // Call the logout API
      await dispatch(logoutUser()).unwrap();
      console.log("âœ… Logout completed successfully");
      dispatch(clearCart()); // This triggers cart clearing too
      Router.push("/"); // Redirect to home page after logout
    } catch (error) {
      console.log("âŒ Logout error:", error);
      // Even if API fails, the user will be logged out locally
    }
  };

  // Don't render anything until initialized
  if (!isInitialized) {
    return (
      <div className="p-2 rounded-full bg-white shadow-md">
        <Loader2 className="w-5 h-5 text-[#B11C5F] animate-spin" />
      </div>
    );
  }

  // If user is logged in, show user profile
  if (user?.isLoggedIn) {
    const getDisplayName = () => {
      if (user.display_name && user.display_name.trim()) {
        return user.display_name;
      }

      const firstName = user.fname || "";
      const lastName = user.lname || "";
      if (firstName || lastName) {
        return `${firstName} ${lastName}`.trim();
      }

      if (user.email) {
        return user.email.split("@")[0];
      }

      if (user.mobile) {
        return `User ${user.mobile.slice(-4)}`;
      }

      return "User";
    };

    const getFormattedMobile = () => {
      if (!user.mobile) return null;

      let mobile = user.mobile;
      if (mobile.startsWith("91") && mobile.length > 10) {
        mobile = mobile.substring(2);
      }

      if (mobile.length === 10) {
        return `${mobile.slice(0, 3)}-${mobile.slice(3, 6)}-${mobile.slice(6)}`;
      }

      return mobile;
    };

    const displayName = getDisplayName();
    const formattedMobile = getFormattedMobile();

    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={() => setIsOpen(!isOpen)}
          aria-haspopup="true"
          aria-expanded={isOpen}
          disabled={isLoggingOut}
          className="group relative p-2 rounded-full bg-white shadow-md hover:shadow-lg hover:bg-[#FFF6F8] transition-all duration-300 hover:scale-110">
          {isLoggingOut ? (
            <Loader2 className="w-5 h-5 text-[#B11C5F] animate-spin" />
          ) : user.profile_pic !== null ? (
            <Image
              src={user.profile_pic}
              alt={displayName}
              width={20}
              height={20}
              className="w-5 h-5 rounded-full object-cover"
            />
          ) : (
            <FiUser className="w-5 h-5 text-[#B11C5F] group-hover:text-[#F28C8C] transition-colors duration-300" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-[#F28C8C]/20 to-[#C59D5F]/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>

        {isOpen && (
          <div
            className="absolute right-0 top-full mt-5 w-64 bg-gradient-to-br from-[#FFF6F8] to-white backdrop-blur-md border border-[#F28C8C]/20 rounded-2xl shadow-2xl z-50"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}>
            {/* User Info */}
            <div className="p-4 border-b border-[#F28C8C]/20 bg-gradient-to-r from-[#F28C8C]/10 to-[#C59D5F]/10 rounded-t-2xl">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] rounded-full flex items-center justify-center">
                  {user.profile_pic !== null ? (
                    <Image
                      src={user.profile_pic}
                      alt={displayName}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <FiUser className="w-6 h-6 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-playfair font-bold text-[#B11C5F]">
                    {displayName}
                  </h3>
                  <p className="font-cormorant text-sm text-[#C59D5F] italic">
                    {user.email || formattedMobile || "Welcome!"}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              <button
                onClick={handleAccountSetting}
                className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-white/50 transition-all duration-300 group border border-transparent hover:border-[#F28C8C]/20">
                <div className="w-8 h-8 bg-gradient-to-r from-[#F28C8C]/20 to-[#C59D5F]/20 rounded-full flex items-center justify-center group-hover:from-[#F28C8C]/30 group-hover:to-[#C59D5F]/30 transition-colors duration-300">
                  <Settings className="w-4 h-4 text-[#B11C5F]" />
                </div>
                <span className="font-lato text-[#444444] group-hover:text-[#B11C5F] transition-colors duration-300">
                  Account Settings
                </span>
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-red-50 transition-all duration-300 group border border-transparent hover:border-red-200"
                disabled={isLoggingOut}>
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center group-hover:bg-red-200 transition-colors duration-300">
                  {isLoggingOut ? (
                    <Loader2 className="w-4 h-4 text-red-600 animate-spin" />
                  ) : (
                    <LogOut className="w-4 h-4 text-red-600" />
                  )}
                </div>
                <span className="font-lato text-red-600">
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </span>
              </button>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[#F28C8C]/20 bg-gradient-to-r from-[#FFF6F8] to-white rounded-b-2xl">
              <div className="text-center">
                <p className="font-cormorant text-sm text-[#C59D5F] italic">
                  Welcome to Kaya Beauty
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Show loading state if we have a token and are loading profile (page refresh scenario)
  if (tempToken && isLoadingProfile) {
    return (
      <div className="p-2 rounded-full bg-white shadow-md">
        <Loader2 className="w-5 h-5 text-[#B11C5F] animate-spin" />
      </div>
    );
  }

  // If user is not logged in, show login options (NEW USERS)
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className="group relative p-2 rounded-full bg-white shadow-md hover:shadow-lg hover:bg-[#FFF6F8] transition-all duration-300 hover:scale-110">
        <FiUser className="w-5 h-5 text-[#B11C5F] group-hover:text-[#F28C8C] transition-colors duration-300" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#F28C8C]/20 to-[#C59D5F]/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full mt-5 w-72 bg-gradient-to-br from-[#FFF6F8] to-white backdrop-blur-md border border-[#F28C8C]/20 rounded-2xl shadow-2xl z-50"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}>
          {/* Header */}
          <div className="p-6 text-center border-b border-[#F28C8C]/20 bg-gradient-to-r from-[#F28C8C]/10 to-[#C59D5F]/10 rounded-t-2xl">
            <div className="w-16 h-16 bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] rounded-full flex items-center justify-center mx-auto mb-4">
              <FiHeart className="w-8 h-8 text-white animate-pulse" />
            </div>
            <h3 className="font-playfair text-lg font-bold text-[#B11C5F] mb-1">
              Welcome Back!
            </h3>
            <p className="font-cormorant text-sm text-[#C59D5F] italic">
              Join Kaya Beauty today
            </p>
          </div>

          {/* Login Options */}
          <div className="p-4 space-y-3">
            <button
              onClick={() => handleAuthAction("login")}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] text-white font-lato font-medium py-3 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300 hover:from-[#B11C5F] hover:to-[#F28C8C] group">
              <UserPlus className="w-4 h-4" />
              <span>Sign In</span>
            </button>

            {/* <button
              onClick={() => handleAuthAction("signup")}
              className="w-full flex items-center justify-center space-x-2 bg-white border border-[#F28C8C]/30 text-[#B11C5F] font-lato font-medium py-3 rounded-full hover:bg-[#FFF6F8] hover:border-[#B11C5F] transition-all duration-300 group">
              <Sparkles className="w-4 h-4" />
              <span>Create Account</span>
            </button> */}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-[#F28C8C]/20 text-center bg-gradient-to-r from-[#FFF6F8] to-white rounded-b-2xl">
            <p className="font-cormorant text-xs text-[#C59D5F] italic mb-1">
              Secure & encrypted authentication
            </p>
            <p className="font-lato text-xs text-[#444444]">
              Your privacy is our priority
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
