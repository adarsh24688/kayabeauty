"use client";

import { useEffect, useRef } from "react";
import { openModal } from "@/store/slices/modalSlice"; // Make sure this path is correct
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hook";

// A small utility hook to get the previous value of a prop or state.
function usePrevious(value: boolean) {
  const ref = useRef<boolean>(undefined);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Select the necessary state from both auth and modal slices
  const { user, isInitialized, isLoadingProfile } = useAppSelector(
    (state) => state.auth
  );
  const { isOpen: isModalOpen } = useAppSelector((state) => state.modal);

  const isAuthenticated = !!user;
  const isAuthenticating = !isInitialized || isLoadingProfile;

  // We use our custom hook to track the modal's previous state.
  const wasModalOpen = usePrevious(isModalOpen);

  useEffect(() => {
    // Don't run any logic while we are still checking the user's auth status.
    if (isAuthenticating) {
      return;
    }

    // This block runs only after we know the user is logged out.
    if (!isAuthenticated) {
      // SCENARIO 1: The modal was open, but is now closed.
      // This means the user clicked the 'close' button without logging in.
      if (wasModalOpen && !isModalOpen) {
        router.push("/"); // Redirect to the homepage.
      }

      // SCENARIO 2: The modal is not open.
      // This means the user just landed on the protected page. Open the modal for them.
      else if (!isModalOpen) {
        dispatch(openModal("login"));
      }
    }
  }, [
    isAuthenticated,
    isAuthenticating,
    isModalOpen,
    wasModalOpen,
    dispatch,
    router,
  ]);

  // --- RENDER LOGIC ---

  // If the user is authenticated and we are done with the initial loading,
  // we can safely render the actual page content.
  if (isAuthenticated && !isAuthenticating) {
    return <>{children}</>;
  }

  // In all other cases (either loading, or not authenticated), we want to
  // block the UI. We render a full-screen, fixed-position overlay that will
  // cover the Header and Footer from your main layout.
  // The LoginModal from your AppWrapper will appear on top of this.
  return (
    <div className="fixed inset-0 z-60 bg-black flex items-center justify-center">
      {/* We only show the spinner during the initial auth check */}
      {isAuthenticating && (
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#c59d5f]"></div>
      )}
    </div>
  );
}
