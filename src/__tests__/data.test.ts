import { describe, it, expect } from "vitest";
import { statesData, totalSanctuaries, totalStates } from "@/data/sanctuaries";
import { scientists } from "@/data/scientists";
import { resourceCategories } from "@/data/resources";

describe("sanctuaries data", () => {
  it("has at least 20 states", () => {
    expect(statesData.length).toBeGreaterThanOrEqual(20);
  });

  it("totalStates matches statesData length", () => {
    expect(totalStates).toBe(statesData.length);
  });

  it("totalSanctuaries matches sum of all sanctuaries", () => {
    const sum = statesData.reduce((acc, s) => acc + s.sanctuaries.length, 0);
    expect(totalSanctuaries).toBe(sum);
  });

  it("every state has a non-empty name", () => {
    for (const state of statesData) {
      expect(state.state.trim().length).toBeGreaterThan(0);
    }
  });

  it("every sanctuary has a name and valid type", () => {
    const validTypes = ["NP", "WLS", "TR", "BS", "CR", "Other"];
    for (const state of statesData) {
      for (const s of state.sanctuaries) {
        expect(s.name.trim().length).toBeGreaterThan(0);
        expect(validTypes).toContain(s.type);
      }
    }
  });

  it("wikipedia URLs are https or null", () => {
    for (const state of statesData) {
      for (const s of state.sanctuaries) {
        if (s.wikipediaUrl !== null) {
          expect(s.wikipediaUrl).toMatch(/^https:\/\//);
        }
      }
    }
  });

  it("has no duplicate state names", () => {
    const names = statesData.map((s) => s.state);
    expect(new Set(names).size).toBe(names.length);
  });
});

describe("scientists data", () => {
  it("has at least 10 scientists", () => {
    expect(scientists.length).toBeGreaterThanOrEqual(10);
  });

  it("every scientist has required fields", () => {
    for (const s of scientists) {
      expect(s.name.trim().length).toBeGreaterThan(0);
      expect(s.state.trim().length).toBeGreaterThan(0);
      expect(s.wikipediaUrl).toMatch(/^https:\/\/en\.wikipedia\.org\//);
    }
  });

  it("has no duplicate scientist names", () => {
    const names = scientists.map((s) => s.name);
    expect(new Set(names).size).toBe(names.length);
  });
});

describe("resources data", () => {
  it("has at least 3 categories", () => {
    expect(resourceCategories.length).toBeGreaterThanOrEqual(3);
  });

  it("every resource has title, url, description", () => {
    for (const cat of resourceCategories) {
      expect(cat.category.trim().length).toBeGreaterThan(0);
      for (const res of cat.resources) {
        expect(res.title.trim().length).toBeGreaterThan(0);
        expect(res.url).toMatch(/^https?:\/\//);
        expect(res.description.trim().length).toBeGreaterThan(0);
      }
    }
  });
});
