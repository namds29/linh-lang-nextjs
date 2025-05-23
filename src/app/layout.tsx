"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/sidebar/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { usePathname, useRouter } from "next/navigation";
import LoginPage from "./login/page";
import { useEffect } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathName = usePathname();
  const router = useRouter();
  useEffect(() => {
    // Check for tokens in localStorage on component mount
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!accessToken && !refreshToken && pathName !== "/login") {
      // If no tokens and not already on the login page, redirect
      router.push("/login");
    }
  }, [router, pathName])
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {pathName === "/login" ? <LoginPage /> : (
          <div className="container-fluid">
            <Header />
            <SidebarProvider>
              <div className="w-full flex">
                <AppSidebar />
                <section
                  id="main-content"
                  className="w-full pl-8 mt-[60px] bg-coolgray"
                >
                  <div className="max-h-[calc(100vh-60px)] overflow-auto pt-4 pr-4">
                    {children}
                  </div>
                </section>
              </div>
            </SidebarProvider>
          </div>
        )}

        <Toaster />
      </body>
    </html>
  );
}
