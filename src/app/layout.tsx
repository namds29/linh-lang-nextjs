"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/sidebar/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { usePathname } from "next/navigation";
import LoginPage from "./login/page";

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
