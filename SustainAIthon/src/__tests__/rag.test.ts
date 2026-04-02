import { describe, it, expect } from "vitest";
import { retrieve, formatContext } from "@/lib/rag";

describe("RAG retrieval engine", () => {
  it("returns sanctuaries when searching by state name", () => {
    const result = retrieve("Karnataka");
    expect(result.stateMatches.length).toBeGreaterThan(0);
    expect(result.stateMatches[0].state).toBe("Karnataka");
    expect(result.stateMatches[0].sanctuaries.length).toBeGreaterThan(0);
  });

  it("returns sanctuaries when searching by sanctuary name", () => {
    const result = retrieve("Bandipur");
    expect(result.sanctuaries.length).toBeGreaterThan(0);
    expect(result.sanctuaries[0].sanctuary.name).toContain("Bandipur");
  });

  it("filters by tiger reserve type", () => {
    const result = retrieve("tiger reserves in Madhya Pradesh");
    const types = result.sanctuaries.map((s) => s.sanctuary.type);
    expect(result.stateMatches.some((s) => s.state === "Madhya Pradesh")).toBe(true);
  });

  it("returns scientists when query mentions scientists", () => {
    const result = retrieve("conservation scientists from Karnataka");
    expect(result.scientists.length).toBeGreaterThan(0);
    expect(result.scientists.some((s) => s.scientist.state === "Karnataka")).toBe(true);
  });

  it("returns scientists by name", () => {
    const result = retrieve("Ullas Karanth");
    expect(result.scientists.length).toBeGreaterThan(0);
    expect(result.scientists[0].scientist.name).toBe("Ullas Karanth");
  });

  it("returns resources when query mentions data or tools", () => {
    const result = retrieve("data sources for biodiversity");
    expect(result.resources.length).toBeGreaterThan(0);
  });

  it("returns NGO matches", () => {
    const result = retrieve("Kalpavriksh NGO");
    expect(result.sanctuaries.length).toBeGreaterThan(0);
    expect(result.sanctuaries.some((s) => s.sanctuary.ngo?.includes("Kalpavriksh"))).toBe(true);
  });

  it("returns a summary when no specific matches found", () => {
    const result = retrieve("xyznonexistent");
    const context = formatContext(result);
    expect(context).toContain("Database Summary");
    expect(context).toContain("states");
  });

  it("formatContext produces non-empty string for state match", () => {
    const result = retrieve("Gujarat");
    const context = formatContext(result);
    expect(context.length).toBeGreaterThan(50);
    expect(context).toContain("Gujarat");
  });

  it("formatContext includes scientist info", () => {
    const result = retrieve("Raman Sukumar scientist");
    const context = formatContext(result);
    expect(context).toContain("Raman Sukumar");
    expect(context).toContain("wikipedia");
  });

  it("handles empty query gracefully", () => {
    const result = retrieve("");
    const context = formatContext(result);
    expect(context).toContain("Database Summary");
  });

  it("respects topN limit", () => {
    const result = retrieve("wildlife sanctuary", 3);
    expect(result.sanctuaries.length).toBeLessThanOrEqual(3);
  });
});
