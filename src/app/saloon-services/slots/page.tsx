"use client";

import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import {
  setCart,
  saveCartToStorage,
  clearBookingDetailsFromCart,
} from "@/store/slices/cartSlice";
import {
  setSelectedDate,
  setSelectedOperator,
  setSelectedSlot,
} from "@/store/slices/uiSlice";
import { filterOperatorsByServices } from "@/store/slices/operatorsSlice";
import {
  fetchTimeSlots,
  resetTimeSlotsError,
} from "@/store/slices/timeSlotsSlice";
import LeftPanel from "@/components/leftPanel/LeftPanel";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toastError, toastWarning } from "@/components/common/toastService"; // Ensure toastWarning is imported
import BookingBottomBar from "@/saloon-services/BookingBottomBar";

const jsDayToName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// --- Helper Functions (unchanged) ---
function isSameDate(d1: Date, d2: Date) {
  return (
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
  );
}

function formatDateForAPI(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isSlotInPast(slotMinutes: number, selectedDate: string): boolean {
  const now = new Date();
  const selectedDateObj = new Date(selectedDate);

  if (!isSameDate(now, selectedDateObj)) {
    return false;
  }

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  return slotMinutes < currentMinutes;
}

const parseTimeStringToDate = (timeString: string, baseDate: Date): Date => {
  const time = timeString.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!time) return baseDate;

  let hours = parseInt(time[1], 10);
  const minutes = parseInt(time[2], 10);
  const ampm = time[3].toUpperCase();

  if (ampm === "PM" && hours < 12) {
    hours += 12;
  }
  if (ampm === "AM" && hours === 12) {
    hours = 0;
  }

  const date = new Date(baseDate);
  date.setHours(hours, minutes, 0, 0);
  return date;
};

const formatTimeFromDate = (date: Date): string => {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const Slots: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart.items);
  const operatorsState = useAppSelector((state) => state.operators);
  const timeSlotsState = useAppSelector((state) => state.timeSlots);
  const servicesState = useAppSelector((state) => state.services);
  const { selectedDate, selectedOperator, selectedSlot } = useAppSelector(
    (state) => state.ui
  );
  const now = new Date();
  const [currentMonthIndex, setCurrentMonthIndex] = useState(now.getMonth());
  const [currentYear, setCurrentYear] = useState(now.getFullYear());

  const selectedDateObj = new Date(selectedDate);

  // Watch for errors when fetching operators
  useEffect(() => {
    if (operatorsState.error) {
      toastError("Could not load operators. Please refresh the page.");
      // Optional: dispatch an action to clear the error from the Redux store
      dispatch(resetTimeSlotsError());
    }
  }, [operatorsState.error]);

  // Watch for errors when fetching time slots
  useEffect(() => {
    if (timeSlotsState.error) {
      toastError(
        "Could not load time slots. Please try selecting another date."
      );
      // Optional: dispatch an action to clear the error from the Redux store
      dispatch(resetTimeSlotsError());
    }
  }, [timeSlotsState.error]);

  const displayOperators = useMemo(
    () => [
      {
        id: -1,
        name: "No Preference",
        img: "/images/user.png",
      },
      ...operatorsState.filteredOperators.map((op: any) => ({
        id: op.id,
        name: op.display_name || op.name,
        img: op.staff_img || "/images/user.png",
      })),
    ],
    [operatorsState.filteredOperators]
  );

  // NEW: Watch for the specific case where no single operator is available
  useEffect(() => {
    if (displayOperators.length === 1 && cart.length > 1) {
      toastWarning(
        "Heads up: No single operator provides all selected services."
      );
    }
  }, [displayOperators, cart]);

  const hasValidImageExtension = (url: string): boolean => {
    return /\.(jpg|jpeg|png|gif|svg)$/i.test(url);
  };

  useEffect(() => {
    if (operatorsState.operators.length > 0) {
      const cartServiceIds = cart.map((item: any) => item.id);
      dispatch(filterOperatorsByServices(cartServiceIds));
    }
  }, [dispatch, cart, operatorsState.operators]);

  // useEffect(() => {
  //   // This function's "return" is a cleanup function.
  //   // It runs automatically whenever you navigate away from this page.
  //   return () => {
  //     if (!isProceeding) {
  //       // <-- ADD THIS CONDITION
  //       dispatch(resetBookingFlow()); // Resets operator and slot
  //       dispatch(clearBookingDetailsFromCart()); // Removes details from cart items
  //     }
  //   };
  // }, [dispatch, isProceeding]);

  useEffect(() => {
    if (servicesState.selectedLocationUuid && selectedDate) {
      const dateString = formatDateForAPI(selectedDateObj);
      const serviceIds = cart.map((item: any) => item.id);
      dispatch(
        fetchTimeSlots({
          locationUuid: servicesState.selectedLocationUuid,
          startDate: dateString,
          endDate: dateString,
          serviceIds,
        })
      );
    }
  }, [dispatch, servicesState.selectedLocationUuid, selectedDate, cart]);

  const processedSlots = useMemo(() => {
    const selectedDateString = formatDateForAPI(selectedDateObj);
    const slotsForSelectedDate = timeSlotsState.slots.filter(
      (slot: any) => slot.date === selectedDateString
    );
    const filteredSlots = slotsForSelectedDate.filter((slot: any) => {
      if (!slot.available) return true;
      if (isSameDate(now, selectedDateObj)) {
        return !isSlotInPast(slot.start_time, selectedDate);
      }
      return true;
    });
    return {
      morning: filteredSlots.filter((slot: any) => slot.period === "morning"),
      afternoon: filteredSlots.filter(
        (slot: any) => slot.period === "afternoon"
      ),
      evening: filteredSlots.filter((slot: any) => slot.period === "evening"),
    };
  }, [timeSlotsState.slots, selectedDate, selectedDateObj, now]);

  const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
  const datesArray = Array.from(
    { length: daysInMonth },
    (_, i) => new Date(currentYear, currentMonthIndex, i + 1)
  );

  useEffect(() => {
    dispatch(setSelectedSlot(""));
    dispatch(clearBookingDetailsFromCart());
  }, [dispatch, selectedOperator, selectedDate, currentMonthIndex]);

  // --- NEW: A single handler for when a user clicks a time slot ---
  const handleSlotSelection = (slotTime: string) => {
    // 1. Set the selected slot in the UI (to highlight the button)
    dispatch(setSelectedSlot(slotTime));

    // 2. Immediately calculate the sequential times for the cart
    const operatorName =
      displayOperators[selectedOperator]?.name || "No Preference";
    const currentStartTime = parseTimeStringToDate(slotTime, selectedDateObj);

    const updatedCart = cart.map((item: any) => {
      const itemTimeSlot = formatTimeFromDate(currentStartTime);
      // Assumes each 'item' in the cart has a 'time' property in minutes.
      const durationInMinutes = item.duration || 0;

      const updatedItem = {
        ...item,
        operator: operatorName,
        selectedDate: selectedDateObj.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        selectedDay: selectedDateObj.toLocaleDateString("en-US", {
          weekday: "long",
        }),
        timeSlot: itemTimeSlot,
      };

      currentStartTime.setMinutes(
        currentStartTime.getMinutes() + durationInMinutes
      );

      return updatedItem;
    });

    // 3. Update the cart in the Redux store with the newly calculated times
    dispatch(setCart(updatedCart));
  };

  function handleSlotBook() {
    // This function is now simpler. The cart is already updated.
    // It just needs to save and navigate.
    dispatch(saveCartToStorage());
    router.push("/saloon-services/view");
  }

  const handleContinueClick = () => {
    // Check if an operator is selected. "No Preference" is at index 0, so any selection is valid.
    // Assuming initial state for selectedOperator is null or undefined.
    const isOperatorSelected =
      selectedOperator !== null && selectedOperator !== undefined;

    if (!isOperatorSelected || !selectedSlot) {
      // Build a specific error message
      let errorMessage = "Please select";
      if (!isOperatorSelected && !selectedSlot) {
        errorMessage += " an operator and a time slot.";
      } else if (!isOperatorSelected) {
        errorMessage += " an operator.";
      } else {
        errorMessage += " a time slot.";
      }
      toastError(errorMessage); // Use the toast service!
      return; // Stop the function here
    }

    // If validation passes, call the original booking function
    handleSlotBook();
  };

  function renderSlotSection(title: string, slots: any[], isLoading: boolean) {
    return (
      <div className="mb-4">
        <h4 className="text-center font-playfair font-bold mb-3 text-[#B11C5F]">
          {title}
          {!isLoading && (
            <span className="text-xs font-normal ml-2 text-[#C59D5F] font-lato">
              ({slots.filter((s) => s.available).length} available)
            </span>
          )}
        </h4>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
          {isLoading && slots.length === 0 ? (
            <div className="col-span-full flex items-center justify-center h-20">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#F28C8C]/30 border-t-[#B11C5F]"></div>
              <span className="ml-2 text-[#C59D5F] font-lato">
                Loading slots...
              </span>
            </div>
          ) : slots.length === 0 ? (
            <div className="col-span-full text-center italic text-[#C59D5F] py-4 font-cormorant">
              No slots available for this time period.
            </div>
          ) : (
            slots.map((slot) => {
              const isPastSlot =
                isSlotInPast(slot.start_time, selectedDate) &&
                isSameDate(now, selectedDateObj);
              const isDisabled = !slot.available || isPastSlot;
              return (
                <button
                  key={`${slot.start_time}-${slot.end_time}`}
                  className={`rounded-xl px-2 py-2 border-2 text-center cursor-pointer transition-all duration-300 text-sm font-lato font-medium ${
                    isDisabled
                      ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-50"
                      : selectedSlot === slot.start_time_formatted
                      ? "bg-gradient-to-r from-[#F28C8C]/80 to-[#C59D5F]/80 text-white border-[#B11C5F] font-bold shadow-lg transform scale-105"
                      : "bg-white text-[#444444] border-[#F28C8C]/30 hover:border-[#B11C5F] hover:bg-[#FFF6F8] hover:shadow-md hover:scale-102"
                  }`}
                  // --- MODIFIED: onClick now calls our new handler ---
                  onClick={() =>
                    !isDisabled &&
                    handleSlotSelection(slot.start_time_formatted)
                  }
                  disabled={isDisabled}
                  title={
                    isPastSlot
                      ? "Time has passed"
                      : !slot.available
                      ? "Not available"
                      : `Available: ${slot.start_time_formatted}`
                  }>
                  {slot.start_time_formatted}
                </button>
              );
            })
          )}
        </div>
      </div>
    );
  }

  // ... The rest of your JSX return statement remains unchanged ...
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF6F8] to-[#FEFAF4]">
      <div className="w-full py-28 pl-11 pt-32 relative overflow-hidden group">
        {/* Animated Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/service/slotbooking.webp"
            alt="Slot booking background"
            fill
            priority
            sizes="100vw"
            className="object-center object-cover filter brightness-75 transition-transform duration-[8000ms] ease-out group-hover:scale-105"
            style={{
              zIndex: 1,
            }}
          />
        </div>

        {/* Animated Gradient Overlays */}
        <div className="absolute inset-0 z-[2] animate-pulse-slow" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent z-[3]" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-transparent z-[4]" />

        {/* Floating Decoration Elements */}
        <div className="absolute top-20 right-28 w-6 h-6 bg-[#FFF6F8]/30 rounded-full animate-bounce-slow blur-sm" />
        <div className="absolute top-44 right-20 w-4 h-4 bg-[#F28C8C]/50 rounded-full animate-pulse delay-1000 blur-sm" />
        <div className="absolute bottom-36 right-44 w-5 h-5 bg-white/20 rounded-full animate-bounce-slow delay-2000 blur-sm" />
        <div className="absolute top-1/3 right-12 w-3 h-3 bg-[#C59D5F]/60 rounded-full animate-pulse delay-1500 blur-sm" />
        <div className="absolute bottom-20 right-16 w-2 h-2 bg-[#FFF6F8]/40 rounded-full animate-bounce-slow delay-500 blur-sm" />

        {/* Animated Border Lines */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FFF6F8]/60 to-transparent animate-shimmer" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#F28C8C]/80 to-transparent animate-shimmer delay-1000" />

        {/* Side Accent Lines */}
        <div className="absolute left-0 top-1/3 w-1 h-40 bg-gradient-to-b from-transparent via-[#FFF6F8]/40 to-transparent animate-shimmer delay-500" />
        <div className="absolute right-0 bottom-1/3 w-1 h-32 bg-gradient-to-t from-transparent via-[#F28C8C]/50 to-transparent animate-shimmer delay-1500" />

        {/* Clock/Time Theme Decorative Elements */}
        <div className="absolute top-16 left-16 w-8 h-8 border-2 border-[#FFF6F8]/20 rounded-full animate-spin-slow">
          <div className="absolute top-1/2 left-1/2 w-0.5 h-2 bg-[#FFF6F8]/40 transform -translate-x-1/2 -translate-y-full origin-bottom animate-pulse" />
        </div>
        <div className="absolute bottom-24 left-24 w-6 h-6 border border-[#F28C8C]/30 rounded-full animate-spin-slow-reverse">
          <div className="absolute top-1/2 left-1/2 w-0.5 h-1.5 bg-[#F28C8C]/50 transform -translate-x-1/2 -translate-y-full origin-bottom" />
        </div>

        {/* Content Container with Enhanced Animation */}
        <div className="max-w-7xl mx-auto px-4 relative z-10 transform transition-all duration-1000 ease-out">
          <div className="relative">
            {/* Glowing Background for Title */}
            <div className="absolute -inset-6 blur-2xl rounded-3xl animate-pulse-glow" />

            {/* Main Title with Multiple Animations */}
            <h1 className="text-4xl lg:text-5xl pt-10 font-playfair font-bold tracking-wide relative z-20 transform transition-all duration-1000 ease-out animate-slide-up">
              {/* Gradient Text Effect */}
              <span className="text-white animate-gradient-x drop-shadow-lg text-shadow-sm">
                SELECT A TIME & OPERATOR
              </span>

              {/* Animated Underline */}
              <div className="absolute -bottom-1 left-0 w-0 h-1 bg-gradient-to-r from-[#FFF6F8] via-[white] to-[#FFF6F8] animate-expand-width shadow-lg" />

              {/* Double Underline Effect */}
              <div className="absolute -bottom-3 left-0 w-0 h-0.5 bg-gradient-to-r from-transparent via-[#C59D5F]/60 to-transparent animate-expand-width delay-500" />
            </h1>

            {/* Subtitle with Staggered Animation */}
            <p className="dancing-script text-xl lg:text-2xl text-[#FFF6F8] mt-4 italic relative z-20 animate-fade-in-up delay-500 opacity-0 drop-shadow-md">
              ⏰ Choose your perfect appointment slot
            </p>

            {/* Additional Tagline */}
            <p className="font-lato text-sm text-[#FFF6F8]/80 mt-2 relative z-20 animate-fade-in-up delay-700 opacity-0 tracking-wider uppercase">
              Available Times • Expert Staff • Easy Booking
            </p>

            {/* Time-themed Decorative Elements */}
            <div className="absolute -top-4 -left-4 w-10 h-10 border-2 border-[#FFF6F8]/30 rounded-full animate-spin-slow flex items-center justify-center">
              <div className="text-[#FFF6F8]/50 text-xs">⏱️</div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-8 h-8 border-2 border-[#F28C8C]/40 rounded-full animate-spin-slow-reverse flex items-center justify-center">
              <div className="text-[#F28C8C]/60 text-xs">🕐</div>
            </div>

            {/* Corner Accents with Time Theme */}
            <div className="absolute top-0 left-0 w-12 h-12 border-l-2 border-t-2 border-[#FFF6F8]/20 rounded-tl-2xl animate-pulse">
              <div className="absolute top-2 left-2 text-[#FFF6F8]/30 text-xs">
                ⌚
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-12 h-12 border-r-2 border-b-2 border-[#F28C8C]/30 rounded-br-2xl animate-pulse delay-1000">
              <div className="absolute bottom-2 right-2 text-[#F28C8C]/40 text-xs">
                📅
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
          <div className="absolute top-1/6 left-1/6 w-1 h-1 bg-[#FFF6F8]/70 rounded-full animate-float" />
          <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-[#F28C8C]/60 rounded-full animate-float-delay-1" />
          <div className="absolute bottom-1/5 left-3/5 w-1 h-1 bg-[#C59D5F]/50 rounded-full animate-float-delay-2" />
          <div className="absolute top-3/5 right-1/6 w-1 h-1 bg-white/60 rounded-full animate-float-delay-3" />
          <div className="absolute bottom-2/5 left-1/5 w-0.5 h-0.5 bg-[#FFF6F8]/80 rounded-full animate-float delay-2000" />
          <div className="absolute top-2/5 right-2/5 w-1 h-1 bg-[#F28C8C]/40 rounded-full animate-float-delay-1 delay-1000" />
        </div>

        {/* Time & Schedule Theme Magic Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[5]">
          <div className="absolute top-24 left-32 text-[#FFF6F8]/40 animate-pulse delay-1000">
            ⏰
          </div>
          <div className="absolute top-40 right-40 text-[#F28C8C]/50 animate-bounce-slow delay-2000">
            📅
          </div>
          <div className="absolute bottom-48 left-48 text-white/30 animate-pulse delay-1500">
            ⌚
          </div>
          <div className="absolute bottom-32 right-32 text-[#C59D5F]/40 animate-bounce-slow delay-500">
            🕐
          </div>
          <div className="absolute top-1/2 left-20 text-[#FFF6F8]/30 animate-pulse delay-2500">
            ⏱️
          </div>
        </div>

        {/* Subtle Moving Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#FFF6F8]/5 to-transparent z-[1] animate-pulse-slow delay-2000" />

        {/* Time Grid Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-5 z-[1]"
          style={{
            backgroundImage: `
      linear-gradient(rgba(255,246,248,0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,246,248,0.1) 1px, transparent 1px)
    `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-[400px]">
            <LeftPanel />
          </div>

          <div className="w-full lg:w-2/3 xl:w-3/4 min-w-0">
            <div
              className="bg-white/90 backdrop-blur-sm p-4 sm:p-6 shadow-xl flex flex-col gap-4 rounded-2xl border-2 border-[#F28C8C]/20"
              style={{ backdropFilter: "blur(12px)" }}>
              <div className="bg-gradient-to-r from-[#F28C8C]/20 to-[#C59D5F]/20 rounded-2xl px-4 py-3 shadow-md font-playfair font-bold text-lg text-[#B11C5F] border-2 border-[#F28C8C]/30">
                Choose Your Operator
                {cart.length > 0 && (
                  <span className="block sm:inline text-sm font-normal sm:ml-2 text-[#C59D5F] font-lato">
                    (Showing operators for all selected services)
                  </span>
                )}
              </div>
              {operatorsState.loading ? (
                <div className="flex items-center justify-center h-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#F28C8C]/30 border-t-[#B11C5F]"></div>
                  <span className="ml-3 text-[#444444] font-lato">
                    Loading operators...
                  </span>
                </div>
              ) : (
                //  operatorsState.error ? (
                //   <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-3 text-red-600 text-sm font-lato">
                //     Error loading operators: {operatorsState.error}
                //   </div>
                // ) :
                <>
                  {displayOperators.length === 1 && cart.length > 0 && (
                    <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-3 text-yellow-700 text-sm font-lato">
                      No single operator provides all selected services. Please
                      modify your cart or choose &quot;No Preference&quot;.
                    </div>
                  )}
                  <div className="flex flex-nowrap gap-4 overflow-x-auto pb-3 -mx-4 px-4">
                    {displayOperators.map((op, idx) => (
                      <div
                        key={idx}
                        className={`flex flex-col items-center justify-start text-center cursor-pointer p-2 transition-all duration-300 rounded-2xl flex-shrink-0 w-24
                              ${
                                selectedOperator === idx
                                  ? "border-[#B11C5F] bg-gradient-to-b from-[#F28C8C]/20 to-[#C59D5F]/10 shadow-lg"
                                  : "border-[#F28C8C]/30 hover:border-[#B11C5F] hover:bg-[#FFF6F8]"
                              } border-2`}
                        onClick={() => dispatch(setSelectedOperator(idx))}
                        title={op.name}>
                        <Image
                          width={56}
                          height={56}
                          src={
                            op.img && hasValidImageExtension(op.img)
                              ? op.img
                              : "/images/user.png"
                          }
                          alt={op.name}
                          className="rounded-full object-cover w-14 h-14 mb-2 border-2 border-[#F28C8C]/30"
                        />
                        <div className="text-xs text-[#444444] w-full truncate font-lato font-medium">
                          {op.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div className="bg-gradient-to-r from-[#F28C8C]/20 to-[#C59D5F]/20 rounded-2xl px-4 py-3 shadow-md font-playfair font-bold text-lg text-[#B11C5F] border-2 border-[#F28C8C]/30 flex-wrap flex justify-between items-center">
                <div>Choose Your Appointment</div>
                <select
                  className="bg-white/90 text-[#B11C5F] font-bold outline-none rounded-xl px-3 py-2 border-2 border-[#F28C8C]/30 text-sm font-lato focus:border-[#B11C5F]"
                  value={`${currentMonthIndex}-${currentYear}`}
                  onChange={(e) => {
                    const [month, year] = e.target.value.split("-").map(Number);
                    setCurrentMonthIndex(month);
                    setCurrentYear(year);
                  }}>
                  {Array.from({ length: 3 }, (_, i) => {
                    const date = new Date(
                      now.getFullYear(),
                      now.getMonth() + i
                    );
                    const monthIndex = date.getMonth();
                    const year = date.getFullYear();
                    return (
                      <option
                        key={`${monthIndex}-${year}`}
                        value={`${monthIndex}-${year}`}>
                        {`${date.toLocaleString("default", {
                          month: "long",
                        })} ${year}`}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="flex flex-nowrap gap-2 overflow-x-auto pb-3 -mx-4 px-4 operator_scroll">
                {datesArray.map((dateObj) => {
                  if (
                    currentMonthIndex === now.getMonth() &&
                    currentYear === now.getFullYear() &&
                    dateObj <
                      new Date(now.getFullYear(), now.getMonth(), now.getDate())
                  ) {
                    return null;
                  }
                  return (
                    <button
                      key={dateObj.toDateString()}
                      className={`flex flex-col items-center gap-1 p-2 rounded-2xl border-2 w-14 flex-shrink-0 transition-all duration-300
                            ${
                              isSameDate(dateObj, selectedDateObj)
                                ? "bg-gradient-to-r from-[#F28C8C]/80 to-[#C59D5F]/80 text-white border-[#B11C5F] font-bold shadow-lg"
                                : "bg-white text-[#444444] border-[#F28C8C]/30 hover:border-[#B11C5F] hover:bg-[#FFF6F8]"
                            } font-lato`}
                      onClick={() =>
                        dispatch(setSelectedDate(dateObj.toISOString()))
                      }>
                      <span className="text-xs">
                        {jsDayToName[dateObj.getDay()]}
                      </span>
                      <span className="font-bold text-lg">
                        {dateObj.getDate()}
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="font-playfair font-bold text-[#B11C5F] text-center md:text-left">
                {selectedDateObj.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                  weekday: "long",
                })}
                {isSameDate(now, selectedDateObj) && (
                  <span className="text-xs ml-2 text-[#C59D5F] font-lato">
                    (Today)
                  </span>
                )}
              </div>

              {timeSlotsState.error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-3 text-red-600 text-sm font-lato">
                  Error loading time slots: {timeSlotsState.error}
                </div>
              )}

              {renderSlotSection(
                "Morning",
                processedSlots.morning,
                timeSlotsState.loading
              )}
              {renderSlotSection(
                "Afternoon",
                processedSlots.afternoon,
                timeSlotsState.loading
              )}
              {renderSlotSection(
                "Evening",
                processedSlots.evening,
                timeSlotsState.loading
              )}

              <div className="hidden md:block mt-4">
                <div className="flex justify-between items-center bg-gradient-to-r from-[#F28C8C]/20 to-[#C59D5F]/20 px-4 py-3 rounded-2xl font-lato font-bold border-2 border-[#F28C8C]/30">
                  <div className="text-[#444444]">{cart.length} services</div>
                  <div className="text-[#B11C5F]">
                    ₹
                    {cart
                      .reduce(
                        (acc: number, curr: any) => acc + (curr.price || 0),
                        0
                      )
                      .toFixed(2)}
                  </div>
                </div>
                <button
                  className={`group/btn relative w-full mt-4 py-3 rounded-2xl font-bold text-lg transition-all duration-300 font-lato shadow-lg hover:shadow-xl transform  hover:from-[#B11C5F] hover:to-[#F28C8C] overflow-hidden ${
                    cart.length > 0
                      ? "bg-[#F28C8C] text-white shadow-lg cursor-pointer"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                  disabled={cart.length === 0}
                  onClick={handleContinueClick}>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:hidden sticky bottom-0">
        <BookingBottomBar />
      </div>
    </div>
  );
};

export default Slots;
