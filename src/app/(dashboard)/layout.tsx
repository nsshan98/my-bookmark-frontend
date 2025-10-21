// app/(dashboard)/layout.tsx
import { ReactNode } from "react";
import { SidebarProvider, SidebarInset } from "@/components/atoms/sidebar";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { ThemeProvider } from "@/lib/theme-provider";
import { Toaster } from "@/components/atoms/sonner";
import { DashbaordHeader } from "@/components/organisms/dashboard-header";
import { AppSidebar } from "@/components/organisms/app-sidebar";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();
  if (!session) {
    return redirect("/login");
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider session={session}>
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset>
                <DashbaordHeader />

                {/* Page content */}
                <main className="flex-1 p-4">{children}</main>
              </SidebarInset>
            </SidebarProvider>

            <Toaster />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
