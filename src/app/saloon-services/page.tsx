"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { addToCart } from "@/store/slices/cartSlice";
import Image, { StaticImageData } from "next/image";
import LeftPanel from "@/components/leftPanel/LeftPanel";
import BookingBottomBar from "@/saloon-services/BookingBottomBar";
import { setSelectedSlot } from "@/store/slices/uiSlice";
import serviceImage from "@/assets/kayaa-home/Kaya-Beauty.png";
import { IoCart } from "react-icons/io5";
import { FaAnglesRight } from "react-icons/fa6";
import { FaAnglesLeft } from "react-icons/fa6";
import CategoryDropdown from "./CategoryDropdown";

// Category images mapping with multiple images per category
type CategoryImagesType = {
  [key: string]: (string | StaticImageData)[];
  haircuts: string[];
  "hair color": string[];
  "make up": string[];
  beard: string[];
  waxing: string[];
  facial: string[];
  default: StaticImageData[];
};

const categoryImages: CategoryImagesType = {
  haircuts: [
    "/images/service/service-card/haircut1.avif",
    "/images/service/service-card/haircut2.avif",
    "/images/service/service-card/haircut3.avif",
    "/images/service/service-card/haircut4.avif",
    "/images/service/service-card/haircut5.avif",
  ],
  "hair color": [
    "/images/service/service-card/haircolor1.avif",
    "/images/service/service-card/haircolor2.avif",
    "/images/service/service-card/haircolor3.avif",
    "/images/service/service-card/haircolor4.avif",
  ],
  "make up": [
    "/images/service/service-card/makeup1.avif",
    "/images/service/service-card/makeup2.avif",
    "/images/service/service-card/makeup3.avif",
  ],
  beard: [
    "/images/service/service-card/beard1.avif",
    "/images/service/service-card/beard2.avif",
  ],
  waxing: [
    "/images/service/service-card/waxing1.avif",
    "/images/service/service-card/waxing2.avif",
    "/images/service/service-card/waxing3.avif",
  ],
  facial: [
    "/images/service/service-card/facial-1.avif",
    "/images/service/service-card/facial-2.avif",
  ],
  default: [serviceImage],
};

// Updated function to get random image from category
const getCategoryImage = (subcategory: string) => {
  const categoryImageArray =
    categoryImages[subcategory] || categoryImages.default;
  const randomIndex = Math.floor(Math.random() * categoryImageArray.length);
  return categoryImageArray[randomIndex];
};

// Shuffle function for randomizing services
const shuffleArray = (array: any[]) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// --- Fly to Cart Animation Helper ---
function flyCardToCart({
  cardElement,
  onComplete,
}: {
  cardElement: HTMLElement;
  onComplete?: () => void;
}) {
  const cartIcon = document.getElementById("cart-icon");
  if (!cartIcon || !cardElement) return;

  const startRect = cardElement.getBoundingClientRect();
  const endRect = cartIcon.getBoundingClientRect();

  const clonedCard = cardElement.cloneNode(true) as HTMLElement;

  clonedCard.style.position = "fixed";
  clonedCard.style.zIndex = "9999";
  clonedCard.style.left = `${startRect.left}px`;
  clonedCard.style.top = `${startRect.top}px`;
  clonedCard.style.width = `${startRect.width}px`;
  clonedCard.style.height = `${startRect.height}px`;
  clonedCard.style.margin = "0";
  clonedCard.style.pointerEvents = "none";
  clonedCard.style.borderRadius = "12px";
  clonedCard.style.boxShadow = "0 8px 32px 0 rgba(242, 140, 140, 0.8)";
  clonedCard.style.transition = "all 0.8s cubic-bezier(.68,-0.55,.27,1.55)";

  clonedCard.style.outline = "2px solid #F28C8C";
  clonedCard.style.outlineOffset = "2px";

  document.body.appendChild(clonedCard);

  setTimeout(() => {
    clonedCard.style.left = `${endRect.left + endRect.width / 2 - 25}px`;
    clonedCard.style.top = `${endRect.top + endRect.height / 2 - 25}px`;
    clonedCard.style.width = "50px";
    clonedCard.style.height = "50px";
    clonedCard.style.opacity = "0.3";
    clonedCard.style.transform = "scale(0.3) rotate(5deg)";
  }, 10);

  setTimeout(() => {
    if (document.body.contains(clonedCard)) {
      document.body.removeChild(clonedCard);
    }
    if (onComplete) onComplete();
  }, 850);
}

export default function Services() {
  const dispatch = useAppDispatch();
  const { allServices, loading, error, selectedLocationUuid } = useAppSelector(
    (state) => state.services
  );

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [visibleProducts, setVisibleProducts] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [previousLocationUuid, setPreviousLocationUuid] = useState<
    string | null
  >(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const servicesPerPage = 8;

  // Get unique categories from services
  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(allServices.map((service: any) => service.subcategory)),
    ];
    return [
      { name: "All", slug: null },
      ...uniqueCategories.map((cat) => ({
        name: String(cat),
        slug: cat !== null && cat !== undefined ? String(cat) : null,
      })),
    ];
  }, [allServices]);

  // Initialize component and restore state from sessionStorage
  useEffect(() => {
    const savedState = sessionStorage.getItem("servicesFilterState");
    const savedLocationUuid = sessionStorage.getItem("servicesLocationUuid");

    if (savedState && savedLocationUuid === selectedLocationUuid) {
      try {
        const {
          selectedCategory: savedCategory,
          search: savedSearch,
          currentPage: savedPage,
          visibleProducts: savedVisible,
        } = JSON.parse(savedState);

        setSelectedCategory(savedCategory || null);
        setSearch(savedSearch || "");
        setCurrentPage(savedPage || 1);
        setVisibleProducts(savedVisible || 8);
      } catch (error) {
        console.log("Error parsing saved state:", error);
      }
    }

    setPreviousLocationUuid(selectedLocationUuid);
    setIsInitialized(true);
  }, []);

  // Handle location changes
  useEffect(() => {
    if (
      isInitialized &&
      previousLocationUuid &&
      previousLocationUuid !== selectedLocationUuid
    ) {
      setSelectedCategory(null);
      setCurrentPage(1);
      setVisibleProducts(8);
      setSearch("");
      sessionStorage.removeItem("servicesFilterState");
      sessionStorage.setItem(
        "servicesLocationUuid",
        selectedLocationUuid || ""
      );
    }
    setPreviousLocationUuid(selectedLocationUuid);
  }, [selectedLocationUuid, previousLocationUuid, isInitialized]);

  // Save state when filters change
  useEffect(() => {
    if (isInitialized && selectedLocationUuid) {
      const filterState = {
        selectedCategory,
        search,
        currentPage,
        visibleProducts,
      };
      sessionStorage.setItem(
        "servicesFilterState",
        JSON.stringify(filterState)
      );
      sessionStorage.setItem("servicesLocationUuid", selectedLocationUuid);
    }
  }, [
    selectedCategory,
    search,
    currentPage,
    visibleProducts,
    isInitialized,
    selectedLocationUuid,
  ]);

  useEffect(() => {
    dispatch(setSelectedSlot(""));
  }, [dispatch]);

  // Reset pagination when category or search changes
  useEffect(() => {
    if (isInitialized) {
      setVisibleProducts(8);
      setCurrentPage(1);
    }
  }, [selectedCategory, search, isInitialized]);

  // Process services: shuffle them and assign random category images
  const processedServices = useMemo(() => {
    const servicesWithImages = allServices.map((service: any) => ({
      ...service,
      categoryImage: getCategoryImage(service.subcategory.toLowerCase()), // This will get a random image from the category
    }));

    // Shuffle ALL services
    return shuffleArray(servicesWithImages);
  }, [allServices, selectedCategory]); // Added selectedCategory to re-shuffle images when category changes

  const filteredProducts = processedServices.filter((service: any) => {
    return (
      (!selectedCategory || service.subcategory === selectedCategory) &&
      (service.service.toLowerCase().includes(search.toLowerCase()) ||
        (service.subcategory || "")
          .toLowerCase()
          .includes(search.toLowerCase()))
    );
  });

  const totalPages = Math.ceil(filteredProducts.length / servicesPerPage);
  const showLoadMore =
    filteredProducts.length <= 20 && visibleProducts < filteredProducts.length;
  const showPagination = filteredProducts.length > 20;

  const displayedServices = showPagination
    ? filteredProducts.slice(
        (currentPage - 1) * servicesPerPage,
        currentPage * servicesPerPage
      )
    : filteredProducts.slice(0, visibleProducts);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAdd = (service: any, e: React.MouseEvent<HTMLButtonElement>) => {
    const card = (e.target as HTMLElement).closest(
      ".service-card-animate"
    ) as HTMLElement;
    if (card) {
      const img = card.querySelector("img") as HTMLImageElement;
      if (img) {
        card.classList.add("card-shrink");
        setTimeout(() => card.classList.remove("card-shrink"), 200);

        flyCardToCart({
          cardElement: card,
          onComplete: () => {
            console.log("Card animation completed!");
          },
        });
      } else {
        card.classList.add("card-shrink");
        setTimeout(() => card.classList.remove("card-shrink"), 200);

        flyCardToCart({
          cardElement: card,
          onComplete: () => {
            console.log("Card animation completed!");
          },
        });
      }
    }

    dispatch(
      addToCart({
        id: service.id,
        name: service.service,
        duration: Number.parseInt(service.service_time),
        price: service.price,
        category: service.subcategory,
        tags: [service.subcategory],
        vendor_location_uuid: selectedLocationUuid,
      })
    );
  };

  const handleLoadMore = () => {
    setVisibleProducts(filteredProducts.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fefaf4] to-pink-50 text-[#444444]">
      {/* Header - KEEPING YOUR ORIGINAL HEADER */}
      <div className="w-full relative py-28 pl-11 pt-32 overflow-hidden group">
        <div className="absolute inset-0">
          <Image
            src="/images/service/service.webp"
            alt="Services background"
            fill
            sizes="100vw"
            priority
            className="object-cover object-center filter brightness-75 transition-transform duration-[8000ms] ease-out group-hover:scale-105"
            style={{
              zIndex: 1,
            }}
          />
        </div>

        <div className="absolute inset-0 z-[2] animate-pulse-slow" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent z-[3]" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-transparent z-[4]" />

        <div className="absolute top-16 right-24 w-5 h-5 bg-[#FFF6F8]/30 rounded-full animate-bounce-slow blur-sm" />
        <div className="absolute top-40 right-16 w-3 h-3 bg-[#F28C8C]/50 rounded-full animate-pulse delay-1000 blur-sm" />
        <div className="absolute bottom-32 right-40 w-4 h-4 bg-white/20 rounded-full animate-bounce-slow delay-2000 blur-sm" />
        <div className="absolute top-1/2 right-8 w-2 h-2 bg-[#C59D5F]/60 rounded-full animate-pulse delay-1500 blur-sm" />

        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FFF6F8]/60 to-transparent animate-shimmer" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#F28C8C]/80 to-transparent animate-shimmer delay-1000" />

        <div className="absolute left-0 top-1/4 w-1 h-32 bg-gradient-to-b from-transparent via-[#FFF6F8]/40 to-transparent animate-shimmer delay-500" />
        <div className="absolute right-0 bottom-1/4 w-1 h-24 bg-gradient-to-t from-transparent via-[#F28C8C]/50 to-transparent animate-shimmer delay-1500" />

        <div className="max-w-7xl mx-auto px-4 relative z-10 transform transition-all duration-1000 ease-out">
          <div className="relative">
            <div className="absolute -inset-6 bg-gradient-to-r from-[#FFF6F8]/10 via-white/5 to-[#F28C8C]/15 blur-2xl rounded-3xl animate-pulse-glow" />

            <h1 className="text-4xl lg:text-5xl pt-10 font-playfair font-bold tracking-wide relative z-20 transform transition-all duration-1000 ease-out animate-slide-up">
              <span className="text-white animate-gradient-x drop-shadow-lg text-shadow-sm">
                SERVICES LIST
              </span>
              <div className="absolute -bottom-1 left-0 w-0 h-1 bg-gradient-to-r from-[#FFF6F8] via-[white] to-[#FFF6F8] animate-expand-width shadow-lg" />
              <div className="absolute -bottom-3 left-0 w-0 h-0.5 bg-gradient-to-r from-transparent via-[#C59D5F]/60 to-transparent animate-expand-width delay-500" />
            </h1>

            <p className="dancing-script text-xl lg:text-2xl text-[#FFF6F8] mt-4 italic relative z-20 animate-fade-in-up delay-500 opacity-0 drop-shadow-md">
              ✨ Discover our wellness & beauty experiences
            </p>

            <p className="font-lato text-sm text-[#FFF6F8]/80 mt-2 relative z-20 animate-fade-in-up delay-700 opacity-0 tracking-wider uppercase">
              Premium Services • Expert Care • Luxury Experience
            </p>

            <div className="absolute -top-4 -left-4 w-10 h-10 border-2 border-[#FFF6F8]/30 rounded-full animate-spin-slow" />
            <div className="absolute -bottom-4 -right-4 w-8 h-8 border-2 border-[#F28C8C]/40 rounded-full animate-spin-slow-reverse" />

            <div className="absolute top-0 left-0 w-12 h-12 border-l-2 border-t-2 border-[#FFF6F8]/20 rounded-tl-2xl animate-pulse" />
            <div className="absolute bottom-0 right-0 w-12 h-12 border-r-2 border-b-2 border-[#F28C8C]/30 rounded-br-2xl animate-pulse delay-1000" />
          </div>
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
          <div className="absolute top-1/5 left-1/5 w-1 h-1 bg-[#FFF6F8]/70 rounded-full animate-float" />
          <div className="absolute top-1/4 right-1/3 w-1.5 h-1.5 bg-[#F28C8C]/60 rounded-full animate-float-delay-1" />
          <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-[#C59D5F]/50 rounded-full animate-float-delay-2" />
          <div className="absolute top-2/3 right-1/5 w-1 h-1 bg-white/60 rounded-full animate-float-delay-3" />
          <div className="absolute bottom-1/3 left-1/4 w-0.5 h-0.5 bg-[#FFF6F8]/80 rounded-full animate-float delay-2000" />
          <div className="absolute top-1/2 right-1/2 w-1 h-1 bg-[#F28C8C]/40 rounded-full animate-float-delay-1 delay-1000" />
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[5]">
          <div className="absolute top-20 left-20 text-[#FFF6F8]/40 animate-pulse delay-1000">
            ✨
          </div>
          <div className="absolute top-32 right-32 text-[#F28C8C]/50 animate-bounce-slow delay-2000">
            💫
          </div>
          <div className="absolute bottom-40 left-40 text-white/30 animate-pulse delay-1500">
            ⭐
          </div>
          <div className="absolute bottom-20 right-20 text-[#C59D5F]/40 animate-bounce-slow delay-500">
            ✨
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#FFF6F8]/5 to-transparent z-[1] animate-pulse-slow delay-2000" />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {!selectedLocationUuid || loading ? (
          <div className="text-center py-12">
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F28C8C]"></div>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-600">Error: {error}</div>
          </div>
        ) : (
          <div className="flex flex-col gap-8 md:flex-row md:gap-14">
            {/* Sidebar */}
            <aside className="w-full md:w-[350px]">
              <div className="pb-4 border-b border-[#F28C8C]/30">
                <form
                  className="flex border border-[#F28C8C]/30 rounded-2xl overflow-hidden bg-white shadow-md"
                  onSubmit={(e) => e.preventDefault()}>
                  <input
                    type="search"
                    className="flex-1 px-4 py-3 outline-none bg-transparent text-[#444444] placeholder:text-[#C59D5F] font-lato"
                    placeholder="Type to search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="px-4 py-3 bg-[#F28C8C] hover:bg-[#F28C8C]/90 text-white hover:from-[#B11C5F] hover:to-[#F28C8C] transition-all duration-300">
                    <span className="sr-only">Search</span>🔍
                  </button>
                </form>
              </div>

              <div className="my-6">
                <h2 className="font-playfair font-bold mb-4 text-[#B11C5F] text-xl">
                  CATEGORIES
                </h2>

                <div className="block md:hidden">
                  <CategoryDropdown
                    categories={categories}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                  />
                </div>

                <ul className="hidden md:block space-y-2 max-h-70 overflow-y-auto scrollbar-thin scrollbar-thumb-[#F28C8C] scrollbar-track-gray-100 pr-2 categories_scroll">
                  {categories.map((cat) => (
                    <li
                      key={
                        cat.slug !== null && cat.slug !== undefined
                          ? String(cat.slug)
                          : "all"
                      }>
                      <button
                        className={`text-left w-full px-3 py-2 rounded-xl transition-all duration-300 font-lato font-medium ${
                          selectedCategory === cat.slug
                            ? "bg-[#F28C8C] text-white shadow-md"
                            : "bg-white text-[#444444] hover:bg-[#fefaf4] hover:text-[#B11C5F] border border-[#F28C8C]/20"
                        }`}
                        onClick={() =>
                          setSelectedCategory(cat.slug as string | null)
                        }>
                        {String(cat.name)}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="sticky top-0 hidden md:block mt-6">
                <LeftPanel content={"summary"} />
              </div>
            </aside>

            <div className="flex flex-col">
              <div className="bg-gradient-to-r from-[#fefaf4] to-white rounded-2xl px-6 py-4 shadow-md font-lato font-semibold text-lg mb-6 text-[#B11C5F] border border-[#F28C8C]/20">
                We are providing a total of{" "}
                <span className="text-[#F28C8C] ml-1">
                  {filteredProducts.length}
                </span>{" "}
                services.
                <span className="text-sm font-normal text-[#C59D5F] ml-2">
                  (Services & images are shuffled for variety)
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {displayedServices.map((service: any, index: any) => (
                  <div
                    key={service.id}
                    className="service-card-animate relative group rounded-3xl bg-gradient-to-br from-white to-[#fefaf4] border border-[#F28C8C]/20 shadow-lg overflow-hidden transform transition-all duration-500  hover:shadow-2xl opacity-100"
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}>
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#F28C8C]/20 to-transparent rounded-full transform translate-x-10 -translate-y-10 transition-transform duration-700 group-hover:scale-150"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-[#C59D5F]/20 to-transparent rounded-full transform -translate-x-8 translate-y-8 transition-transform duration-700 group-hover:scale-125"></div>

                    <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="w-2 h-2 bg-[#F28C8C] rounded-full animate-bounce"></div>
                    </div>

                    {/* Image section - UPDATED WITH RANDOM CATEGORY IMAGES */}
                    <div className="relative overflow-hidden rounded-t-3xl h-48 sm:h-56">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10"></div>

                      <Image
                        src={
                          service.image || service.categoryImage || serviceImage
                        }
                        alt={service.service}
                        width={400}
                        height={240}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        unoptimized
                      />

                      <div className="absolute top-4 right-4 z-20 bg-[#C59D5F] px-1 py-1 rounded-full shadow-lg backdrop-blur-sm border border-white/20">
                        <span className="font-playfair font-bold text-white text-sm">
                          Rs {service.price.toFixed(2)}
                        </span>
                      </div>

                      <div className="absolute bottom-4 left-4 z-20 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-[#F28C8C]/20 shadow-md">
                        <div className="flex items-center space-x-1 text-[#B11C5F]">
                          <div className="w-2 h-2 bg-[#F28C8C] rounded-full animate-pulse"></div>
                          <span className="text-sm font-medium font-lato">
                            {service.service_time} min
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 sm:p-6 flex flex-col justify-between h-52">
                      <div className="mb-4">
                        <h3 className="font-playfair font-bold text-xl text-[#B11C5F] mb-2 leading-tight group-hover:text-[#F28C8C] transition-colors duration-300">
                          {service.service.length > 20
                            ? `${service.service.slice(0, 20)}...`
                            : service.service}
                        </h3>

                        <div className="flex items-center space-x-2 mb-3">
                          <div className="w-1 h-4 bg-gradient-to-b from-[#F28C8C] to-[#C59D5F] rounded-full"></div>
                          <span className="font-cormorant text-[#C59D5F] italic text-base">
                            {service.subcategory}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-start">
                        <button
                          className="group/btn relative px-6 py-3 bg-[#F28C8C] text-white font-lato font-semibold rounded-full shadow-lg hover:shadow-xl transform  active:scale-95 transition-all duration-300 hover:from-[#B11C5F] hover:to-[#F28C8C] overflow-hidden"
                          onClick={(e) => handleAdd(service, e)}>
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>

                          <div className="relative flex items-center space-x-2">
                            <span>Add</span>
                            <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center group-hover/btn:rotate-12 transition-transform duration-300">
                              <IoCart className="text-xs" />
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-r from-[#F28C8C]/0 via-[#F28C8C]/5 to-[#C59D5F]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"></div>
                  </div>
                ))}
              </div>

              {/* Pagination or Load More */}
              {showPagination ? (
                <div className="mt-8 flex justify-center items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`md:px-4 px-2 py-2 rounded-full font-lato font-medium transition-all duration-300 ${
                      currentPage === 1
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] text-white hover:from-[#B11C5F] hover:to-[#F28C8C] shadow-md hover:shadow-lg"
                    }`}>
                    <FaAnglesLeft />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(
                      (page) =>
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                    )
                    .map((page, index, array) => (
                      <React.Fragment key={page}>
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span className="px-2 text-[#C59D5F]">...</span>
                        )}
                        <button
                          onClick={() => handlePageChange(page)}
                          className={`md:px-4 px-2 py-1 rounded-full font-lato font-medium transition-all duration-300 ${
                            currentPage === page
                              ? "bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] text-white shadow-md"
                              : "bg-white text-[#444444] hover:bg-[#fefaf4] hover:text-[#B11C5F] border border-[#F28C8C]/20"
                          }`}>
                          {page}
                        </button>
                      </React.Fragment>
                    ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`md:px-4 px-2 py-2 rounded-full font-lato font-medium transition-all duration-300 ${
                      currentPage === totalPages
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] text-white hover:from-[#B11C5F] hover:to-[#F28C8C] shadow-md hover:shadow-lg"
                    }`}>
                    <FaAnglesRight />
                  </button>
                </div>
              ) : showLoadMore ? (
                <div className="mt-8 flex justify-center mb-4 md:mb-0">
                  <button
                    onClick={handleLoadMore}
                    className="px-8 py-3 rounded-full bg-[#F28C8C] text-white font-lato font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 hover:bg-[#f28c8cd6] ">
                    Load More
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
      <BookingBottomBar />
    </div>
  );
}
