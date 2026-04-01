import type { Metadata } from "next";
import { ResourcesClient } from "./resources-client";

export const metadata: Metadata = {
  title: "Resources",
  description: "Curated data sources, open-source conservation tools, and best practices for wildlife protection.",
};

export default function ResourcesPage() {
  return <ResourcesClient />;
}
