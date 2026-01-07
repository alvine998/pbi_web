import toast from "react-hot-toast";

// Toast notification helpers with custom styling
export const showToast = {
  success: (message: string) => {
    toast.success(message, {
      duration: 3000,
      position: "top-right",
      style: {
        background: "var(--color-success)",
        color: "#fff",
        padding: "16px",
        borderRadius: "12px",
        fontSize: "14px",
        fontWeight: "500",
      },
      iconTheme: {
        primary: "#fff",
        secondary: "var(--color-success)",
      },
    });
  },

  error: (message: string) => {
    toast.error(message, {
      duration: 4000,
      position: "top-right",
      style: {
        background: "var(--color-danger)",
        color: "#fff",
        padding: "16px",
        borderRadius: "12px",
        fontSize: "14px",
        fontWeight: "500",
      },
      iconTheme: {
        primary: "#fff",
        secondary: "var(--color-danger)",
      },
    });
  },

  info: (message: string) => {
    toast(message, {
      duration: 3000,
      position: "top-right",
      icon: "ℹ️",
      style: {
        background: "var(--color-info)",
        color: "#fff",
        padding: "16px",
        borderRadius: "12px",
        fontSize: "14px",
        fontWeight: "500",
      },
    });
  },

  warning: (message: string) => {
    toast(message, {
      duration: 3000,
      position: "top-right",
      icon: "⚠️",
      style: {
        background: "var(--color-warning)",
        color: "#fff",
        padding: "16px",
        borderRadius: "12px",
        fontSize: "14px",
        fontWeight: "500",
      },
    });
  },

  loading: (message: string) => {
    return toast.loading(message, {
      position: "top-right",
      style: {
        background: "var(--color-primary)",
        color: "#fff",
        padding: "16px",
        borderRadius: "12px",
        fontSize: "14px",
        fontWeight: "500",
      },
    });
  },

  dismiss: (toastId?: string) => {
    toast.dismiss(toastId);
  },
};
