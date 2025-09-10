// store/slices/modalSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// This is the ScreenType you already have defined
type ScreenType =
  | "login"
  | "password"
  | "forgot"
  | "otp"
  | "signup"
  | "success"
  | "reset-password";

interface ModalState {
  isOpen: boolean;
  screen: ScreenType;
}

const initialState: ModalState = {
  isOpen: false,
  screen: "login", // Default screen when opening
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    // Action to open the modal, optionally specifying which screen to show
    openModal: (state, action: PayloadAction<ScreenType | undefined>) => {
      state.isOpen = true;
      if (action.payload) {
        state.screen = action.payload;
      }
    },
    // Action to close the modal
    closeModal: (state) => {
      state.isOpen = false;
      // Optional: Reset screen to default on close
      state.screen = "login";
    },
    // Action to change the screen while the modal is open (e.g., from login to forgot password)
    setModalScreen: (state, action: PayloadAction<ScreenType>) => {
      state.screen = action.payload;
    },
  },
});

export const { openModal, closeModal, setModalScreen } = modalSlice.actions;

export default modalSlice.reducer;