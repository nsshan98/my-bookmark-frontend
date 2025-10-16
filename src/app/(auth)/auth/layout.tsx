import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { auth } from "@/auth";
import { Header } from "@/components/organisms/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My Bookmark",
  description: "Bookmark your favorite websites",
};

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Your Content/Components */}
        <Header />
        {children}
      </body>
    </html>
  );
}
