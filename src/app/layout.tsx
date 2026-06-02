import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/Providers";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: "مكتب أبو شعالة للتحويلات المالية",
  description: "أفضل أسعار صرف العملات الأجنبية في مصراتة - ليبيا",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.variable} font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
