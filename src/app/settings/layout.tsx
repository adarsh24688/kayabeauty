import Image from "next/image";
import AuthGuard from "@/components/auth/AuthGuard";
import ToastContainerConfig from "@/components/ui/ToastContainerConfig";
import AccountSidebar from "./AccountSidebar";
import settingImg from "../assets/setting/setting1.avif";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="w-full py-24 pl-11 relative overflow-hidden group">
        {/* Animated Background Image */}
        <div className="absolute inset-0">
          <Image
            src={settingImg}
            alt="Settings background"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-40 transition-transform duration-[8000ms] ease-out group-hover:scale-105"
            style={{
              objectPosition: "top",
              zIndex: 1,
            }}
          />
        </div>

        {/* Enhanced Animated Gradient Overlays */}

        <div className="absolute inset-0 z-[2] animate-pulse-slow" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent z-[3]" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-transparent z-[4]" />
        {/* Settings-themed Floating Elements */}
        <div className="absolute top-20 right-28 w-6 h-6 bg-[#B11C5F]/40 rounded-lg animate-bounce-slow blur-sm" />
        <div className="absolute top-40 right-20 w-4 h-4 bg-[#F28C8C]/50 rounded-full animate-pulse delay-1000 blur-sm" />
        <div className="absolute bottom-32 right-40 w-5 h-5 bg-white/30 rounded-lg animate-bounce-slow delay-2000 blur-sm" />
        <div className="absolute top-1/2 right-12 w-3 h-3 bg-[#C59D5F]/60 rounded-full animate-pulse delay-1500 blur-sm" />

        {/* Animated Border Lines */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#B11C5F]/80 to-transparent animate-shimmer" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#F28C8C]/80 to-transparent animate-shimmer delay-1000" />

        {/* Side Accent Lines */}
        <div className="absolute left-0 top-1/4 w-1 h-40 bg-gradient-to-b from-transparent via-[#B11C5F]/40 to-transparent animate-shimmer delay-500" />
        <div className="absolute right-0 bottom-1/3 w-1 h-32 bg-gradient-to-t from-transparent via-[#F28C8C]/50 to-transparent animate-shimmer delay-1500" />

        {/* Settings Theme Decorative Elements */}
        <div className="absolute top-24 left-24 w-12 h-12 border-2 border-[#B11C5F]/20 rounded-xl animate-spin-slow">
          <div className="absolute inset-2 border border-white/20 rounded-lg" />
          <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-[#B11C5F]/40 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="absolute bottom-24 left-20 w-8 h-8 border border-[#F28C8C]/30 rounded-lg animate-pulse">
          <div className="absolute inset-1 bg-gradient-to-br from-[#F28C8C]/20 to-transparent rounded" />
        </div>

        {/* Content Container with Enhanced Animation */}
        <div className="max-w-7xl mx-auto px-4 relative z-10 transform transition-all duration-1000 ease-out">
          <div className="relative">
            {/* Enhanced Glowing Background for Title */}
            <div className="absolute -inset-6 bg-gradient-to-r from-[#B11C5F]/25 via-white/15 to-[#F28C8C]/25 blur-2xl rounded-3xl animate-pulse-glow" />

            {/* Main Title with Multiple Animations */}
            <h1 className="text-4xl lg:text-5xl pt-10 font-playfair font-bold tracking-wide relative z-20 transform transition-all duration-1000 ease-out animate-slide-up">
              {/* Enhanced Gradient Text Effect */}
              <span className="text-white drop-shadow-lg text-shadow-lg">
                SETTINGS
              </span>

              {/* Animated Underline */}
              <div className="absolute -bottom-1 left-0 w-0 h-1 bg-gradient-to-r from-[#fff] via-[#fff] to-[#fff] animate-expand-width shadow-lg" />

              {/* Double Underline Effect */}
              <div className="absolute -bottom-3 left-0 w-0 h-0.5 bg-gradient-to-r from-transparent via-[#C59D5F]/70 to-transparent animate-expand-width delay-500" />
            </h1>

            {/* Settings-Focused Subtitle */}
            <p className="dancing-script text-xl lg:text-2xl text-[#fff] mt-4 italic relative z-20 animate-fade-in-up delay-500 opacity-0 drop-shadow-md">
              ⚙️ Customize your account preferences
            </p>

            {/* Additional Settings Tagline */}
            <p className="font-lato text-sm text-[#fff]/80 mt-2 relative z-20 animate-fade-in-up delay-700 opacity-0 tracking-wider uppercase">
              Account Settings • Privacy Controls • Preferences
            </p>

            {/* Settings-themed Decorative Elements */}
            <div className="absolute -top-4 -left-4 w-10 h-10 border-2 border-[#B11C5F]/40 rounded-xl animate-spin-slow flex items-center justify-center">
              <div className="text-[#B11C5F]/60 text-xs">⚙️</div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-8 h-8 border-2 border-[#F28C8C]/40 rounded-xl animate-spin-slow-reverse flex items-center justify-center">
              <div className="text-[#F28C8C]/60 text-xs">🔧</div>
            </div>

            {/* Corner Accents with Settings Theme */}
            <div className="absolute top-0 left-0 w-12 h-12 border-l-2 border-t-2 border-[#B11C5F]/25 rounded-tl-2xl animate-pulse">
              <div className="absolute top-2 left-2 text-[#B11C5F]/40 text-xs">
                🎛️
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-12 h-12 border-r-2 border-b-2 border-[#F28C8C]/40 rounded-br-2xl animate-pulse delay-1000">
              <div className="absolute bottom-2 right-2 text-[#F28C8C]/50 text-xs">
                ⚡
              </div>
            </div>

            {/* Configuration Status Indicators */}
            <div className="absolute top-4 right-4 flex space-x-1">
              <div className="w-2 h-2 bg-[#B11C5F]/40 rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-[#F28C8C]/50 rounded-full animate-pulse delay-300" />
              <div className="w-2 h-2 bg-[#C59D5F]/50 rounded-full animate-pulse delay-600" />
            </div>
          </div>
        </div>

        {/* Enhanced Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
          <div className="absolute top-1/5 left-1/5 w-1.5 h-1.5 bg-[#B11C5F]/50 rounded-full animate-float" />
          <div className="absolute top-1/3 left-2/3 w-1 h-1 bg-[#F28C8C]/60 rounded-full animate-float-delay-1" />
          <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-[#C59D5F]/40 rounded-full animate-float-delay-2" />
          <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-[#B11C5F]/60 rounded-full animate-float-delay-3" />
          <div className="absolute bottom-1/4 left-1/4 w-0.5 h-0.5 bg-[#F28C8C]/70 rounded-full animate-float delay-2000" />
          <div className="absolute top-1/2 right-1/2 w-1 h-1 bg-[#C59D5F]/50 rounded-full animate-float-delay-1 delay-1000" />
        </div>

        {/* Settings & Configuration Theme Magic Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[5]">
          <div className="absolute top-32 left-44 text-[#B11C5F]/40 animate-pulse delay-1000">
            ⚙️
          </div>
          <div className="absolute top-48 right-48 text-[#F28C8C]/50 animate-bounce-slow delay-2000">
            🔧
          </div>
          <div className="absolute bottom-48 left-56 text-[#C59D5F]/40 animate-pulse delay-1500">
            🎛️
          </div>
          <div className="absolute bottom-32 right-32 text-[#B11C5F]/40 animate-bounce-slow delay-500">
            ⚡
          </div>
          <div className="absolute top-2/3 left-28 text-[#F28C8C]/35 animate-pulse delay-2500">
            🔩
          </div>
          <div className="absolute top-1/3 right-20 text-[#C59D5F]/45 animate-bounce-slow delay-3000">
            ⚙️
          </div>
        </div>

        {/* Subtle Moving Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#B11C5F]/3 to-transparent z-[1] animate-pulse-slow delay-2000" />

        {/* Settings Grid Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-5 z-[1]"
          style={{
            backgroundImage: `
            linear-gradient(rgba(177,28,95,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(177,28,95,0.1) 1px, transparent 1px)
          `,
            backgroundSize: "50px 50px",
          }}
        />

        {/* Configuration Progress Bars */}
        <div className="absolute top-4 left-4 flex flex-col space-y-1">
          <div className="w-10 h-0.5 bg-[#B11C5F]/20 rounded-full overflow-hidden">
            <div className="w-full h-full bg-gradient-to-r from-[#B11C5F] to-[#F28C8C] animate-pulse" />
          </div>
          <div className="w-8 h-0.5 bg-[#B11C5F]/15 rounded-full overflow-hidden">
            <div className="w-3/4 h-full bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] animate-pulse delay-500" />
          </div>
          <div className="w-6 h-0.5 bg-[#B11C5F]/10 rounded-full overflow-hidden">
            <div className="w-1/2 h-full bg-gradient-to-r from-[#C59D5F] to-[#B11C5F] animate-pulse delay-1000" />
          </div>
        </div>
      </div>

      <div className="min-h-screen bg-gradient-to-br from-[#FFF6F8] to-[#FEFAF4] text-[#444444] py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-2">
            {/* Sidebar */}
            <div className="lg:w-1/4">
              <AccountSidebar />
            </div>
            <ToastContainerConfig />
            {children}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
