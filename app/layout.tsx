import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Analytics } from "@vercel/analytics/react";
import AIAgentWidget from "@/components/AIAgentWidget";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://plumbify.ai"),
  title: {
    default: "Plumbify | The AI Operating System for Plumbers",
    template: "%s | Plumbify"
  },
  description: "Automate missed calls, fill your tech's calendar, and get paid faster with Plumbify. The #1 AI-first software for plumbing businesses in 2026.",
  keywords: ["Plumbing Software", "AI Plumber Assistant", "Missed Call Text Back", "Automated Scheduling", "Tap to Pay for Plumbers"],
  authors: [{ name: "Plumbify Team" }],
  creator: "Plumbify Inc",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://plumbify.ai",
    siteName: "Plumbify",
    title: "Plumbify | The AI Operating System for Plumbers",
    description: "Scale your plumbing business with 24/7 AI automation.",
    images: [
      {
        url: "https://plumbify.ai/og-image.jpg", // Make sure to add an OG image in public folder
        width: 1200,
        height: 630,
        alt: "Plumbify AI Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Plumbify | The AI Operating System for Plumbers",
    description: "Scale your plumbing business with 24/7 AI automation.",
    creator: "@plumbify_ai",
    images: ["https://plumbify.ai/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://services.leadconnectorhq.com" />
        <link rel="dns-prefetch" href="https://services.leadconnectorhq.com" />
      </head>
      <body className={`${inter.className} bg-slate-50 text-slate-900 antialiased`}>
        <Navbar />
        {children}
        <AIAgentWidget />
        <Analytics />
      </body>
    </html>
  );
}
