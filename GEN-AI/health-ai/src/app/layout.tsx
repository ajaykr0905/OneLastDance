import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Navbar } from "@/components/navbar";
import { Chatbot } from "@/components/chatbot";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "MedInsight AI - Healthcare Analytics Agent", template: "%s | MedInsight AI" },
  description: "AI-powered healthcare analytics platform for diabetes risk assessment and personalized drug recommendations. Built for the GEN-AI Hackathon.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        <Navbar />
        <main>{children}</main>
        <Chatbot />
      </body>
    </html>
  );
}
