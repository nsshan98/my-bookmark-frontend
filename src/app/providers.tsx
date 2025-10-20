"use client";
import { getQueryClient } from "@/lib/get-query-client";
import { ThemeProvider } from "@/lib/theme-provider";
import { QueryClientProvider } from "@tanstack/react-query";

const Providers = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={getQueryClient()}>
        {children}
      </QueryClientProvider>
    </ThemeProvider>
  );
};
export default Providers;
