// src/utils/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
});

// Add request interceptor for logging
axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

// Track if we're already redirecting to avoid multiple redirects
let isRedirectingToLogin = false;

// Add response interceptor — auto-logout on 401
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // On 401 Unauthorized (expired/invalid token), clear session and redirect to login
    if (error.response?.status === 401 && !isRedirectingToLogin) {
      isRedirectingToLogin = true;

      // Clear all auth cookies
      document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      localStorage.removeItem("zelosify_user");

      // Hard redirect to login so middleware picks up the cleared cookies
      window.location.href = "/login";

      // Reset after redirect initiated (small delay)
      setTimeout(() => { isRedirectingToLogin = false; }, 3000);
    }

    if (error.response) {
      console.error(
        `API Error [${error.response.status}]: ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
        error.response.data
      );
    } else {
      console.error(`API Error: ${error.message}`);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
