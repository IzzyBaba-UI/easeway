"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ScrollToTop from "../src/components/ScrollToTop";
import { ToastProvider } from "../src/contexts/ToastContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <ScrollToTop />
        {children}
      </ToastProvider>
    </QueryClientProvider>
  );
}
