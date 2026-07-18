import toast from "react-hot-toast";

export const showToast = {
  success: (message: string) =>
    toast.success(message, {
      style: {
        borderRadius: "12px",
        background: "#0fa953",
        color: "#fff",
        fontSize: "14px",
        fontWeight: 500,
        boxShadow: "0 8px 24px -4px rgba(15, 169, 83, 0.3)",
      },
      iconTheme: { primary: "#fff", secondary: "#0fa953" },
    }),
  error: (message: string) =>
    toast.error(message, {
      style: {
        borderRadius: "12px",
        background: "#c53030",
        color: "#fff",
        fontSize: "14px",
        fontWeight: 500,
        boxShadow: "0 8px 24px -4px rgba(197, 48, 48, 0.3)",
      },
      iconTheme: { primary: "#fff", secondary: "#c53030" },
    }),
  info: (message: string) =>
    toast(message, {
      icon: null,
      style: {
        borderRadius: "12px",
        fontSize: "14px",
        fontWeight: 500,
      },
    }),
  loading: (message: string) =>
    toast.loading(message, {
      style: {
        borderRadius: "12px",
        fontSize: "14px",
        fontWeight: 500,
      },
    }),
};
