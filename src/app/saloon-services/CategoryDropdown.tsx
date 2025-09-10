"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

interface CategoryDropdownProps {
  categories: Array<{ name: string; slug: string | null }>;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
}

export default function CategoryDropdown({
  categories,
  selectedCategory,
  setSelectedCategory,
}: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Find the active category
  const activeCategory = categories.find(
    (cat) => cat.slug === selectedCategory
  );

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

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-white/95 backdrop-blur-xl border-2 border-[#F28C8C]/30 rounded-2xl shadow-2xl hover:bg-[#FFF6F8] transition-all duration-300 font-lato"
        aria-haspopup="listbox"
        aria-expanded={isOpen}>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-[#F28C8C] rounded-full"></div>
          <span className="text-[#B11C5F] font-semibold">
            {activeCategory ? activeCategory.name : "All Categories"}
          </span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-[#C59D5F] transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50">
          <div className="bg-white/95 backdrop-blur-xl border-2 border-[#F28C8C]/30 rounded-2xl shadow-2xl overflow-hidden">
            <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-[#F28C8C] scrollbar-track-gray-100">
              {categories.map((category) => {
                const isActive = selectedCategory === category.slug;
                return (
                  <button
                    key={category.slug || "all"}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(category.slug);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 p-4 transition-all duration-300 font-lato text-left ${
                      isActive
                        ? "bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] text-white font-semibold shadow-lg"
                        : "text-[#444444] hover:bg-[#FFF6F8] hover:text-[#B11C5F] hover:scale-[1.02]"
                    }`}>
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isActive ? "bg-white" : "bg-[#F28C8C]"
                      }`}></div>
                    <span>{category.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
