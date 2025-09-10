import React from "react";
import { IoTime } from "react-icons/io5";

// Define the shape of the business hours data
interface BusinessHours {
  today_hour: string;
  today_opening_status: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

// Update component props to accept the hours object
interface ShowTimesProps {
  ifSlot: boolean;
  hours: BusinessHours;
}

const dayOrder: (keyof Omit<
  BusinessHours,
  "today_hour" | "today_opening_status"
>)[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

const ShowTimes: React.FC<ShowTimesProps> = ({ ifSlot, hours }) => {
  // Guard clause in case hours are not passed correctly
  if (!hours) {
    return null;
  }

  // Create a display-friendly array from the hours object
  const openingTimes = dayOrder.map((day) => ({
    day: day.charAt(0).toUpperCase() + day.slice(1),
    time: hours[day] || "Closed",
  }));

  const todayName = new Date().toLocaleDateString("en-US", { weekday: "long" });

  // Base classes that are always applied
  const baseContainerClasses =
    "rounded-2xl bg-white/95 backdrop-blur-sm p-4 text-[#444444] shadow-2xl border border-[#F28C8C]/30";

  // Conditional classes based on the 'ifSlot' prop
  const conditionalContainerClasses = ifSlot
    ? "absolute lg:-right-[26rem] -right-11 top-0 lg:-top-8 z-50 ml-[-7rem] mt-4 w-[300px] sm:min-w-[400px] border border-[#F28C8C]/30"
    : "mt-[30px] w-[420px] z-50";

  return (
    <div className={`${baseContainerClasses} ${conditionalContainerClasses}`}>
      <h6 className="mb-3 flex items-center gap-2 font-playfair font-bold text-[#B11C5F]">
        <IoTime className="text-[#C59D5F]" /> Opening times
      </h6>
      <ul className="m-0 list-none">
        {openingTimes.map(({ day, time }) => {
          // Conditional classes for the list item
          const listItemClasses = `flex justify-between py-1 font-lato ${
            day === todayName
              ? "font-bold text-[#B11C5F]"
              : "font-normal text-[#C59D5F]"
          }`;

          return (
            <li key={day} className={listItemClasses}>
              <span>{day}</span>
              <span>{time}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ShowTimes;
