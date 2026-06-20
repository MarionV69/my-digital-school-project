import axios from "axios";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

let isRedirecting = false; // Flag to prevent multiple redirects

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor : add token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor : global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      toast.error("Impossible de contacter le serveur.", {
        id: "network-error",
      });
      return Promise.reject(error);
    }

    const status = error.response.status;
    switch (status) {
      case 401: {
        if (!window.location.pathname.includes("/login")) {
          const token = localStorage.getItem("accessToken");
          if (token) {
            // Session expired
            if (!isRedirecting) {
              isRedirecting = true;
              toast.error("Votre session a expiré.", { id: "session-expired" });
              localStorage.removeItem("accessToken");
              window.location.replace("/login");
            }
          } else {
            // No token + 401
            window.location.replace("/");
          }
        }
        break;
      }
      case 403: {
        toast.error("Vous n'avez pas la permission d'effectuer cette action.", {
          id: "forbidden",
        });
        break;
      }
      case 500: {
        toast.error("Erreur serveur. Veuillez réessayer plus tard.", {
          id: "server-error",
        });
        break;
      }
      default:
        console.error("Unhandled API error:", error);
    }
    return Promise.reject(error);
  },
);

export default api;
