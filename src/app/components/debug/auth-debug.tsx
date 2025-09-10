"use client";

import { useAppSelector } from "@/store/hook";

export default function AuthDebug() {
  const authState = useAppSelector((state) => state.auth);

  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 bg-black/90 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">Auth Debug</h3>
      <div className="space-y-1">
        <p>isInitialized: {authState.isInitialized ? "true" : "false"}</p>
        <p>tempToken: {authState.tempToken ? "exists" : "null"}</p>
        <p>user: {authState.user ? "exists" : "null"}</p>
        <p>
          alreadyRegistered: {authState.alreadyRegistered ? "true" : "false"}
        </p>
        <p>skipProfile: {authState.skipProfile ? "true" : "false"}</p>
        <p>isLoadingProfile: {authState.isLoadingProfile ? "true" : "false"}</p>
        <p>isLoggingOut: {authState.isLoggingOut ? "true" : "false"}</p>
        <p>
          forgotPasswordOtpSent:{" "}
          {authState.forgotPasswordOtpSent ? "true" : "false"}
        </p>
        <p>
          isResettingPassword:{" "}
          {authState.isResettingPassword ? "true" : "false"}
        </p>
        <p>error: {authState.error || "none"}</p>
        <p>
          localStorage token:{" "}
          {typeof window !== "undefined" && localStorage.getItem("authToken")
            ? "exists"
            : "null"}
        </p>
      </div>
    </div>
  );
}
