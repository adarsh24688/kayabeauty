"use client";

import type React from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import ClientOnly from "../common/ClientOnly";
import { removeFromCart } from "@/store/slices/cartSlice";

interface LeftPanelProps {
  content?: string;
}

const LeftPanel: React.FC<LeftPanelProps> = ({ content }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { selectedLocationByName } = useAppSelector((state) => state.services);
  const cart = useAppSelector((state) => state.cart.items);
  const { selectedDate } = useAppSelector((state) => state.ui);

  const dateObj =
    typeof selectedDate === "string" ? new Date(selectedDate) : selectedDate;

  return (
    <div
      className={`${
        content === "summary"
          ? "gap-3"
          : "md:shadow-xl md:rounded-3xl gap-2 md:gap-6 md:p-6 bg-gradient-to-br from-white to-[#FFF6F8] md:border md:border-[#F28C8C]/20"
      } flex flex-col relative`}
      style={{ backdropFilter: "blur(12px)" }}>
      {/* Card Header */}
      {content === "summary" ? (
        <h2 className="font-playfair font-bold mb-4 text-[#B11C5F] text-2xl">
          Summary
        </h2>
      ) : (
        <div className="hidden md:block">
          <div className="flex items-center gap-6 relative">
            <div className="">
              <h2 className="font-playfair font-bold text-2xl mb-2 text-[#B11C5F]">
                Kaya Beauty Salon
              </h2>
              <div className="flex flex-col text-[#C59D5F]">
                <div className="flex items-center gap-2 mb-1">
                  <ClientOnly>
                    <div className="w-5 h-5 bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </ClientOnly>
                  <span className="font-lato">{selectedLocationByName}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        className={`${
          content === "summary" ? "h-96" : ""
        } bg-white/80 backdrop-blur-sm p-4 shadow-lg border border-[#F28C8C]/30 rounded-2xl overflow-hidden overflow-y-scroll max-h-[700px] categories_scroll`}>
        <div className="font-semibold my-4 text-[#B11C5F] flex items-center justify-between">
          {dateObj && (
            <>
              <span className="font-playfair">
                {dateObj.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}{" "}
                | {dateObj.toLocaleDateString("en-US", { weekday: "long" })}
              </span>
            </>
          )}
        </div>

        <ClientOnly
          fallback={
            <div className="italic text-[#C59D5F] py-4 text-center font-cormorant">
              Loading cart...
            </div>
          }>
          {cart.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-r from-[#F28C8C]/20 to-[#C59D5F]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛒</span>
              </div>
              <p className="font-cormorant italic text-[#C59D5F] text-lg">
                No services in cart.
              </p>
              <p className="font-lato text-[#444444] text-sm mt-1">
                Add some wellness services to get started
              </p>
            </div>
          )}
          <div className="flex gap-3 operator_scroll overflow-x-auto md:flex-col md:gap-0">
            {cart.map((item: any, index: any) => (
              <div
                key={`left-panel-item-${index}-${item.id}`}
                className="bg-gradient-to-br from-white to-[#FFF6F8] border border-[#F28C8C]/20 rounded-2xl my-2 p-4 flex flex-col gap-3 min-w-[280px] max-w-full lg:w-full shadow-md hover:shadow-lg transition-all duration-300 group">
                <div className="flex justify-between items-center lg:items-start flex-wrap">
                  <div className="font-playfair font-semibold text-[#B11C5F] group-hover:text-[#F28C8C] transition-colors duration-300">
                    {item.name}
                  </div>
                  <div className="text-[#C59D5F] text-xs flex items-center gap-2 bg-[#FFF6F8] px-2 py-1 rounded-full border border-[#F28C8C]/20">
                    <div className="w-3 h-3 bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] rounded-full flex items-center justify-center">
                      <div className="w-1 h-1 bg-white rounded-full animate-pulse"></div>
                    </div>
                    <span className="font-lato">{item.duration} min</span>
                  </div>
                </div>
                <div className="flex lg:flex-row lg:justify-between lg:items-center flex-col gap-2">
                  <small className="text-[#444444] font-lato">
                    {item.timeSlot && item.operator
                      ? `With ${item.operator} at ${item.timeSlot}`
                      : "Pick a time slot"}
                  </small>

                  <div className="flex items-center gap-3">
                    <div className="font-bold text-[#B11C5F] font-playfair text-lg">
                      ₹ {item.price?.toFixed(2)}
                    </div>
                    <button
                      className="w-8 h-8 bg-red-50 hover:bg-red-100 rounded-full flex items-center justify-center text-red-500 hover:text-red-600 transition-all duration-300 hover:scale-110 group/btn"
                      onClick={() => dispatch(removeFromCart(index))}
                      aria-label="Remove">
                      <span className="text-sm group-hover/btn:scale-110 transition-transform duration-300">
                        🗑️
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ClientOnly>
      </div>

      {!content && (
        <button
          className="text-[#B11C5F] font-lato font-semibold text-sm hover:text-[#F28C8C] hover:underline self-start mt-2 cursor-pointer mb-2 transition-colors duration-300 flex items-center gap-2 group"
          onClick={() => router.push("/saloon-services")}>
          <div className="w-5 h-5 bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] rounded-full flex items-center justify-center text-white text-xs group-hover:scale-110 transition-transform duration-300 ml-2">
            +
          </div>
          Add Service
        </button>
      )}

      {content && (
        <div className="mx-auto mt-4">
          <button
            className="group relative w-60 py-3 bg-[#F28C8C] text-white font-lato font-semibold text-lg rounded-full shadow-lg hover:shadow-xl transform transition-all duration-300 hover:from-[#B11C5F] hover:to-[#F28C8C] overflow-hidden"
            onClick={() => router.push("/saloon-services/slots")}>
            {/* Button shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            <span className="relative">Continue</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default LeftPanel;
