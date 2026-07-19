import axios from "axios";
import { useAuthStore } from "@/store/authStore";

function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

function convertKeys(
  obj: any,
  converter: (s: string) => string
): any {
  if (Array.isArray(obj)) {
    return obj.map((item) => convertKeys(item, converter));
  }

  if (
    obj !== null &&
    typeof obj === "object" &&
    !(obj instanceof Date)
  ) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        converter(key),
        convertKeys(value, converter),
      ])
    );
  }

  return obj;
}


const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://stacksentry-backend.onrender.com/api/v1",

  headers: {
    "Content-Type": "application/json",
  },

  timeout: 20000,
});


api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (
    config.data &&
    typeof config.data === "object" &&
    !(config.data instanceof FormData)
  ) {
    config.data = convertKeys(
      config.data,
      toSnakeCase
    );
  }

  return config;
});

api.interceptors.response.use(

  (response) => {

    if (
      response.data &&
      typeof response.data === "object"
    ) {
      response.data = convertKeys(
        response.data,
        toCamelCase
      );
    }

    return response;
  },


  async (error) => {

    const originalRequest = error.config;


    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {

      originalRequest._retry = true;


      const refreshToken =
        useAuthStore.getState().refreshToken;


      if (refreshToken) {

        try {

          const res = await axios.post(
            `${import.meta.env.VITE_API_URL || "https://stacksentry-backend.onrender.com/api/v1"}/auth/refresh`,
            null,
            {
              params: {
                refresh_token: refreshToken,
              },
            }
          );


          const data = convertKeys(
            res.data,
            toCamelCase
          );


          useAuthStore
            .getState()
            .login(
              data.user,
              data.accessToken,
              data.refreshToken
            );


          originalRequest.headers.Authorization =
            `Bearer ${data.accessToken}`;


          return api(originalRequest);


        } catch {

          useAuthStore.getState().logout();
          window.location.href = "/auth/login";

        }

      } else {

        useAuthStore.getState().logout();
        window.location.href = "/auth/login";

      }

    }


    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      "An unexpected error occurred";


    return Promise.reject(
      new Error(message)
    );
  }
);


export default api;