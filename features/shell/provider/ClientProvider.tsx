"use client";
import type { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface ClientLayoutProps {}

export const ClientProvider = ({
  children,
}: PropsWithChildren<ClientLayoutProps>) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
