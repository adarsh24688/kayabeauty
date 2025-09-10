"use client";

import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hook";
import { removeFromCart } from "@/store/slices/cartSlice";
import { useRouter, usePathname } from "next/navigation";
import { ChevronUp, ChevronDown, Trash2 } from "lucide-react";
import ClientOnly from "@/components/common/ClientOnly";

// Define props for the component, especially for the 'view' page functionality
interface BookingBottomBarProps {
  accepted?: boolean;
  handleCheckboxChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleOpenPolicyModal?: () => void;
  handleBookAppointment?: () => void;
}

// --- MAIN COMPONENT ---
const BookingBottomBar: React.FC<BookingBottomBarProps> = ({
  accepted,
  handleCheckboxChange,
  handleOpenPolicyModal,
  handleBookAppointment,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  // Redux state
  const cart = useAppSelector((state) => state.cart.items);
  const bookingState = useAppSelector((state) => state.booking);
  const { selectedDate, selectedSlot } = useAppSelector((state) => state.ui);

  // Local state for the dropdown view
  const [isExpanded, setIsExpanded] = useState(false);

  // Determine which page view to render based on the URL
  const pageType = pathname.endsWith("/view")
    ? "view"
    : pathname.endsWith("/slots")
    ? "slots"
    : "saloon-services";

  // Don't render the bar if the cart is empty, except on the final 'view' page
  if (cart.length === 0 && pageType !== "view") {
    return null;
  }

  // --- RENDER FUNCTIONS FOR EACH PAGE TYPE ---

  const renderServicesContent = () => (
    <>
      <div className="flex justify-between items-center">
        <div className="font-lato font-bold text-[#B11C5F]">
          {cart.length} {cart.length === 1 ? "Service" : "Services"} Added
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/saloon-services/slots")}
            className="px-6 py-2 bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] text-white font-lato font-semibold rounded-2xl hover:shadow-lg hover:from-[#B11C5F] hover:to-[#F28C8C] transition-all duration-300 hover:scale-105">
            Continue
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 bg-white/80 rounded-full text-[#B11C5F] hover:bg-[#FFF6F8] hover:scale-110 transition-all duration-300 border border-[#F28C8C]/30">
            {isExpanded ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
          </button>
        </div>
      </div>
      {isExpanded && (
        <div className="mt-4 border-t-2 border-[#F28C8C]/30 pt-4 max-h-60 overflow-y-auto">
          <ClientOnly
            fallback={
              <div className="text-[#C59D5F] font-lato">Loading...</div>
            }>
            {cart.map((item: any, index: number) => (
              <div
                key={`${item.id}-${index}`}
                className="flex justify-between items-center p-3 rounded-2xl hover:bg-[#FFF6F8] transition-all duration-300 border border-transparent hover:border-[#F28C8C]/20">
                <div>
                  <p className="text-[#444444] font-lato font-semibold">
                    {item.name}
                  </p>
                  <p className="text-[#C59D5F] text-sm font-lato">
                    {item.duration} min
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-bold text-[#B11C5F] font-lato">
                    ₹{item.price?.toFixed(2)}
                  </p>
                  <button
                    onClick={() => dispatch(removeFromCart(index))}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-2xl hover:scale-110 transition-all duration-300">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </ClientOnly>
        </div>
      )}
    </>
  );

  const renderSlotsContent = () => (
    <div className="flex justify-between items-center">
      <div className="font-lato font-bold text-[#B11C5F]">
        {cart.length} {cart.length === 1 ? "Service" : "Services"} Selected
      </div>
      <button
        onClick={() => router.push("/saloon-services/view")}
        disabled={!selectedDate || !selectedSlot}
        className="px-6 py-2 bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] text-white font-lato font-semibold rounded-2xl hover:shadow-lg hover:from-[#B11C5F] hover:to-[#F28C8C] transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
        Continue
      </button>
    </div>
  );

  const renderViewContent = () => (
    <div>
      <div className="flex items-start space-x-3 mb-4">
        <input
          type="checkbox"
          id="policyCheck"
          checked={accepted}
          onChange={handleCheckboxChange}
          className="mt-1 w-4 h-4 accent-[#B11C5F] bg-white border-[#F28C8C]/30 rounded focus:ring-[#B11C5F] focus:ring-2"
        />
        <label
          htmlFor="policyCheck"
          className="text-sm text-[#444444] font-lato">
          I have read and accept{" "}
          <button
            onClick={handleOpenPolicyModal}
            className="text-[#C59D5F] hover:text-[#B11C5F] hover:underline transition-colors font-semibold">
            all policies
          </button>
          .
        </label>
      </div>
      <button
        className={`w-full py-2 rounded-2xl font-lato font-bold sm:text-lg transition-all duration-300 ${
          accepted && !bookingState.loading
            ? "bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] text-white shadow-lg hover:from-[#B11C5F] hover:to-[#F28C8C] hover:scale-105"
            : "bg-gray-200 text-gray-500 cursor-not-allowed"
        }`}
        disabled={!accepted || bookingState.loading}
        onClick={handleBookAppointment}>
        {bookingState.loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white mr-2"></div>
            Creating Booking...
          </div>
        ) : (
          "Book Appointment"
        )}
      </button>
    </div>
  );

  return (
    <div className="sticky bottom-0 left-0 right-0 w-full p-2 sm:p-4 bg-gradient-to-t from-[#B11C5F]/80 via-[#F28C8C]/60 to-transparent z-30 md:hidden">
      <div className="max-w-3xl mx-auto bg-white/95 backdrop-blur-sm border-2 border-[#F28C8C]/30 rounded-2xl shadow-2xl p-4 transition-all duration-300">
        {pageType === "saloon-services" && renderServicesContent()}
        {pageType === "slots" && renderSlotsContent()}
        {pageType === "view" && renderViewContent()}
      </div>
    </div>
  );
};

export default BookingBottomBar;
