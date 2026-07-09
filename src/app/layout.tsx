import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gorix.app"),
  title: {
    default: "Gorix OS | AI ভেঞ্চার অর্কেস্ট্রেটর — উদ্যোক্তাদের জন্য",
    template: "%s | Gorix OS"
  },
  description: "Gorix AI বাংলাদেশের আইন, কর ও বাজার বিশ্লেষণ করে আপনার ব্যবসার জন্য ১০-ধাপের সম্পূর্ণ রোডম্যাপ তৈরি করে দেয়।",
  openGraph: {
    title: "Gorix OS — Venture Orchestrator",
    description: "AI-powered 10-step business roadmap for Bangladeshi entrepreneurs.",
    url: "https://gorix.app",
    siteName: "Gorix OS",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    locale: "bn_BD",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="bn"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
