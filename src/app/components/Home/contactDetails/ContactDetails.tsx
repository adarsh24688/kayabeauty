"use client";
import React, { useEffect, useRef, useState } from "react";
import ShowTimes from "./ShowTimes";
import { IoCall, IoLocationSharp, IoTime } from "react-icons/io5";
import { PiArrowBendDoubleUpRightBold } from "react-icons/pi";
import { FaCaretDown } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hook";

// --- Helper Function ---
const parseTimeToMinutes = (timeStr: string): number => {
  const [time, modifier] = timeStr.trim().split(" ");
  const [rawHours, minutes] = time.split(":").map(Number);
  let hours = rawHours;
  if (modifier.toUpperCase() === "PM" && hours !== 12) hours += 12;
  if (modifier.toUpperCase() === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
};

interface ContactDetailsProps {
  bookButton?: boolean;
}

const ContactDetails: React.FC<ContactDetailsProps> = ({ bookButton }) => {
  const Router = useRouter();
  const { selectedLocationByName } = useAppSelector((state) => state.services);
  const { hours, loading, error } = useAppSelector(
    (state) => state.businessHours
  );

  const [showOpeningTimes, setShowOpeningTimes] = useState(false);
  const [isCurrentlyOpen, setIsCurrentlyOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Effect for real-time open/closed status check
  useEffect(() => {
    const checkStatus = () => {
      if (!hours || hours.today_opening_status !== "Open") {
        setIsCurrentlyOpen(false);
        return;
      }
      try {
        const [startTimeStr, endTimeStr] = hours.today_hour.split(" - ");
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        const openingMinutes = parseTimeToMinutes(startTimeStr);
        const closingMinutes = parseTimeToMinutes(endTimeStr);
        setIsCurrentlyOpen(
          currentMinutes >= openingMinutes && currentMinutes <= closingMinutes
        );
      } catch (e) {
        console.log(e);
        setIsCurrentlyOpen(false);
      }
    };
    checkStatus();
    const intervalId = setInterval(checkStatus, 60000);
    return () => clearInterval(intervalId);
  }, [hours]);

  // Effect for click-outside-to-close logic
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowOpeningTimes(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full mx-auto z-50">
      <div className="card flex flex-row justify-between flex-wrap items-center gap-3 rounded-2xl p-6 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="">
          <h2 className="mb-3 text-xl font-playfair font-bold text-[#B11C5F]">
            The Kaya Beauty Salon
          </h2>
          {/* The ref is placed here to contain both the button and the popup */}
          <div className="flex flex-col text-[#C59D5F]" ref={containerRef}>
            {/* Location */}
            <div className="mb-2 flex items-center gap-2">
              <IoLocationSharp className="text-[#B11C5F]" />
              <span className="font-lato font-medium">
                {selectedLocationByName || "Select a Location"}
              </span>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedLocationByName}`}
                target="_blank"
                className="btn flex h-[30px] w-[30px] items-center justify-center rounded-full bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] text-white transition-all duration-300 hover:scale-110 hover:from-[#B11C5F] hover:to-[#F28C8C] shadow-lg"
                title="Location link">
                <PiArrowBendDoubleUpRightBold className="text-[16px] text-white" />
              </a>
            </div>

            {/* Telephone */}
            <div className="mb-2 flex items-center gap-2">
              <IoCall className="text-[#B11C5F]" />
              <span className="font-lato font-medium">5712494457</span>
            </div>

            {/* Timings */}
            <div className="flex items-center gap-2">
              <IoTime className="text-[#B11C5F]" />
              {loading ? (
                <span className="font-lato font-medium">Loading hours...</span>
              ) : error ? (
                <span className="text-red-500 font-lato font-medium">
                  Error
                </span>
              ) : (
                <span className="font-lato font-medium">
                  {hours?.today_hour || "Not available"}
                </span>
              )}
              <button
                className="btn ml-3 flex w-24 cursor-pointer items-center justify-center gap-1 font-lato font-semibold transition-all duration-300 hover:text-[#B11C5F] hover:scale-105"
                // onClick={() => setShowOpeningTimes((prev) => !prev)}
                aria-expanded={showOpeningTimes}
                aria-label="Toggle opening times"
                disabled={loading || !!error}>
                <span
                  className={
                    isCurrentlyOpen ? "text-green-500" : "text-red-500"
                  }>
                  {isCurrentlyOpen ? "Open" : "Closed"}
                </span>
                <FaCaretDown
                  className={
                    isCurrentlyOpen
                      ? "text-green-500 mt-1"
                      : "text-red-500 mt-1"
                  }
                />
              </button>
            </div>

            {/* Conditional Rendering for the popup */}
            <div className="relative">
              {showOpeningTimes && hours && (
                <ShowTimes ifSlot={true} hours={hours} />
              )}
            </div>
          </div>
        </div>
        {bookButton && (
          <button
            onClick={() => Router.push("/services")}
            className="px-8 py-3 bg-[#F28C8C] to-[#C59D5F] rounded-2xl font-lato font-semibold text-lg text-white shadow-lg hover:from-[#B11C5F] hover:to-[#F28C8C] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#F28C8C] focus:ring-offset-2 hover:bg-[#F28C8C]/90">
            Book Appointment
          </button>
        )}
      </div>
    </div>
  );
};

export default ContactDetails;
