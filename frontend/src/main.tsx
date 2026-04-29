import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./global.css";
import { AuthProvider } from "./context/AuthProvider.tsx";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/index.ts";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster
        position="top-center"
        toastOptions={{
          // Durée par défaut
          duration: 4000,

          // Success
          success: {
            duration: 3000,
            style: {
              background: "#fefefe",
              color: "#3e1013",
              border: "2px solid #7a282a",
            },
            iconTheme: {
              primary: "#7a282a",
              secondary: "#f3f2df",
            },
          },

          // Error
          error: {
            duration: 5000,
            style: {
              background: "#fefefe",
              color: "#3e1013",
              border: "2px solid #e3131c",
            },
            iconTheme: {
              primary: "#e3131c",
              secondary: "#fff",
            },
          },
        }}
      />
    </AuthProvider>
  </StrictMode>,
);
