import { createBrowserRouter } from "react-router-dom";
import RegisterPage from "../pages/auth/RegisterPage";
import LoginPage from "../pages/auth/LoginPage";
import HomePage from "../pages/HomePage";
import NotFoundPage from "../pages/NotFoundPage";
import CreateEstablishmentPage from "../pages/onboarding/CreateEstablishmentPage";
import RestaurantDashboard from "../pages/restaurant/DashboardPage";
import SupplierDashboard from "../pages/supplier/DashboardPage";
// import EstablishmentRequiredRoute from "./EstablishmentRequiredRoute";
import ConversationsPage from "../pages/shared/ConversationsPage";
import { StickyNote } from "lucide-react";
import StylePage from "@/pages/StylePage";
// import ProtectedRoute from "./ProtectedRoute";
// import RestaurantRoute from "./RestaurantRoute";
// import SupplierRoute from "./SupplierRoute";

/**
 * Route Configuration
 *
 * DEV NOTE: Auth guards are temporarily disabled for faster development.
 * Remember to uncomment ProtectedRoute, RestaurantRoute, and SupplierRoute
 * before deploying to production!
 */

export const router = createBrowserRouter([
  // Public routes
  {
    path: "/",
    Component: HomePage,
  },
  {
    path: "/register",
    Component: RegisterPage,
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/style",
    Component: StylePage
  },
  // Protected routes (User must be authenticated)
  {
    // Component: ProtectedRoute, // A DECOMMENTER LORSQUE LES ROUTES RESTAURANT ET SUPPLIER SERONT EN PLACE
    children: [
      {
        path: "/onboarding/create-establishment",
        Component: CreateEstablishmentPage,
      },
      {
        // Component: EstablishmentRequiredRoute, // A DECOMMENTER LORSQUE LES ROUTES RESTAURANT ET SUPPLIER SERONT EN PLACE
        children: [
          { path: "/conversations", Component: ConversationsPage },
          // Restaurant routes (Establishment type must be RESTAURANT)
          {
            // Component: RestaurantRoute,  // A DECOMMENTER LORSQUE LES ROUTES RESTAURANTS SERONT EN PLACE
            children: [
              {
                path: "/restaurant/dashboard",
                Component: RestaurantDashboard,
              },
            ],
          },
          // Supplier routes (Establishment type must be SUPPLIER)
          {
            // Component: SupplierRoute,  // A DECOMMENTER LORSQUE LES ROUTES SUPPLIERS SERONT EN PLACE
            children: [
              {
                path: "/supplier/dashboard",
                Component: SupplierDashboard,
              },
            ],
          },
        ],
      },
    ],
  },
  // Catch-all route for 404 Not Found
  {
    path: "*",
    Component: NotFoundPage,
  },
]);
