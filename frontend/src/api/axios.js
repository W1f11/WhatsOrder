import axios from "axios";


axios.defaults.baseURL = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000")
  .replace(/\/$/, "");
//Activer l envoie des cookies
axios.defaults.withCredentials = true;

axios.defaults.headers.common["Accept"] = "application/json";
axios.defaults.headers.common["Content-Type"] = "application/json";


export const fetchCsrfCookie = async () => {
  try {
    await axios.get("/sanctum/csrf-cookie", { withCredentials: true });
    return true;
  } catch (error) {
    console.error("CSRF error:", error);
    return false;
  }
};


axios.defaults.xsrfCookieName = "XSRF-TOKEN";
axios.defaults.xsrfHeaderName = "X-XSRF-TOKEN";

// Il ajoute intercepteur sur tous les requêtes 
axios.interceptors.request.use((config) => {
  const cookies = document.cookie.split("; ");
  //recherche des cookies CSRF
  const tokenCookie = cookies.find((c) => c.startsWith("XSRF-TOKEN="));
//ajout du token dans les headers
  if (tokenCookie) {
    config.headers["X-XSRF-TOKEN"] = decodeURIComponent(
      tokenCookie.split("=")[1]
    );
  }

  return config;
});


export default axios;
