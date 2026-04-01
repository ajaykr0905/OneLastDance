import type { Metadata } from "next";
import { ExploreClient } from "./explore-client";

export const metadata: Metadata = {
  title: "Explore Sanctuaries",
  description: "Browse wildlife sanctuaries, national parks, and tiger reserves across 25 Indian states.",
};

export default function ExplorePage() {
  return <ExploreClient />;
}
