"use client";
import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { initializeAuth } from "@/store/slices/authSlice";
import { initializeCart } from "@/store/slices/cartSlice";

export const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen min-w-screen bg-gradient-to-br from-[#FFF6F8] to-pink-50">
      <div className="loader"></div>
    </div>
  );
};

// 🔹 Hydration component
function HydrateAuth({ children }: { children: any }) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    console.log("Providers: Starting initialization");

    // Initialize auth + cart
    store.dispatch(initializeAuth());
    store.dispatch(initializeCart());

    // ⏳ Force at least 2 sec loader
    const timer = setTimeout(() => {
      setIsHydrated(true);
      console.log("Providers: Initialization complete (after delay)");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div suppressHydrationWarning>
      {isHydrated ? (
        children
      ) : (
        <div className="flex items-center justify-center min-h-screen bg-white">
          <Loader />
        </div>
      )}
    </div>
  );
}

// 🔹 Error boundary
class AuthErrorBoundary extends React.Component<
  { children: any },
  { hasError: boolean }
> {
  constructor(props: { children: any }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.log("Auth Error Boundary caught error:", error);
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.log("Auth Error Boundary error details:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen text-red-600">
          Something went wrong with authentication. Please refresh the page.
        </div>
      );
    }
    return this.props.children;
  }
}

// 🔹 Final Providers wrapper
export default function Providers({ children }: { children: any }) {
  return (
    <Provider store={store}>
      <AuthErrorBoundary>
        <HydrateAuth>{children}</HydrateAuth>
      </AuthErrorBoundary>
    </Provider>
  );
}
