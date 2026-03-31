import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Chatbot } from "@/components/chatbot";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sustainiathon - Wildlife & Conservation Platform",
  description:
    "A centralized platform for wildlife, biodiversity, and conservation projects across India. Explore sanctuaries, connect with scientists, and access conservation resources.",
  keywords: ["wildlife", "conservation", "India", "sanctuaries", "biodiversity", "sustainiathon"],
  openGraph: {
    title: "Sustainiathon - Wildlife & Conservation Platform",
    description: "Protecting India's wildlife heritage through technology.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Chatbot />
      </body>
    </html>
  );
}
