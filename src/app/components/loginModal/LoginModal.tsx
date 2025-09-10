"use client";

import type React from "react";
import { useEffect, useState } from "react";
import {
  Eye,
  EyeOff,
  ArrowLeft,
  X,
  User,
  Mail,
  Phone,
  Check,
  Loader2,
  Lock,
  Shield,
  Heart,
  Send,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import {
  sendOTP,
  verifyOTP,
  completeRegistration,
  loginWithPassword,
  clearError,
  resetOTPState,
  resetForgotPasswordState,
  getUserProfile,
  sendForgotPasswordOTP,
  resetPassword,
} from "@/store/slices/authSlice";
import { toastError } from "../common/toastService";
type ScreenType =
  | "login"
  | "password"
  | "forgot"
  | "otp"
  | "signup"
  | "success"
  | "reset-password";

interface UserData {
  fullName: string;
  email: string;
  mobile: string;
  isLoggedIn: boolean;
}

// Props now align with what the layout provides
interface LoginModalProps {
  show: boolean;
  onClose: () => void;
  screen: ScreenType;
  setScreen: (screen: ScreenType) => void;
  onUserLogin?: (userData: UserData) => void; // This is optional
}

export default function LoginModal({
  show,
  onClose,
  screen,
  setScreen,
  onUserLogin,
}: LoginModalProps) {
  const dispatch = useAppDispatch();
  const {
    isLoading,
    error,
    otpSent,
    otpSentTo,
    otpContact,
    isVerifying,
    isRegistering,
    user,
    alreadyRegistered,
    skipProfile,
    isLoadingProfile,
    forgotPasswordOtpSent,
    forgotPasswordOtpSentTo,
    forgotPasswordContact,
    isResettingPassword,
  } = useAppSelector((state) => state.auth);
  // console.log(user);
  const { selectedLocationUuid } = useAppSelector((state) => state.services);
  // const [customError, setCustomError] = useState<string | null>(null);
  const [tab, setTab] = useState<"mobile" | "email">("mobile");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [otp, setOtp] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [countryCode] = useState(91);
  const [showSuccessFor3Sec, setShowSuccessFor3Sec] = useState(false);
  const [fetchedUserAfterOTP, setFetchedUserAfterOTP] = useState(false);

  useEffect(() => {
    if (!show) {
      return;
    }
    console.log(error, "error occured==================");
    if (error) {
      if (screen === "password") {
        if (tab === "mobile") {
          toastError(
            "The mobile number or password you entered is incorrect. Please try again."
          );
        } else {
          toastError(
            "The email or password you entered is incorrect. Please try again."
          );
        }
      } else if (screen === "otp" || screen === "reset-password") {
        toastError(
          "The verification code is incorrect or has expired. Please check the code and try again."
        );
      } else if (screen === "forgot") {
        if (tab === "mobile") {
          toastError(
            "We couldn't find an account with that mobile number. Please check the number and try again."
          );
        } else {
          toastError(
            "We couldn't find an account with that email address. Please check the address and try again."
          );
        }
      } else if (screen === "login") {
        if (tab === "mobile") {
          toastError(
            "The mobile number you entered is incorrect. Please try again."
          );
        } else {
          toastError("The email you entered is incorrect. Please try again.");
        }
      } else if (screen === "signup") {
        toastError(
          "Could not create your account. The email or mobile number may already be in use. Please check your details and try again."
        );
      } else {
        toastError(error);
      }
    }
    // It's good practice to clear the error in Redux after showing it
    dispatch(clearError());
  }, [error, screen, tab, dispatch]);

  useEffect(() => {
    if (show) {
      setTab("mobile");
      setShowPassword(false);
      setShowConfirmPassword(false);
      setPhoneNumber("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setFullName("");
      setOtp("");
      setResetOtp("");
      setShowSuccessFor3Sec(false);
      setFetchedUserAfterOTP(false);
      dispatch(clearError());
      dispatch(resetOTPState());
      dispatch(resetForgotPasswordState());

      // Prevent scrolling when modal is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [show, dispatch]);

  // Handle successful login (when user is already registered and skip profile)
  useEffect(() => {
    if (
      alreadyRegistered &&
      skipProfile &&
      !isLoadingProfile &&
      !fetchedUserAfterOTP
    ) {
      // Fetch user profile after successful OTP verification
      dispatch(getUserProfile()).then((result) => {
        console.log(result, "==========getUserProfile result");
        if (result.type === "auth/getUserProfile/fulfilled") {
          setFetchedUserAfterOTP(true);
          setScreen("success");
          setShowSuccessFor3Sec(true);

          // Show success screen for 3 seconds
          setTimeout(() => {
            setShowSuccessFor3Sec(false);
            type PayloadType = {
              display_name?: string;
              fname?: string;
              lname?: string;
              email?: string;
              mobile?: string;
            };
            const payloadObj = result.payload as PayloadType;
            const userData: UserData = {
              fullName:
                payloadObj.display_name ||
                `${payloadObj.fname ?? ""} ${payloadObj.lname ?? ""}`,
              email: payloadObj.email || "",
              mobile: payloadObj.mobile || "",
              isLoggedIn: true,
            };
            // Log user data to console for debugging
            console.log(userData, "success user data");
            // Call the onUserLogin callback with user data if provided
            // This allows parent components to handle the login state
            onUserLogin?.(userData);
            onClose();
          }, 2000); // 3 seconds
        }
      });
    }
  }, [
    alreadyRegistered,
    skipProfile,
    isLoadingProfile,
    fetchedUserAfterOTP,
    dispatch,
    onUserLogin,
    onClose,
    setScreen,
  ]);

  // Handle when user data is available after OTP verification and profile fetch
  useEffect(() => {
    if (
      user &&
      user.isLoggedIn &&
      fetchedUserAfterOTP &&
      !showSuccessFor3Sec &&
      screen !== "success"
    ) {
      setScreen("success");
      setShowSuccessFor3Sec(true);

      // Show success screen for 3 seconds
      setTimeout(() => {
        setShowSuccessFor3Sec(false);
        const userData: UserData = {
          fullName: user.display_name || `${user.fname} ${user.lname}`,
          email: user.email || "",
          mobile: user.mobile || "",
          isLoggedIn: true,
        };
        onUserLogin?.(userData);
        onClose();
      }, 2000); // 3 seconds
    }
  }, [
    user,
    fetchedUserAfterOTP,
    showSuccessFor3Sec,
    screen,
    onUserLogin,
    onClose,
    setScreen,
  ]);

  // Auto navigate to OTP screen when OTP is sent
  useEffect(() => {
    if (otpSent) {
      setScreen("otp");
    }
  }, [otpSent, setScreen]);

  // Auto navigate to reset password screen when forgot password OTP is sent
  useEffect(() => {
    if (forgotPasswordOtpSent) {
      setScreen("reset-password");
    }
  }, [forgotPasswordOtpSent, setScreen]);

  if (!show) return null;

  const handleSendOTP = async () => {
    if (!selectedLocationUuid) {
      toastError("Please select a location first.");
      return;
    }

    const payload = {
      type: tab,
      vendorLocationUuid: selectedLocationUuid,
      ...(tab === "mobile"
        ? { mobile: phoneNumber, dialCode: countryCode, countryId: "1" }
        : { email }),
    };

    dispatch(sendOTP(payload));
  };

  const handleSendForgotPasswordOTP = async () => {
    if (!selectedLocationUuid) {
      toastError("Please select a location first.");
      return;
    }

    const payload = {
      type: tab,
      vendorLocationUuid: selectedLocationUuid,
      ...(tab === "mobile"
        ? { mobile: phoneNumber, dialCode: countryCode, countryId: "1" }
        : { email }),
    };

    dispatch(sendForgotPasswordOTP(payload));

    setResetOtp("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleVerifyOTP = async () => {
    if (!selectedLocationUuid) {
      toastError("Please select a location first.");
      return;
    }

    const payload = {
      type: otpSentTo!,
      otp,
      vendorLocationUuid: selectedLocationUuid,
      ...(otpSentTo === "mobile"
        ? { mobile: phoneNumber, dialCode: countryCode, countryId: "1" }
        : { email: email }),
    };

    console.log(payload, "verfiy otp eroor======================");

    const result = await dispatch(verifyOTP(payload));
    if (
      result.type === "auth/verifyOTP/fulfilled" &&
      result.payload &&
      typeof result.payload !== "string" &&
      result.payload.data &&
      result.payload.data.data
    ) {
      const { already_registered, skip_profile } = result.payload.data.data;
      console.log(already_registered, "already_registered=>>>>>>>>>>>>>>>>>>");
      console.log(skip_profile, "skip_profile=>>>>>>>>>>>>>>>>>>>>>");
      if (!already_registered || !skip_profile) {
        // New user needs to complete profile
        console.log("set signup screen");
        setScreen("signup");
      }
      // For existing users, the useEffect above will handle fetching profile and success screen
    }
  };

  const handleResetPassword = async () => {
    if (!selectedLocationUuid) {
      toastError("Please select a location first.");
      return;
    }

    if (password !== confirmPassword) {
      toastError("Passwords do not match. Please try again.");
      return;
    }

    const payload = {
      type: forgotPasswordOtpSentTo!,
      verificationCode: resetOtp,
      password,
      vendorLocationUuid: selectedLocationUuid,
      ...(forgotPasswordOtpSentTo === "mobile"
        ? { mobile: phoneNumber, dialCode: countryCode, countryId: "1" }
        : { email }),
    };

    const result = await dispatch(resetPassword(payload));
    if (result.type === "auth/resetPassword/fulfilled") {
      // Show success message and redirect to login
      setScreen("success");
      setShowSuccessFor3Sec(true);

      setTimeout(() => {
        setShowSuccessFor3Sec(false);
        setScreen("login");
        // Reset all form fields
        setPhoneNumber("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setResetOtp("");
        dispatch(resetForgotPasswordState());
      }, 3000);
    }
  };

  const handleCompleteSignup = async () => {
    if (!selectedLocationUuid) {
      toastError("Please select a location first.");
      return;
    }

    // Validate required fields based on verification method
    if (otpSentTo === "mobile" && !email) {
      toastError("Email is a required field.");
      return;
    }

    if (otpSentTo === "email" && !phoneNumber) {
      toastError("Mobile number is a required field.");
      return;
    }

    if (!fullName || !password) {
      toastError("Full name and password are required.");
      return;
    }

    // Make sure otpSentTo is not null before proceeding
    if (!otpSentTo) {
      toastError("Verification method not detected. Please try again.");
      return;
    }

    // Create a properly typed request body
    const requestBody: {
      password: string;
      name: string;
      mobile?: string;
      email?: string;
      vendor_location_uuid: string;
      verified_by: "mobile" | "email";
      gender: string;
      dial_code: string;
      country_id: string;
    } = {
      password: password,
      name: fullName,
      vendor_location_uuid: selectedLocationUuid,
      verified_by: otpSentTo, // Use the actual verification method without default
      gender: " ",
      dial_code: "91",
      country_id: "1",
    };

    // Add mobile or email based on verification method
    if (otpSentTo === "mobile") {
      // If verified by mobile, we already have the mobile number but need to collect email
      requestBody.mobile = `91${phoneNumber}`;
      requestBody.email = email;
    } else {
      // If verified by email, we already have the email but need to collect mobile
      requestBody.email = email;
      requestBody.mobile = `91${phoneNumber}`;
    }

    console.log("📤 Registration request body:", {
      ...requestBody,
      password: "***",
    });

    const result = await dispatch(
      completeRegistration({
        fullName,
        password,
        vendorLocationUuid: selectedLocationUuid,
        ...(otpSentTo === "mobile"
          ? { mobile: phoneNumber, email }
          : { email, mobile: phoneNumber }),
      })
    );

    if (result.type === "auth/completeRegistration/fulfilled") {
      setScreen("success");
      setShowSuccessFor3Sec(true);

      // Show success screen for 3 seconds
      setTimeout(() => {
        setShowSuccessFor3Sec(false);
        let userData: UserData = {
          fullName: "",
          email: "",
          mobile: "",
          isLoggedIn: true,
        };
        if (result.payload && typeof result.payload !== "string") {
          userData = {
            fullName:
              result.payload.display_name ||
              `${result.payload.fname ?? ""} ${result.payload.lname ?? ""}`,
            email: result.payload.email || "",
            mobile: result.payload.mobile || "",
            isLoggedIn: true,
          };
        }
        onUserLogin?.(userData);
        onClose();
      }, 3000); // 3 seconds
    }
  };

  const handlePasswordLogin = async () => {
    if (!selectedLocationUuid) {
      toastError("Please select a location first.");
      return;
    }

    const payload = {
      type: tab,
      password,
      vendorLocationUuid: selectedLocationUuid,
      ...(tab === "mobile" ? { mobile: phoneNumber } : { email }),
    };

    const result = await dispatch(loginWithPassword(payload));
    if (result.type === "auth/loginWithPassword/fulfilled") {
      setScreen("success");
      setShowSuccessFor3Sec(true);

      // Show success screen for 3 seconds
      setTimeout(() => {
        setShowSuccessFor3Sec(false);
        let userData: UserData = {
          fullName: "",
          email: "",
          mobile: "",
          isLoggedIn: true,
        };
        if (result.payload && typeof result.payload !== "string") {
          userData = {
            fullName:
              result.payload.display_name ||
              `${result.payload.fname ?? ""} ${result.payload.lname ?? ""}`,
            email: result.payload.email || "",
            mobile: result.payload.mobile || "",
            isLoggedIn: true,
          };
        }
        onUserLogin?.(userData);
        onClose();
      }, 3000); // 3 seconds
    }
  };

  const renderTabs = () => (
    <div className="flex mb-6 bg-white/10 backdrop-blur-sm rounded-2xl p-1 border border-[#F28C8C]/20">
      <button
        className={`flex-1 py-3 rounded-xl font-lato font-medium text-sm transition-all duration-300
        ${
          tab === "mobile"
            ? "bg-[#F28C8C] text-white shadow-lg shadow-[#F28C8C]/30"
            : "bg-transparent text-[#C59D5F] hover:text-[#B11C5F] hover:bg-white/20"
        }`}
        onClick={() => setTab("mobile")}>
        Mobile
      </button>
      <button
        className={`flex-1 py-3 rounded-xl font-lato font-medium text-sm transition-all duration-300
        ${
          tab === "email"
            ? "bg-[#F28C8C] text-white shadow-lg shadow-[#F28C8C]/30"
            : "bg-transparent text-[#C59D5F] hover:text-[#B11C5F] hover:bg-white/20"
        }`}
        onClick={() => setTab("email")}>
        Email
      </button>
    </div>
  );

  const renderLoginScreen = () => (
    <>
      {/* Close Button - keeping original functionality */}
      <div className="flex justify-end">
        <button
          className="p-2 rounded-full hover:bg-white/50 text-[#B11C5F] hover:text-[#F28C8C] transition-all duration-300 hover:scale-110"
          onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      {/* Header with Kaya spa styling */}
      <div className="mb-6 text-center">
        <h3 className="font-playfair font-bold text-2xl mb-2 text-[#B11C5F]">
          Login or sign up
        </h3>
        <p className="font-cormorant italic text-sm text-[#C59D5F]">
          Login or sign up using your mobile number or email address
        </p>
      </div>

      {/* Render tabs */}
      {renderTabs()}

      {/* Mobile/Email Input with Kaya spa theme */}
      {tab === "mobile" ? (
        <div className="mb-5">
          <label className="block font-lato font-medium text-sm text-[#B11C5F] mb-2">
            Mobile Number*
          </label>
          <div className="flex rounded-2xl overflow-hidden bg-white/80 border-2 border-[#F28C8C]/30 focus-within:border-[#B11C5F] focus-within:ring-2 focus-within:ring-[#F28C8C]/20 transition-all duration-300">
            <button
              className="px-4 bg-gradient-to-r from-[#F28C8C]/10 to-[#C59D5F]/10 text-[#B11C5F] font-semibold text-sm border-r border-[#F28C8C]/20"
              type="button">
              +{countryCode}
            </button>
            <input
              type="tel"
              className="flex-1 bg-transparent text-[#444444] placeholder-[#C59D5F] px-4 py-3 focus:outline-none font-lato"
              placeholder="9977004451"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
        </div>
      ) : (
        <div className="mb-5">
          <label className="block font-lato font-medium text-sm text-[#B11C5F] mb-2">
            Email Address*
          </label>
          <input
            type="email"
            className="w-full rounded-2xl bg-white/80 border-2 border-[#F28C8C]/30 text-[#444444] placeholder-[#C59D5F] px-4 py-3 focus:outline-none focus:border-[#B11C5F] focus:ring-2 focus:ring-[#F28C8C]/20 transition-all duration-300 font-lato"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      )}

      {/* Primary Button with Kaya spa styling */}
      <button
        className="group relative w-full py-3 mb-4 rounded-2xl bg-[#F28C8C] text-white font-lato font-semibold shadow-lg hover:shadow-xl transform  transition-all duration-300 hover:from-[#B11C5F] hover:to-[#F28C8C] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden"
        onClick={handleSendOTP}
        disabled={
          isLoading ||
          (!phoneNumber && tab === "mobile") ||
          (!email && tab === "email")
        }>
        {/* Button shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

        <span className="relative flex items-center justify-center">
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Sending...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Send Verification Code
            </>
          )}
        </span>
      </button>

      {/* Divider with Kaya spa styling */}
      <div className="flex items-center my-6">
        <span className="flex-1 h-px bg-gradient-to-r from-transparent via-[#F28C8C]/30 to-transparent"></span>
        <span className="mx-4 text-[#C59D5F] font-cormorant italic text-sm">
          Or
        </span>
        <span className="flex-1 h-px bg-gradient-to-r from-transparent via-[#F28C8C]/30 to-transparent"></span>
      </div>

      {/* Secondary Button with Kaya spa styling */}
      <button
        className="w-full py-3 rounded-2xl border-2 border-[#F28C8C]/30 text-[#B11C5F] font-lato font-medium hover:bg-[#FFF6F8] hover:border-[#B11C5F] transition-all duration-300"
        onClick={() => setScreen("password")}>
        <Lock className="w-4 h-4 inline-block mr-2" />
        Login with password
      </button>
    </>
  );

  const renderOTPScreen = () => (
    <>
      <div className="flex justify-between items-center">
        <button
          className="p-2 rounded-full hover:bg-white/50 text-[#B11C5F] hover:text-[#F28C8C] transition-colors duration-300"
          onClick={() => setScreen("login")}>
          <ArrowLeft size={18} />
        </button>
        <button
          className="p-2 rounded-full hover:bg-white/50 text-[#B11C5F] hover:text-[#F28C8C] transition-colors duration-300"
          onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      <div className="mb-6">
        <h3 className="text-center font-playfair font-bold text-2xl mb-2 text-[#B11C5F]">
          Verify OTP
        </h3>
        <p className="text-center font-cormorant italic text-sm text-[#C59D5F]">
          We&apos;ve sent a verification code to your{" "}
          <span className="text-[#B11C5F] font-semibold">{otpContact}</span>
        </p>
      </div>

      <div className="mb-5">
        <label className="block font-lato font-medium text-sm text-[#B11C5F] mb-2">
          Enter OTP*
        </label>
        <input
          type="text"
          className="w-full rounded-2xl px-4 py-3 bg-white/80 border-2 border-[#F28C8C]/30 focus:border-[#B11C5F] text-[#444444] placeholder-[#C59D5F] focus:outline-none transition-all duration-300 text-center tracking-widest font-lato"
          placeholder="0000"
          maxLength={4}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
        />
      </div>

      <button
        className="w-full py-3 mb-4 rounded-2xl font-lato font-semibold bg-[#F28C8C] text-white hover:shadow-lg hover:from-[#B11C5F] hover:to-[#F28C8C] transition-all duration-300 transform hover:bg-[#F28C8C]/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        onClick={handleVerifyOTP}
        disabled={isVerifying || otp.length !== 4}>
        {isVerifying ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Verifying...
          </>
        ) : (
          "Verify OTP"
        )}
      </button>

      <div className="text-center">
        <button
          className="text-[#C59D5F] hover:text-[#B11C5F] font-lato font-medium text-sm transition-colors duration-300 disabled:opacity-50"
          onClick={handleSendOTP}
          disabled={isLoading}>
          {isLoading ? "Sending..." : "Resend OTP"}
        </button>
      </div>
    </>
  );

  const renderSignupScreen = () => (
    <>
      <div className="flex justify-between items-center">
        <button
          className="p-2 rounded-full hover:bg-white/50 text-[#B11C5F] hover:text-[#F28C8C] transition-colors duration-300"
          onClick={() => setScreen("otp")}>
          <ArrowLeft size={18} />
        </button>
        <button
          className="p-2 rounded-full hover:bg-white/50 text-[#B11C5F] hover:text-[#F28C8C] transition-colors duration-300"
          onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      <div className="mb-6">
        <h3 className="text-center font-playfair font-bold text-2xl mb-2 text-[#B11C5F]">
          Complete Your Profile
        </h3>
        <p className="text-center font-cormorant italic text-sm text-[#C59D5F]">
          Please fill in your details to create your account
        </p>
      </div>

      <div className="space-y-4 mb-5">
        <div>
          <label className="block font-lato font-medium text-sm text-[#B11C5F] mb-2">
            Full Name*
          </label>
          <div className="relative">
            <User
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#C59D5F]"
              size={16}
            />
            <input
              type="text"
              className="w-full rounded-2xl pl-10 pr-4 py-3 bg-white/80 border-2 border-[#F28C8C]/30 focus:border-[#B11C5F] text-[#444444] placeholder-[#C59D5F] focus:outline-none transition-all duration-300 font-lato"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
        </div>

        {otpSentTo === "mobile" ? (
          <div>
            <label className="block font-lato font-medium text-sm text-[#B11C5F] mb-2">
              Email Address*
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#C59D5F]"
                size={16}
              />
              <input
                type="email"
                className="w-full rounded-2xl pl-10 pr-4 py-3 bg-white/80 border-2 border-[#F28C8C]/30 focus:border-[#B11C5F] text-[#444444] placeholder-[#C59D5F] focus:outline-none transition-all duration-300 font-lato"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
        ) : (
          <div>
            <label className="block font-lato font-medium text-sm text-[#B11C5F] mb-2">
              Mobile Number*
            </label>
            <div className="relative">
              <Phone
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#C59D5F]"
                size={16}
              />
              <div className="flex rounded-2xl overflow-hidden bg-white/80 border-2 border-[#F28C8C]/30 focus-within:border-[#B11C5F] transition-all duration-300">
                <button
                  className="px-4 bg-gradient-to-r from-[#F28C8C]/10 to-[#C59D5F]/10 text-[#B11C5F] font-semibold text-sm border-r border-[#F28C8C]/20"
                  type="button">
                  +{countryCode}
                </button>
                <input
                  type="tel"
                  className="flex-1 px-4 py-3 bg-transparent text-[#444444] placeholder-[#C59D5F] focus:outline-none font-lato"
                  placeholder="9977004439"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="block font-lato font-medium text-sm text-[#B11C5F] mb-2">
            Password*
          </label>
          <div className="flex items-center rounded-2xl overflow-hidden bg-white/80 border-2 border-[#F28C8C]/30 focus-within:border-[#B11C5F] transition-all duration-300">
            <input
              type={showPassword ? "text" : "password"}
              className="flex-1 px-4 py-3 bg-transparent text-[#444444] placeholder-[#C59D5F] focus:outline-none font-lato"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="px-4 py-3 bg-transparent text-[#C59D5F] hover:text-[#B11C5F] transition-colors duration-300"
              type="button"
              onClick={() => setShowPassword((v) => !v)}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
      </div>

      <button
        className="w-full py-3 mb-4 rounded-2xl font-lato font-semibold bg-[#F28C8C] text-white hover:shadow-lg hover:from-[#B11C5F] hover:to-[#F28C8C] transition-all duration-300 transform hover:bg-[#F28C8C]/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        onClick={handleCompleteSignup}
        disabled={isRegistering || !fullName || !password}>
        {isRegistering ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Creating Account...
          </>
        ) : (
          "Create Account"
        )}
      </button>
    </>
  );

  const renderSuccessScreen = () => (
    <div className="text-center py-8">
      <div className="mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
          <Check className="text-white" size={32} />
        </div>
        <h3 className="font-playfair font-bold text-2xl mb-2 text-[#B11C5F]">
          {screen === "success" && isResettingPassword
            ? "Password Reset Successfully!"
            : alreadyRegistered
            ? "Welcome Back to Kaya Beauty!"
            : "Welcome to Kaya Beauty!"}
        </h3>
        <p className="font-cormorant italic text-sm text-[#C59D5F]">
          {screen === "success" && isResettingPassword
            ? "Your password has been reset successfully. You can now login with your new password."
            : alreadyRegistered
            ? "You have been logged in successfully"
            : "Your account has been created successfully"}
        </p>
      </div>

      {user && !isResettingPassword && (
        <div className="bg-white/80 rounded-2xl p-4 mb-6 border border-[#F28C8C]/20">
          <p className="font-lato font-semibold text-[#B11C5F]">
            Hello,{" "}
            {user?.display_name || `${user?.fname} ${user?.lname}` || fullName}!
          </p>
          <p className="font-cormorant italic text-sm text-[#C59D5F]">
            You are now logged in and ready to explore
          </p>
        </div>
      )}

      {/* 3-second countdown indicator */}
      {showSuccessFor3Sec && (
        <div className="mt-4">
          <div className="w-full bg-[#F28C8C]/20 rounded-full h-2 mb-2">
            <div className="bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] h-2 rounded-full animate-shrink"></div>
          </div>
          <p className="font-lato text-xs text-[#C59D5F]">
            {screen === "success" && isResettingPassword
              ? "Redirecting to login..."
              : "Redirecting in a moment..."}
          </p>

          <style jsx>{`
            @keyframes shrink {
              from {
                width: 100%;
              }
              to {
                width: 0%;
              }
            }

            .animate-shrink {
              animation: shrink 3s linear forwards;
            }
          `}</style>
        </div>
      )}
    </div>
  );

  const renderPasswordScreen = () => (
    <>
      <div className="flex justify-end">
        <button
          className="p-2 rounded-full hover:bg-white/50 text-[#B11C5F] hover:text-[#F28C8C] transition-colors duration-300"
          onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      <div className="mb-6">
        <h3 className="text-center font-playfair font-bold text-2xl mb-2 text-[#B11C5F]">
          Get Logged In!
        </h3>
        <p className="text-center font-cormorant italic text-sm text-[#C59D5F]">
          Login using your mobile number or email address
        </p>
      </div>

      {/* {renderErrors()} */}
      {renderTabs()}

      {tab === "mobile" ? (
        <div className="mb-4">
          <label className="block font-lato font-medium text-sm text-[#B11C5F] mb-2">
            Mobile Number*
          </label>
          <div className="flex rounded-2xl overflow-hidden bg-white/80 border-2 border-[#F28C8C]/30 focus-within:border-[#B11C5F] transition-all duration-300">
            <button
              className="px-4 bg-gradient-to-r from-[#F28C8C]/10 to-[#C59D5F]/10 text-[#B11C5F] font-semibold text-sm border-r border-[#F28C8C]/20"
              type="button">
              +{countryCode}
            </button>
            <input
              type="tel"
              className="flex-1 px-4 py-3 bg-transparent text-[#444444] placeholder-[#C59D5F] focus:outline-none font-lato"
              placeholder="9977004451"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
        </div>
      ) : (
        <div className="mb-4">
          <label className="block font-lato font-medium text-sm text-[#B11C5F] mb-2">
            Email Address*
          </label>
          <input
            type="email"
            className="w-full rounded-2xl px-4 py-3 bg-white/80 border-2 border-[#F28C8C]/30 focus:border-[#B11C5F] text-[#444444] placeholder-[#C59D5F] focus:outline-none transition-all duration-300 font-lato"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      )}

      <div className="mb-5">
        <label className="block font-lato font-medium text-sm text-[#B11C5F] mb-2">
          Password*
        </label>
        <div className="flex items-center rounded-2xl overflow-hidden bg-white/80 border-2 border-[#F28C8C]/30 focus-within:border-[#B11C5F] transition-all duration-300">
          <input
            type={showPassword ? "text" : "password"}
            className="flex-1 px-4 py-3 bg-transparent text-[#444444] placeholder-[#C59D5F] focus:outline-none font-lato"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="px-4 py-3 bg-transparent text-[#C59D5F] hover:text-[#B11C5F] transition-colors duration-300"
            type="button"
            onClick={() => setShowPassword((v) => !v)}>
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <div className="text-right mt-2">
          <button
            className="text-[#C59D5F] hover:text-[#B11C5F] font-lato font-medium text-sm transition-colors duration-300"
            onClick={() => setScreen("forgot")}>
            Forgot Password?
          </button>
        </div>
      </div>

      <button
        className="w-full py-3 mb-4 rounded-2xl font-lato font-semibold bg-[#F28C8C] text-white hover:shadow-lg hover:from-[#B11C5F] hover:to-[#F28C8C] transition-all duration-300 transform hover:bg-[#F28C8C]/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        onClick={handlePasswordLogin}
        disabled={
          isLoading ||
          !password ||
          (!phoneNumber && tab === "mobile") ||
          (!email && tab === "email")
        }>
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Logging in...
          </>
        ) : (
          "Login"
        )}
      </button>

      <div className="flex items-center my-4">
        <span className="flex-1 h-px bg-[#F28C8C]/30"></span>
        <span className="mx-3 text-[#C59D5F] font-lato text-xs">Or</span>
        <span className="flex-1 h-px bg-[#F28C8C]/30"></span>
      </div>

      <button
        className="w-full py-3 rounded-2xl font-lato font-medium border-2 border-[#F28C8C]/30 text-[#B11C5F] hover:bg-[#F28C8C]/10 hover:border-[#B11C5F] transition-all duration-300"
        onClick={() => setScreen("login")}>
        Sign up or login with Verification Code
      </button>
    </>
  );

  const renderForgotPasswordScreen = () => (
    <>
      <div className="flex justify-between items-center">
        <button
          className="p-2 rounded-full hover:bg-white/50 text-[#B11C5F] hover:text-[#F28C8C] transition-colors duration-300"
          onClick={() => setScreen("password")}>
          <ArrowLeft size={18} />
        </button>
        <button
          className="p-2 rounded-full hover:bg-white/50 text-[#B11C5F] hover:text-[#F28C8C] transition-colors duration-300"
          onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      <div className="mb-6">
        <h3 className="text-center font-playfair font-bold text-2xl mb-2 text-[#B11C5F]">
          Forgot Password
        </h3>
        <p className="text-center font-cormorant italic text-sm text-[#C59D5F]">
          Please enter your registered email/mobile number to reset your
          password.
        </p>
      </div>

      {/* {renderErrors()} */}
      {renderTabs()}

      {tab === "mobile" ? (
        <div className="mb-5">
          <label className="block font-lato font-medium text-sm text-[#B11C5F] mb-2">
            Mobile Number*
          </label>
          <div className="flex rounded-2xl overflow-hidden bg-white/80 border-2 border-[#F28C8C]/30 focus-within:border-[#B11C5F] transition-all duration-300">
            <button
              className="px-4 bg-gradient-to-r from-[#F28C8C]/10 to-[#C59D5F]/10 text-[#B11C5F] font-semibold text-sm border-r border-[#F28C8C]/20"
              type="button">
              +{countryCode}
            </button>
            <input
              type="tel"
              className="flex-1 px-4 py-3 bg-transparent text-[#444444] placeholder-[#C59D5F] focus:outline-none font-lato"
              placeholder="9977004451"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
        </div>
      ) : (
        <div className="mb-5">
          <label className="block font-lato font-medium text-sm text-[#B11C5F] mb-2">
            Email Address*
          </label>
          <input
            type="email"
            className="w-full rounded-2xl px-4 py-3 bg-white/80 border-2 border-[#F28C8C]/30 focus:border-[#B11C5F] text-[#444444] placeholder-[#C59D5F] focus:outline-none transition-all duration-300 font-lato"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      )}

      <button
        className="w-full py-3 mb-4 rounded-2xl font-lato font-semibold bg-[#F28C8C] text-white hover:shadow-lg hover:from-[#B11C5F] hover:to-[#F28C8C] transition-all duration-300 transform hover:bg-[#F28C8C]/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        onClick={handleSendForgotPasswordOTP}
        disabled={
          isLoading ||
          (!phoneNumber && tab === "mobile") ||
          (!email && tab === "email")
        }>
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Sending...
          </>
        ) : (
          "Send Code"
        )}
      </button>
    </>
  );

  const renderResetPasswordScreen = () => (
    <>
      <div className="flex justify-between items-center">
        <button
          className="p-2 rounded-full hover:bg-white/50 text-[#B11C5F] hover:text-[#F28C8C] transition-colors duration-300"
          onClick={() => setScreen("forgot")}>
          <ArrowLeft size={18} />
        </button>
        <button
          className="p-2 rounded-full hover:bg-white/50 text-[#B11C5F] hover:text-[#F28C8C] transition-colors duration-300"
          onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      <div className="mb-6">
        <h3 className="text-center font-playfair font-bold text-2xl mb-2 text-[#B11C5F]">
          Set New Password
        </h3>
        <p className="text-center font-cormorant italic text-sm text-[#C59D5F]">
          We&apos;ve sent a verification code to your{" "}
          <span className="text-[#B11C5F] font-semibold">
            {forgotPasswordContact}
          </span>
        </p>
      </div>

      {/* {renderErrors()} */}

      <div className="space-y-4 mb-5">
        <div>
          <label className="block font-lato font-medium text-sm text-[#B11C5F] mb-2">
            Verification Code*
          </label>
          <div className="relative">
            <Shield
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#C59D5F]"
              size={16}
            />
            <input
              type="text"
              className="w-full rounded-2xl pl-10 pr-4 py-3 bg-white/80 border-2 border-[#F28C8C]/30 focus:border-[#B11C5F] text-[#444444] placeholder-[#C59D5F] focus:outline-none transition-all duration-300 text-center tracking-widest font-lato"
              placeholder="0000"
              maxLength={4}
              value={resetOtp}
              onChange={(e) => setResetOtp(e.target.value.replace(/\D/g, ""))}
            />
          </div>
        </div>

        <div>
          <label className="block font-lato font-medium text-sm text-[#B11C5F] mb-2">
            New Password*
          </label>
          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#C59D5F]"
              size={16}
            />
            <input
              type={showPassword ? "text" : "password"}
              className="w-full rounded-2xl pl-10 pr-12 py-3 bg-white/80 border-2 border-[#F28C8C]/30 focus:border-[#B11C5F] text-[#444444] placeholder-[#C59D5F] focus:outline-none transition-all duration-300 font-lato"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#C59D5F] hover:text-[#B11C5F] transition-colors duration-300"
              type="button"
              onClick={() => setShowPassword((v) => !v)}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block font-lato font-medium text-sm text-[#B11C5F] mb-2">
            Confirm Password*
          </label>
          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#C59D5F]"
              size={16}
            />
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="w-full rounded-2xl pl-10 pr-12 py-3 bg-white/80 border-2 border-[#F28C8C]/30 focus:border-[#B11C5F] text-[#444444] placeholder-[#C59D5F] focus:outline-none transition-all duration-300 font-lato"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#C59D5F] hover:text-[#B11C5F] transition-colors duration-300"
              type="button"
              onClick={() => setShowConfirmPassword((v) => !v)}>
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
      </div>

      <button
        className="w-full py-3 mb-4 rounded-2xl font-lato font-semibold bg-[#F28C8C] text-white hover:shadow-lg hover:from-[#B11C5F] hover:to-[#F28C8C] transition-all duration-300 transform hover:bg-[#F28C8C]/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        onClick={handleResetPassword}
        disabled={
          isResettingPassword ||
          !resetOtp ||
          !password ||
          !confirmPassword ||
          password !== confirmPassword ||
          resetOtp.length !== 4
        }>
        {isResettingPassword ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Changing Password...
          </>
        ) : (
          "Change Password"
        )}
      </button>

      <div className="text-center">
        <button
          className="text-[#C59D5F] hover:text-[#B11C5F] font-lato font-medium text-sm transition-colors duration-300 disabled:opacity-50"
          onClick={handleSendForgotPasswordOTP}
          disabled={isLoading}>
          {isLoading ? "Sending..." : "Resend OTP"}
        </button>
      </div>
    </>
  );

  return (
    <div className="fixed inset-0 z-[1050] flex items-center justify-center bg-gradient-to-br from-black/30 via-black/30 to-black/30 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md mx-auto animate-scaleIn">
        <div className="relative rounded-3xl overflow-hidden">
          {/* Animated Kaya spa gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-[#FFF6F8] to-[#FFEEF2] animate-gradientShift" />

          {/* Kaya spa floating particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute w-3 h-3 bg-gradient-to-r from-[#F28C8C]/30 to-[#C59D5F]/30 rounded-full animate-float1"
              style={{ top: "10%", left: "20%" }}
            />
            <div
              className="absolute w-4 h-4 bg-gradient-to-l from-[#B11C5F]/20 to-[#F28C8C]/20 rounded-full animate-float2"
              style={{ top: "70%", left: "80%" }}
            />
            <div
              className="absolute w-2 h-2 bg-[#C59D5F]/20 rounded-full animate-float3"
              style={{ top: "30%", left: "60%" }}
            />
            <div
              className="absolute w-1 h-1 bg-[#F28C8C]/30 rounded-full animate-float1"
              style={{ top: "80%", left: "30%" }}
            />
          </div>

          {/* Decorative top border */}
          <div className="h-2 bg-gradient-to-r from-[#F28C8C] via-[#C59D5F] to-[#B11C5F]"></div>

          {/* Modal content with Kaya spa theme */}
          <div className="relative p-6 sm:p-8 bg-gradient-to-b from-white to-[#FFF6F8]">
            {/* Show loading state when fetching profile */}
            {isLoadingProfile ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 border-4 border-[#F28C8C] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="font-lato text-[#444444]">
                  Loading your profile...
                </p>
              </div>
            ) : (
              <>
                {screen === "login" && renderLoginScreen()}
                {screen === "otp" && renderOTPScreen()}
                {screen === "signup" && renderSignupScreen()}
                {screen === "success" && renderSuccessScreen()}
                {screen === "password" && renderPasswordScreen()}
                {screen === "forgot" && renderForgotPasswordScreen()}
                {screen === "reset-password" && renderResetPasswordScreen()}
              </>
            )}
          </div>

          {/* Bottom decorative border */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#F28C8C]/50 to-transparent" />
        </div>
      </div>

      {/* Kaya spa theme custom animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            transform: translateY(20px) scale(0.98);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }

        @keyframes gradientShift {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes float1 {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          25% {
            transform: translateY(-8px) translateX(3px);
          }
          50% {
            transform: translateY(-12px) translateX(-2px);
          }
          75% {
            transform: translateY(-6px) translateX(4px);
          }
        }

        @keyframes float2 {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          33% {
            transform: translateY(-15px) translateX(-5px);
          }
          66% {
            transform: translateY(-8px) translateX(6px);
          }
        }

        @keyframes float3 {
          0%,
          100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-10px) scale(1.1);
          }
        }

        @keyframes shimmer {
          from {
            background-position: -200% center;
          }
          to {
            background-position: 200% center;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }

        .animate-scaleIn {
          animation: scaleIn 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        .animate-gradientShift {
          animation: gradientShift 12s ease infinite;
          background-size: 200% 200%;
        }

        .animate-float1 {
          animation: float1 6s ease-in-out infinite;
        }

        .animate-float2 {
          animation: float2 8s ease-in-out infinite;
        }

        .animate-float3 {
          animation: float3 7s ease-in-out infinite;
        }

        .animate-shimmer {
          animation: shimmer 2.5s ease-in-out infinite;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent
          );
          background-size: 200% 100%;
        }

        /* Kaya spa button styles */
        .btn-kaya-primary {
          background: linear-gradient(90deg, #f28c8c 0%, #c59d5f 100%);
          color: white;
          font-family: "Lato", sans-serif;
          font-weight: 600;
          padding: 12px 24px;
          border-radius: 9999px;
          box-shadow: 0 8px 20px rgba(242, 140, 140, 0.3);
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .btn-kaya-primary:hover {
          background: linear-gradient(90deg, #b11c5f 0%, #f28c8c 100%);
          box-shadow: 0 12px 25px rgba(242, 140, 140, 0.4);
          transform: scale(1.05);
        }

        .btn-kaya-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        /* Kaya spa input styles */
        .input-kaya {
          font-family: "Lato", sans-serif;
          border: 2px solid rgba(197, 157, 95, 0.3);
          border-radius: 9999px;
          padding: 12px 16px;
          width: 100%;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(8px);
          transition: all 0.3s ease;
          outline: none;
        }

        .input-kaya:focus {
          border-color: #f28c8c;
          box-shadow: 0 0 0 3px rgba(242, 140, 140, 0.1);
          background: rgba(255, 255, 255, 0.95);
        }

        .input-kaya::placeholder {
          color: #c59d5f;
          opacity: 0.7;
        }

        /* Kaya spa text styles */
        .text-kaya-primary {
          font-family: "Playfair Display", serif;
          color: #b11c5f;
          font-weight: 700;
        }

        .text-kaya-secondary {
          font-family: "Cormorant", serif;
          color: #c59d5f;
          font-style: italic;
        }

        .text-kaya-body {
          font-family: "Lato", sans-serif;
          color: #444444;
          font-weight: 400;
        }

        /* Kaya spa modal enhancements */
        .modal-kaya {
          border-radius: 1.5rem;
          box-shadow: 0 20px 25px -5px rgba(177, 31, 94, 0.1),
            0 10px 10px -5px rgba(177, 31, 94, 0.04);
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: saturate(180%) blur(20px);
          border: 1px solid rgba(242, 140, 140, 0.2);
        }

        /* Loading spinner */
        .spinner-kaya {
          border: 3px solid rgba(242, 140, 140, 0.3);
          border-radius: 50%;
          border-top: 3px solid #f28c8c;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        /* Smooth transitions for screen changes */
        .screen-transition {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Success checkmark animation */
        @keyframes checkmark {
          0% {
            stroke-dasharray: 44;
            stroke-dashoffset: 44;
          }
          100% {
            stroke-dasharray: 44;
            stroke-dashoffset: 0;
          }
        }

        .animate-checkmark {
          animation: checkmark 0.6s ease-in-out;
        }
      `}</style>
    </div>
  );
}
