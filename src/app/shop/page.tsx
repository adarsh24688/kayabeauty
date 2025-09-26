// pages/shop/page.tsx
"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import {
  fetchProducts,
  setSelectedCategory,
  setSearchQuery,
  selectFilteredProducts,
  selectCategories,
  selectProductsLoading,
  selectProductsError,
  selectCurrentFilters,
} from "@/store/slices/productsSlice";
import Image from "next/image";
import {
  Search,
  ChevronDown,
  Grid,
  List,
  ShoppingCart,
  Star,
} from "lucide-react";
import shopHeader from "@/assets/shop/shop_header.jpg";
import productImage from "@/assets/shop/product-image.png";
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";
import { IoCart } from "react-icons/io5";

interface Product {
  id: number;
  name: string;
  price: number;
  cost: number;
  brand: string;
  detail: string;
  image: string;
  measurement: number | null;
  unit: string;
  stock: number;
  item_code: string;
  is_public: boolean;
  images: string[];
}

// Custom Category Dropdown Component
const CategoryDropdown = ({
  categories,
  selectedCategory,
  onCategorySelect,
}: {
  categories: Array<{ id: string; name: string }>;
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const activeCategory = categories.find((cat) => cat.id === selectedCategory);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full min-w-[200px] flex items-center justify-between px-4 py-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-orange-400 outline-none transition-all duration-200">
        <span className="text-gray-700 font-medium truncate">
          {activeCategory?.name || "All Categories"}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Menu */}
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  onCategorySelect(category.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-200 ${
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-orange-400 to-pink-400 text-white hover:from-orange-500 hover:to-pink-500"
                    : "text-gray-700"
                }`}>
                {category.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

function page() {
  const dispatch = useAppDispatch();

  // Redux state with proper selectors
  const loading = useAppSelector(selectProductsLoading);
  const error = useAppSelector(selectProductsError);
  const filteredProducts = useAppSelector(selectFilteredProducts);
  const categoryOptions = useAppSelector(selectCategories);
  const currentFilters = useAppSelector(selectCurrentFilters);

  // Local state
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("shuffle");
  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 12;

  // Fetch products on component mount
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [currentFilters.selectedCategory, currentFilters.searchQuery]);

  // Shuffle products for variety (as requested)
  const shuffleArray = (array: Product[]) => {
    if (!Array.isArray(array)) return [];
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Sort and paginate products with memoization
  const sortedProducts = useMemo(() => {
    if (!Array.isArray(filteredProducts)) return [];

    let sorted = [...filteredProducts];

    // Sort products
    switch (sortBy) {
      case "price-low":
        sorted.sort((a, b) => (a?.price || 0) - (b?.price || 0));
        break;
      case "price-high":
        sorted.sort((a, b) => (b?.price || 0) - (a?.price || 0));
        break;
      case "name":
        sorted.sort((a, b) => (a?.name || "").localeCompare(b?.name || ""));
        break;
      default:
        sorted = shuffleArray(sorted); // Shuffle for variety
    }

    return sorted;
  }, [filteredProducts, sortBy]);

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const displayedProducts = sortedProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  // Get default product image
  const getProductImage = (product: Product) => {
    // Check if product exists
    if (!product) {
      return productImage;
    }

    // First, check the images array
    if (
      product.images &&
      Array.isArray(product.images) &&
      product.images.length > 0 &&
      product.images[0] &&
      product.images[0] !== "undefined" &&
      product.images[0] !== "null" &&
      product.images[0].trim() !== ""
    ) {
      return product.images[0];
    }

    // Then, check the single image field
    if (
      product.image &&
      product.image !== "undefined" &&
      product.image !== "null" &&
      product.image.trim() !== ""
    ) {
      return product.image;
    }

    // Return placeholder if no valid image found
    return productImage;
  };

  // Search handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    dispatch(setSearchQuery(value));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-400 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-medium">Error: {error}</p>
          <button
            onClick={() => dispatch(fetchProducts())}
            className="mt-4 px-6 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition-colors">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-orange-50">
      {/* Header Section */}
      <div className="w-full relative py-28 pl-11 pt-32 overflow-hidden group">
        <div className="absolute inset-0">
          <Image
            src={shopHeader}
            alt="Shop background"
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
                LUXURY BOUTIQUE
              </span>
              <div className="absolute -bottom-1 left-0 w-0 h-1 bg-gradient-to-r from-[#FFF6F8] via-[white] to-[#FFF6F8] animate-expand-width shadow-lg" />
              <div className="absolute -bottom-3 left-0 w-0 h-0.5 bg-gradient-to-r from-transparent via-[#C59D5F]/60 to-transparent animate-expand-width delay-500" />
            </h1>

            <p className="dancing-script text-xl lg:text-2xl text-[#FFF6F8] mt-4 italic relative z-20 animate-fade-in-up delay-500 opacity-0 drop-shadow-md">
              🛍️ Indulge in premium wellness & beauty treasures
            </p>

            <p className="font-lato text-sm text-[#FFF6F8]/80 mt-2 relative z-20 animate-fade-in-up delay-700 opacity-0 tracking-wider uppercase">
              Exclusive Collections • Expert Curation • Uncompromising Quality
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

        {/* Product & Shopping Themed Floating Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[5]">
          {/* Beauty & Cosmetics Icons */}
          <div className="absolute top-20 left-20 text-[#FFF6F8]/40 animate-pulse delay-1000 text-2xl">
            💄
          </div>
          <div className="absolute top-32 right-32 text-[#F28C8C]/50 animate-bounce-slow delay-2000 text-xl">
            🧴
          </div>
          <div className="absolute bottom-40 left-40 text-white/30 animate-pulse delay-1500 text-2xl">
            🛍️
          </div>
          <div className="absolute bottom-20 right-20 text-[#C59D5F]/40 animate-bounce-slow delay-500 text-xl">
            💅
          </div>

          {/* Additional Beauty Products */}
          <div className="absolute top-1/3 left-1/6 text-[#FFF6F8]/35 animate-float delay-3000 text-lg">
            🧖‍♀️
          </div>
          <div className="absolute top-60 right-1/5 text-[#F28C8C]/45 animate-pulse delay-2500 text-xl">
            🧴
          </div>
          <div className="absolute bottom-1/3 right-1/3 text-white/35 animate-bounce-slow delay-1800 text-lg">
            🎀
          </div>
          <div className="absolute top-3/4 left-1/3 text-[#C59D5F]/40 animate-float-delay-2 text-xl">
            🌸
          </div>

          {/* Skincare & Wellness */}
          <div className="absolute top-1/2 left-1/12 text-[#FFF6F8]/30 animate-pulse delay-4000 text-lg">
            🧼
          </div>
          <div className="absolute bottom-1/5 right-1/6 text-[#F28C8C]/40 animate-float delay-3500 text-xl">
            🛒
          </div>
          <div className="absolute top-1/6 right-1/2 text-white/25 animate-bounce-slow delay-4500 text-lg">
            💋
          </div>
          <div className="absolute bottom-2/3 left-2/3 text-[#C59D5F]/35 animate-pulse delay-5000 text-lg">
            🧽
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#FFF6F8]/5 to-transparent z-[1] animate-pulse-slow delay-2000" />
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Products Section Title and Count */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-playfair font-bold mb-2 text-[#B11C5F] text-3xl">
                {currentFilters.selectedCategory === "all"
                  ? "All Products"
                  : categoryOptions.find(
                      (c) => c.id === currentFilters.selectedCategory
                    )?.name || "Products"}
              </h2>
              <p className="text-[#C59D5F] text-lg">
                Showing {displayedProducts.length} of {sortedProducts.length}{" "}
                products
              </p>
            </div>

            {sortedProducts.length > 0 && (
              <div className="text-[#C59D5F] text-lg">
                Page {currentPage} of {totalPages}
              </div>
            )}
          </div>
        </div>
        {/* Top Controls Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            {/* Left Side - Search and Category */}
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="flex-1 min-w-[250px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={currentFilters.searchQuery}
                    onChange={handleSearchChange}
                    className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition-all duration-200"
                  />
                </div>
              </div>

              {/* Category Dropdown */}
              <CategoryDropdown
                categories={categoryOptions}
                selectedCategory={currentFilters.selectedCategory}
                onCategorySelect={(categoryId) =>
                  dispatch(setSelectedCategory(categoryId))
                }
              />
            </div>

            {/* Right Side - Sort and View Toggle */}
            <div className="flex gap-4 items-center">
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="min-w-[180px] px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none transition-all duration-200">
                <option value="shuffle">Shuffle (Random)</option>
                <option value="name">Name A-Z</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2.5 transition-all duration-200 ${
                    viewMode === "grid"
                      ? "bg-gradient-to-r from-orange-400 to-pink-400 text-white shadow-lg"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}>
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2.5 transition-all duration-200 ${
                    viewMode === "list"
                      ? "bg-gradient-to-r from-orange-400 to-pink-400 text-white shadow-lg"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}>
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {sortedProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No products found
              </h3>
              <p className="text-gray-500 mb-6">
                No products match your current search and filter criteria.
              </p>
              <button
                onClick={() => {
                  dispatch(setSearchQuery(""));
                  dispatch(setSelectedCategory("all"));
                }}
                className="px-6 py-3 bg-gradient-to-r from-orange-400 to-pink-400 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-medium">
                Clear All Filters
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Products Grid */}
            <div
              className={`grid gap-6 mb-8 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              }`}>
              {displayedProducts.map((product) => (
                <div
                  key={product?.id || Math.random()}
                  className={`bg-white rounded-sm shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group ${
                    viewMode === "list" ? "flex" : ""
                  }`}>
                  {/* Product Image */}
                  <div
                    className={`relative ${
                      viewMode === "list" ? "w-56 h-56" : "aspect-square"
                    } overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200`}>
                    <Image
                      src={getProductImage(product)}
                      alt={product?.name || "Product"}
                      fill
                      className=" object-center group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />

                    {/* Stock Badge */}
                    {product?.stock && product.stock < 10 && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                        {product.stock} left
                      </div>
                    )}

                    {/* Price Badge */}
                    <div className="absolute top-3 right-3 bg-[#C59D5F] text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                      ₹{product?.price || 0}
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                  </div>

                  {/* Product Info */}
                  <div
                    className={`p-5 ${
                      viewMode === "list"
                        ? "flex-1 flex flex-col justify-between"
                        : ""
                    }`}>
                    <div>
                      <h3 className="font-playfair font-bold text-xl text-[#B11C5F] mb-2 leading-tight group-hover:text-[#F28C8C] transition-colors duration-300">
                        {product?.name.length > 20
                          ? `${product?.name.slice(0, 20)}...`
                          : product?.name}
                      </h3>

                      <div
                        className={`${
                          viewMode === "list"
                            ? "flex flex-col justify-between"
                            : "flex items-center justify-between mb-4"
                        }`}>
                        <div className="flex items-center space-x-2">
                          <div className="w-1 h-4 bg-gradient-to-b from-[#F28C8C] to-[#C59D5F] rounded-full"></div>
                          <span className="font-cormorant text-[#C59D5F] italic text-base">
                            {product?.brand ? product.brand : "shehnaz"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {product?.measurement && (
                            <span className="font-cormorant text-sm text-[#C59D5F] px-2 py-1">
                              {product.measurement} {product?.unit || ""}
                            </span>
                          )}
                        </div>

                        {/* <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600 font-medium">
                              4.5
                            </span>
                          </div> */}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-gray-800">
                            ₹{product?.price || 0}
                          </span>
                          {product?.cost &&
                            product.cost > 0 &&
                            product.cost < (product?.price || 0) && (
                              <span className="text-sm text-gray-500 line-through font-medium">
                                ₹{product.cost}
                              </span>
                            )}
                        </div> */}

                      <div className="flex items-center justify-start">
                        <button
                          className="group/btn relative px-6 py-3 bg-[#F28C8C] text-white font-lato font-semibold rounded-full shadow-lg hover:shadow-xl transform  active:scale-95 transition-all duration-300 hover:from-[#B11C5F] hover:to-[#F28C8C] overflow-hidden"
                          // onClick={(e) => handleAdd(service, e)}
                        >
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
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <div className="flex items-center gap-2 bg-white rounded-2xl shadow-lg p-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`md:px-4 px-2 py-2 rounded-full font-lato font-medium transition-all duration-300 ${
                      currentPage === 1
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] text-white hover:from-[#B11C5F] hover:to-[#F28C8C] shadow-md hover:shadow-lg"
                    }`}>
                    <FaAnglesLeft />
                  </button>

                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 7) {
                      pageNum = i + 1;
                    } else if (currentPage <= 4) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 3) {
                      pageNum = totalPages - 6 + i;
                    } else {
                      pageNum = currentPage - 3 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`md:px-4 px-2 py-1 rounded-full font-lato font-medium transition-all duration-300 ${
                          currentPage === pageNum
                            ? "bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] text-white shadow-md"
                            : "bg-white text-[#444444] hover:bg-[#fefaf4] hover:text-[#B11C5F] border border-[#F28C8C]/20"
                        }`}>
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className={`md:px-4 px-2 py-2 rounded-full font-lato font-medium transition-all duration-300 ${
                      currentPage === totalPages
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] text-white hover:from-[#B11C5F] hover:to-[#F28C8C] shadow-md hover:shadow-lg"
                    }`}>
                    <FaAnglesRight />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default page;
