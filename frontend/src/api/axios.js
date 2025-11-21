import axios from "axios";

// --------------------------------------------------
// Base configuration
// --------------------------------------------------
axios.defaults.baseURL = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000")
  .replace(/\/$/, "");

axios.defaults.withCredentials = true;

axios.defaults.headers.common["Accept"] = "application/json";
axios.defaults.headers.common["Content-Type"] = "application/json";

// --------------------------------------------------
// Fetch CSRF Token (fix : utiliser axios au lieu de fetch !)
// --------------------------------------------------
export const fetchCsrfCookie = async () => {
  try {
    await axios.get("/sanctum/csrf-cookie", { withCredentials: true });
    return true;
  } catch (error) {
    console.error("CSRF error:", error);
    return false;
  }
};

// --------------------------------------------------
// XSRF configuration
// --------------------------------------------------
axios.defaults.xsrfCookieName = "XSRF-TOKEN";
axios.defaults.xsrfHeaderName = "X-XSRF-TOKEN";

// --------------------------------------------------
// Interceptor : ajouter automatiquement le token
// --------------------------------------------------
axios.interceptors.request.use((config) => {
  const cookies = document.cookie.split("; ");
  const tokenCookie = cookies.find((c) => c.startsWith("XSRF-TOKEN="));

  if (tokenCookie) {
    config.headers["X-XSRF-TOKEN"] = decodeURIComponent(
      tokenCookie.split("=")[1]
    );
  }

  return config;
});

// --------------------------------------------------
// Export global axios instance
// --------------------------------------------------
export default axios;
