"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, X, Trash2, ArrowRight, IndianRupee } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/hook";
import { removeFromCart } from "@/store/slices/cartSlice";
import ClientOnly from "../common/ClientOnly";

export default function CartPopup() {
  const [showCart, setShowCart] = useState(false);
  const cart = useAppSelector((state) => state.cart.items);
  const isHydrated = useAppSelector((state) => state.cart.isHydrated);
  const dispatch = useAppDispatch();
  const cartRef = useRef<HTMLDivElement>(null);

  // Close cart on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (cartRef.current && !cartRef.current.contains(target)) {
        setShowCart(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totalPrice = cart.reduce((sum: any, item: any) => sum + item.price, 0);

  const handleRemoveItem = (index: number) => {
    dispatch(removeFromCart(index));
  };

  return (
    <div className="relative" ref={cartRef}>
      {/* Enhanced Cart Button */}
      <button
        onClick={() => setShowCart((prev) => !prev)}
        className="group relative p-2 rounded-full bg-white shadow-md hover:shadow-lg hover:bg-[#FFF6F8] transition-all duration-300 hover:scale-110"
        id="cart-icon">
        <ShoppingBag className="w-5 h-5 text-[#B11C5F] group-hover:text-[#F28C8C] transition-colors duration-300" />

        {/* Cart Count Badge */}
        <ClientOnly>
          {isHydrated && cart.length > 0 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-xs font-bold">
                {cart.length}
              </span>
            </div>
          )}
        </ClientOnly>

        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#F28C8C]/20 to-[#C59D5F]/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </button>

      {/* Enhanced Cart Popup */}
      {showCart && (
        <div className="absolute right-0 top-full mt-5 w-64 sm:w-80 bg-gradient-to-br from-[#FFF6F8] to-white backdrop-blur-md border border-[#F28C8C]/20 rounded-2xl shadow-2xl z-50 animate-in slide-in-from-top-5 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#F28C8C]/20 bg-gradient-to-r from-[#F28C8C]/10 to-[#C59D5F]/10 rounded-t-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] rounded-full flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-playfair text-lg font-bold text-[#B11C5F]">
                  Cart
                </h3>
                {cart.length > 0 && (
                  <p className="font-cormorant text-sm text-[#C59D5F] italic">
                    {cart.length} items
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => setShowCart(false)}
              className="p-2 rounded-lg hover:bg-white/50 transition-colors duration-300 group">
              <X className="w-4 h-4 text-[#B11C5F] group-hover:text-[#F28C8C] transition-colors duration-300" />
            </button>
          </div>

          {/* Cart Content */}
          <div className="max-h-64 overflow-y-auto p-2">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-r from-[#F28C8C]/20 to-[#C59D5F]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-8 h-8 text-[#B11C5F]" />
                </div>
                <h4 className="font-playfair text-[#B11C5F] font-semibold mb-2">
                  Your cart is empty
                </h4>
                <p className="font-lato text-sm text-[#444444]">
                  Add some services to get started
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {cart.map((item: any, index: any) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-white/50 transition-all duration-300 group border border-transparent hover:border-[#F28C8C]/20">
                    <div className="flex-1">
                      <h4 className="font-lato font-medium text-[#B11C5F] text-sm">
                        {item.name}
                      </h4>
                      <p className="font-cormorant text-xs text-[#C59D5F] italic">
                        Service
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <IndianRupee className="w-4 h-4 text-[#B11C5F]" />

                        <p className="font-lato font-bold text-[#444444]">
                          {item.price}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(index)}
                      className="p-2 rounded-lg hover:bg-red-50 text-[#444444] hover:text-red-500 transition-all duration-300 group/trash">
                      <Trash2 className="w-4 h-4 group-hover/trash:scale-110 transition-transform duration-300" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="border-t border-[#F28C8C]/20 p-4 bg-gradient-to-r from-[#FFF6F8] to-white rounded-b-2xl">
              <div className="flex items-center justify-between mb-4">
                <span className="font-playfair text-lg font-bold text-[#B11C5F]">
                  Total
                </span>
                <span className="flex items-center space-x-1 font-lato text-lg font-bold text-[#444444]">
                  <IndianRupee className="w-5 h-5 text-[#B11C5F]" />
                  <span>{totalPrice}</span>
                </span>
              </div>
              <div className="flex justify-center">
                <Link
                  href="/saloon-services/slots"
                  onClick={() => setShowCart(false)}
                  className="w-40 flex items-center justify-center space-x-2 bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] text-white font-lato font-medium py-3 rounded-full hover:shadow-lg transform transition-all duration-300 hover:from-[#B11C5F] hover:to-[#F28C8C] group">
                  <span>Proceed</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
