import "@/index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Router from "./router";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data remains fresh for 5 minutes
      gcTime: 1000 * 60 * 10, // Unused data remains in cache for 10 minutes
      retry: 1, // Retry failed requests once before failing
      refetchOnWindowFocus: false, // Turn off automatic refetching on window focus
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster position="top-center" reverseOrder={false} />
    </QueryClientProvider>
  </StrictMode>,
);
