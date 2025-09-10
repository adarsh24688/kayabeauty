"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { syncCartOnLogin, loadUserCart } from "@/store/slices/cartSlice";
import { getUserProfile, initializeAuth } from "@/store/slices/authSlice";

export default function LoginHandler() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const {
    tempToken,
    alreadyRegistered,
    skipProfile,
    isLoadingProfile,
    isInitialized,
  } = useAppSelector((state) => state.auth);

  // Initialize auth on mount - ONLY ONCE
  useEffect(() => {
    console.log("🔧 LoginHandler: Initializing auth");
    dispatch(initializeAuth());
  }, [dispatch]);

  // Auto-fetch user profile if we have a token but no user (page refresh scenario)
  useEffect(() => {
    console.log("🔍 LoginHandler: Checking auto-login conditions", {
      isInitialized,
      tempToken: !!tempToken,
      user: !!user,
      isLoadingProfile,
    });

    // If we're initialized, have a token, but no user - fetch the profile (page refresh scenario)
    if (isInitialized && tempToken && !user && !isLoadingProfile) {
      console.log(
        "✅ LoginHandler: Auto-fetching user profile after page refresh"
      );
      dispatch(getUserProfile()).catch((err) => {
        console.log("Failed to auto-fetch profile on page refresh:", err);
      });
    }
  }, [isInitialized, tempToken, user, isLoadingProfile, dispatch]);

  // Fetch user profile ONLY after OTP verification for existing users
  useEffect(() => {
    console.log("🔍 LoginHandler: Checking OTP verification result", {
      tempToken: !!tempToken,
      alreadyRegistered,
      skipProfile,
      user: !!user,
      isLoadingProfile,
    });

    // ONLY fetch if user verified OTP and is already registered
    if (
      tempToken &&
      alreadyRegistered &&
      skipProfile &&
      !user &&
      !isLoadingProfile
    ) {
      console.log(
        "✅ LoginHandler: User verified OTP and is existing user - fetching profile"
      );
      dispatch(getUserProfile()).catch((err) => {
        console.log("Failed to fetch profile after OTP verification:", err);
      });
    }
  }, [
    tempToken,
    alreadyRegistered,
    skipProfile,
    user,
    isLoadingProfile,
    dispatch,
  ]);

  // Sync cart when user logs in
  useEffect(() => {
    if (user) {
      console.log("🛒 LoginHandler: User logged in, syncing cart");
      const guestCart =
        typeof window !== "undefined"
          ? localStorage.getItem("guestCart")
          : null;

      if (guestCart && JSON.parse(guestCart).length > 0) {
        dispatch(syncCartOnLogin(user));
      } else {
        dispatch(loadUserCart(user));
      }
    }
  }, [user, dispatch]);

  return null;
}
