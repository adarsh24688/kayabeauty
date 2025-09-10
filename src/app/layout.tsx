import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./components/provider/Providers";
import AppWrapper from "./components/AppWrapper";
import ToastContainerConfig from "./components/ui/ToastContainerConfig";
import { Playfair_Display, Lato } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // choose the weights you need
  variable: "--font-playfair", // custom CSS variable
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"], // light, regular, bold
  variable: "--font-lato",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kaya Beauty Spa - Your Sanctuary of beauty and Wellness",
  description:
    "Experience holistic beauty and wellness at Kaya Beauty Spa. Book your appointment today! Discover Ayurvedic treatments, expert skincare, and a serene escape in Somerville, MA. Enhance your natural beauty with us. Since 2003. Book Now!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${lato.variable}`}>
      <head>
        <title>Belle Femme - The Hair Salon</title>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ backgroundColor: "#000000" }}>
        <>
          <Providers>
            <AppWrapper>{children}</AppWrapper>
            <ToastContainerConfig />
          </Providers>
        </>
      </body>
    </html>
  );
}
