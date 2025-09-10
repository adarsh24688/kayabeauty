import type { NextConfig } from "next";
/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  images: {
    domains: ["images.unsplash.com", "img.dingg.app", "dingg-user-images.s3.ap-south-1.amazonaws.com"],
  },

  // ...other config options
};

export default nextConfig;
