import { toast, type ToastOptions } from "react-toastify";

// Default options that can be applied to all toasts
const defaultOptions: ToastOptions = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "dark",
};

export const toastSuccess = (message: string) => {
  toast.success(message, defaultOptions);
};

export const toastError = (message: string) => {
  toast.error(message, defaultOptions);
};

export const toastWarning = (message: string) => {
  toast.warn(message, defaultOptions);
};

export const toastInfo = (message: string) => {
  toast.info(message, defaultOptions);
};