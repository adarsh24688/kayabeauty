"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react"; // Added Eye, EyeOff, and a better Loader
import {
  changePassword,
  resetChangePasswordState,
} from "@/store/slices/changePasswordSlice";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { toastError, toastSuccess } from "@/components/common/toastService";

export default function ChangePasswordPage() {
  const { selectedLocationUuid } = useAppSelector((state) => state.services);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState("");

  // --- ENHANCEMENT: State for password visibility ---
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const dispatch = useAppDispatch();
  const {
    loading,
    error: apiError,
    successMessage,
  } = useAppSelector((state) => state.changePassword);

  useEffect(() => {
    return () => {
      dispatch(resetChangePasswordState());
    };
  }, [dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (newPassword.length < 8) {
      toastError("New password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toastError("New and confirm passwords do not match.");
      return;
    }

    if (apiError) {
      toastError("Network error. Please try again.");
    }

    dispatch(
      changePassword({
        old_password: currentPassword,
        new_password: newPassword,
        vendor_location_uuid: selectedLocationUuid,
      })
    );
  };

  useEffect(() => {
    if (successMessage) {
      toastSuccess(successMessage);
      setCurrentPassword("");
      setConfirmPassword("");
      setNewPassword("");
    }
  }, [successMessage]);

  return (
    // --- ENHANCEMENT: Responsive padding for the page container ---
    <div className="lg:w-3/4 bg-white/95 backdrop-blur-sm overflow-hidden shadow-2xl">
      <main className="w-full max-w-md bg-white/95 backdrop-blur-sm text-[#444444] rounded-2xl  p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-playfair font-bold mb-6 text-[#B11C5F] text-center">
          Change Password
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* --- Current Password with Visibility Toggle --- */}
          <div>
            <label className="block text-sm mb-2 text-[#C59D5F] font-lato font-medium">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-[#F28C8C]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#B11C5F] text-[#444444] pr-10 font-lato transition-all duration-300"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-[#C59D5F] hover:text-[#B11C5F] transition-colors duration-300">
                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* --- New Password with Visibility Toggle --- */}
          <div>
            <label className="block text-sm mb-2 text-[#C59D5F] font-lato font-medium">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-[#F28C8C]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#B11C5F] text-[#444444] pr-10 font-lato transition-all duration-300"
                required
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-[#C59D5F] hover:text-[#B11C5F] transition-colors duration-300">
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* --- Confirm Password with Visibility Toggle --- */}
          <div>
            <label className="block text-sm mb-2 text-[#C59D5F] font-lato font-medium">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-[#F28C8C]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#B11C5F] text-[#444444] pr-10 font-lato transition-all duration-300"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-[#C59D5F] hover:text-[#B11C5F] transition-colors duration-300">
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading === "pending"}
            className="w-full bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] text-white py-2.5 rounded-2xl font-lato font-semibold hover:shadow-lg hover:from-[#B11C5F] hover:to-[#F28C8C] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transform">
            {loading === "pending" ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                Changing...
              </>
            ) : (
              "Change Password"
            )}
          </button>
        </form>
      </main>
    </div>
  );
}
