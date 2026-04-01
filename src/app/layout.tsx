import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Chatbot } from "@/components/chatbot";
import { ErrorBoundary } from "@/components/error-boundary";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Sustainiathon - Wildlife & Conservation Platform",
    template: "%s | Sustainiathon",
  },
  description:
    "A centralized platform for wildlife, biodiversity, and conservation projects across India. Explore sanctuaries, connect with scientists, and access conservation resources.",
  keywords: ["wildlife", "conservation", "India", "sanctuaries", "biodiversity", "sustainiathon"],
  openGraph: {
    title: "Sustainiathon - Wildlife & Conservation Platform",
    description: "Protecting India's wildlife heritage through technology.",
    type: "website",
    siteName: "Sustainiathon",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-white focus:shadow-lg">
          Skip to content
        </a>
        <Navbar />
        <main id="main-content">
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
        <Footer />
        <Chatbot />
      </body>
    </html>
  );
}
