import { createBrowserRouter, Outlet } from "react-router-dom";

import AppLayout from "@/layout/AppLayout";
import Dashboard from "@/pages/Dashboard";
import AllWeddings from "@/pages/AllWeddings";
import Guests from "@/pages/Guests";
import Events from "@/pages/Events";
import PageSettings from "@/pages/PageSettings";
import AIInviteCard from "@/pages/AIInviteCard";
import GuestPreview from "@/pages/GuestPreview";
import Login from "@/pages/Login";
import { ThemeProvider } from "@/components/ThemeProvider";

const RootLayout = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Outlet />
    </ThemeProvider>
  );
};

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/",
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: "all-weddings",
            index: false,
            element: <AllWeddings />,
          },
          {
            path: "guests",
            index: false,
            element: <Guests />,
          },
          {
            path: "events",
            index: false,
            element: <Events />,
          },
          {
            path: "page-settings",
            index: false,
            element: <PageSettings />,
          },
          {
            path: "ai-invite-card",
            index: false,
            element: <AIInviteCard />,
          },
          {
            path: "guest-preview",
            index: false,
            element: <GuestPreview />,
          },
        ],
      },
    ],
  },
]);
