import type { Metadata } from "next";
import { ScientistsClient } from "./scientists-client";

export const metadata: Metadata = {
  title: "Conservation Scientists",
  description: "Discover 20 leading conservationists and researchers driving wildlife protection across India.",
};

export default function ScientistsPage() {
  return <ScientistsClient />;
}
