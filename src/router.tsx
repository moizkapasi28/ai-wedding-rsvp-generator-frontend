import { ThemeProvider } from "@/components/ThemeProvider";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, type FC } from "react";
import {
  createBrowserRouter,
  Outlet,
  redirect,
  RouterProvider,
} from "react-router-dom";
import { authService } from "./api/auth.service";
import Loader from "./components/ui/loader";
import { useAuth } from "./hooks/use-auth";
import { tokenStore } from "./store/token";

const RootLayout = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Outlet />
    </ThemeProvider>
  );
};

const Setup = () => {
  const { isLoggedIn } = useAuth();
  const routers = useMemo(
    () =>
      createBrowserRouter([
        {
          element: <RootLayout />,
          children: [
            {
              path: "/signin",

              lazy: async () => ({
                Component: (await import("./pages/Login")).default,
              }),
              loader: () => {
                if (isLoggedIn) {
                  return redirect("/");
                } else {
                  return null;
                }
              },
            },
            {
              path: "/signup",
              lazy: async () => ({
                Component: (await import("@/pages/Signup")).default,
              }),
            },
            {
              path: "/verify-email",
              lazy: async () => ({
                Component: (await import("@/pages/VerifyEmail")).default,
              }),
            },
            {
              path: "/forgot-password",
              lazy: async () => ({
                Component: (await import("@/pages/ForgotPasswod")).default,
              }),
            },
            {
              path: "/reset-password",
              lazy: async () => ({
                Component: (await import("@/pages/ResetPassword")).default,
              }),
            },
            {
              path: "/verification-pending",
              lazy: async () => ({
                Component: (await import("@/pages/EmailVerificationPending"))
                  .default,
              }),
            },
            {
              path: "/",
              lazy: async () => {
                const AppShell = await import("@/layout/AppLayout");
                return { Component: AppShell.default };
              },
              loader: () => {
                if (!isLoggedIn) {
                  return redirect("/signin");
                } else {
                  return null;
                }
              },
              children: [
                {
                  path: "/",
                  index: true,
                  lazy: async () => ({
                    Component: (await import("@/pages/AllWeddings")).default,
                  }),
                },
                {
                  lazy: async () => {
                    const RequireWedding = await import("@/layout/RequireWedding");
                    return { Component: RequireWedding.default };
                  },
                  children: [
                    {
                      path: "/wedding-dashboard",
                      index: false,
                      lazy: async () => ({
                        Component: (await import("@/pages/Dashboard")).default,
                      }),
                    },
                    {
                      path: "guests",
                      index: false,
                      lazy: async () => ({
                        Component: (await import("@/pages/Guests")).default,
                      }),
                    },
                    {
                      path: "guests/:id",
                      index: false,
                      lazy: async () => ({
                        Component: (await import("@/pages/GuestDetails")).default,
                      }),
                    },
                    {
                      path: "events",
                      index: false,
                      lazy: async () => ({
                        Component: (await import("@/pages/Events")).default,
                      }),
                    },
                    {
                      path: "page-settings",
                      index: false,
                      lazy: async () => ({
                        Component: (await import("@/pages/PageSettings")).default,
                      }),
                    },
                    {
                      path: "ai-invite-card",
                      index: false,
                      lazy: async () => ({
                        Component: (await import("@/pages/AIInviteCard")).default,
                      }),
                    },
                    {
                      path: "guest-preview",
                      index: false,
                      lazy: async () => ({
                        Component: (await import("@/pages/GuestPreview")).default,
                      }),
                    },
                  ]
                }
              ],
            },
          ],
        },
      ]),
    [isLoggedIn],
  );

  return <RouterProvider router={routers} />;
};

const Router: FC = () => {
  const { login, logout, isLoggedIn, refreshToken } = useAuth();

  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };
    window.addEventListener("unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("unauthorized", handleUnauthorized);
    };
  }, [logout]);

  const { isLoading } = useQuery<Promise<boolean>>({
    queryKey: ["user", isLoggedIn],
    queryFn: async () => {
      if (isLoggedIn) {
        try {
          const {
            data: { access, refresh },
          } = await authService.getAccessToken(refreshToken);

          tokenStore.setAccessToken(access);
          //   const user = await authService.getUserInfo();
          const user = {
            id: 123,
            username: "moizkapasi",
            email: "moizkapasi90@gmail.com",
          };
          login(user, refresh.token);
        } catch {
          logout();
          return true;
        }
      }
      return true;
    },
  });
  if (isLoading) {
    return <Loader />;
  }

  return <Setup />;
};

export default Router;
