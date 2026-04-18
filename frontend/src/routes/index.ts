import { createBrowserRouter } from "react-router-dom";
import RegisterPage from "../pages/auth/RegisterPage";
import LoginPage from "../pages/auth/LoginPage";
import HomePage from "../pages/public/HomePage";
import NotFoundPage from "../pages/NotFoundPage";
import CreateEstablishmentPage from "../pages/onboarding/CreateEstablishmentPage";
import ConversationsPage from "../pages/shared/ConversationsPage";
import StylePage from "@/pages/StylePage";
import SupplierDetailPage from "../pages/public/SupplierDetailPage";
import HowItWorksPage from "../pages/public/HowItWorksPage";
import LegalPage from "../pages/public/LegalPage";
import PrivacyPage from "../pages/public/PrivacyPage";
import TermsPage from "../pages/public/TermsPage";
import SupplierProfilePage from "../pages/onboarding/SupplierProfilePage";
import ConfirmationPage from "../pages/onboarding/ConfirmationPage";
import ProfilePage from "../pages/shared/ProfilePage";
import FavoritesPage from "../pages/restaurant/FavoritesPage";
import StatisticsPage from "../pages/supplier/StatisticsPage";
import SettingsPage from "@/pages/shared/SettingsPage";

import PublicLayout from "../layouts/PublicLayout";
import AppLayout from "../layouts/AppLayout";

// import ProtectedRoute from "./ProtectedRoute";
// import EstablishmentRequiredRoute from "./EstablishmentRequiredRoute";
// import RestaurantRoute from "./RestaurantRoute";
// import SupplierRoute from "./SupplierRoute";

/**
 * Route Configuration
 *
 * DEV NOTE: Auth guards are temporarily disabled for faster development.
 * Remember to uncomment ProtectedRoute, EstablishmentRequiredRoute, RestaurantRoute, and SupplierRoute
 * before deploying to production!
 */

export const router = createBrowserRouter([
  // Public routes with PublicLayout
  {
    Component: PublicLayout,
    children: [
      { path: "/", Component: HomePage },
      { path: "/suppliers/:id", Component: SupplierDetailPage },
      { path: "/login", Component: LoginPage },
      { path: "/register", Component: RegisterPage },
      { path: "/how-it-works", Component: HowItWorksPage },
      { path: "/legal", Component: LegalPage },
      { path: "/privacy", Component: PrivacyPage },
      { path: "/terms", Component: TermsPage },
    ],
  },

  // Style guide (dev only)
  {
    path: "/style",
    Component: StylePage,
  },

  // Protected routes (User must be authenticated)
  {
    // Component: ProtectedRoute, // A DECOMMENTER LORSQUE LES ROUTES RESTAURANT ET SUPPLIER SERONT EN PLACE
    children: [
      // Onboarding
      {
        path: "/onboarding/create-establishment",
        Component: CreateEstablishmentPage,
      },
      {
        path: "/onboarding/supplier-profile",
        Component: SupplierProfilePage,
      },
      {
        path: "/onboarding/confirmation",
        Component: ConfirmationPage,
      },

      // Establishment required routes with AppLayout
      {
        // Component: EstablishmentRequiredRoute, // A DECOMMENTER LORSQUE LES ROUTES RESTAURANT ET SUPPLIER SERONT EN PLACE
        children: [
          {
            Component: AppLayout,
            children: [
              // Shared pages
              { path: "/profile", Component: ProfilePage },
              { path: "/conversations", Component: ConversationsPage },
              { path: "/settings", Component: SettingsPage },

              // Restaurant routes (Establishment type must be RESTAURANT)
              {
                // Component: RestaurantRoute,  // A DECOMMENTER LORSQUE LES ROUTES RESTAURANTS SERONT EN PLACE
                children: [
                  { path: "/suppliers", Component: HomePage },
                  { path: "/favorites", Component: FavoritesPage },
                ],
              },

              // Supplier routes (Establishment type must be SUPPLIER)
              {
                // Component: SupplierRoute,  // A DECOMMENTER LORSQUE LES ROUTES SUPPLIERS SERONT EN PLACE
                children: [
                  { path: "/supplier/stats", Component: StatisticsPage },
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  // Catch-all route for 404 Not Found
  { path: "*", Component: NotFoundPage },
]);
