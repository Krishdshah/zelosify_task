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
  async (error) => {
    // On 401 Unauthorized (expired/invalid token), force-clear httpOnly cookies via backend and redirect
    if (error.response?.status === 401 && typeof window !== "undefined" && !isRedirectingToLogin) {
      isRedirectingToLogin = true;

      try {
        // Call the backend force-logout endpoint to clear httpOnly cookies
        // Use raw axios (not axiosInstance) to avoid triggering this interceptor recursively
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/force-logout`,
          {},
          { withCredentials: true }
        );
      } catch (forceLogoutError) {
        // If even force-logout fails, still proceed with redirect
        console.error("Force logout request failed:", forceLogoutError);
      }

      // Clear any non-httpOnly cookies and localStorage
      document.cookie = "role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      localStorage.removeItem("zelosify_user");

      // Hard redirect to login
      window.location.href = "/login";

      // Reset after redirect initiated (small delay)
      setTimeout(() => { isRedirectingToLogin = false; }, 5000);
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
