import { describe, it, expect } from "vitest";
import { buildContext } from "@/lib/rag";
import { assessDiabetesRisk } from "@/data/diabetes";
import { suggestDrug } from "@/data/drugs";

describe("diabetes risk assessment", () => {
  it("returns low risk for normal values", () => {
    const r = assessDiabetesRisk({ glucose: 90, bmi: 22, age: 25 });
    expect(r.level).toBe("low");
    expect(r.factors).toHaveLength(0);
  });

  it("returns high or very-high risk for elevated values", () => {
    const r = assessDiabetesRisk({ glucose: 160, bmi: 36, age: 55 });
    expect(["high", "very-high"]).toContain(r.level);
    expect(r.factors.length).toBeGreaterThan(2);
  });

  it("includes family history as risk factor", () => {
    const r = assessDiabetesRisk({ glucose: 130, familyHistory: true });
    expect(r.factors.some((f) => f.toLowerCase().includes("genetic") || f.toLowerCase().includes("family"))).toBe(true);
  });
});

describe("drug recommendation", () => {
  it("recommends drugY for high Na-to-K", () => {
    const r = suggestDrug({ age: 40, naToK: 18, bp: "NORMAL", cholesterol: "NORMAL" });
    expect(r.drug).toBe("drugY");
  });

  it("recommends drugA for older + high BP + high cholesterol", () => {
    const r = suggestDrug({ age: 55, naToK: 10, bp: "HIGH", cholesterol: "HIGH" });
    expect(r.drug).toBe("drugA");
  });

  it("recommends drugX for low BP + low Na-to-K", () => {
    const r = suggestDrug({ age: 30, naToK: 10, bp: "LOW", cholesterol: "NORMAL" });
    expect(r.drug).toBe("drugX");
  });
});

describe("RAG context builder", () => {
  it("detects diabetes topic", () => {
    const c = buildContext("Tell me about diabetes risk factors");
    expect(c.topic).toBe("diabetes");
    expect(c.context).toContain("Pima");
  });

  it("detects drug topic", () => {
    const c = buildContext("What drugs are available?");
    expect(c.topic).toBe("drugs");
    expect(c.context).toContain("drugY");
  });

  it("performs risk assessment when numbers present", () => {
    const c = buildContext("Assess risk: glucose 160, BMI 34, age 52");
    expect(c.topic).toBe("risk-assessment");
    expect(c.context).toContain("Risk Level");
  });

  it("performs drug recommendation with Na-to-K", () => {
    const c = buildContext("Recommend drug for age 55, Na-to-K 18, high BP");
    expect(c.topic).toBe("drug-recommendation");
    expect(c.context).toContain("drugY");
  });

  it("returns general for unrelated query", () => {
    const c = buildContext("Hello, what can you do?");
    expect(c.topic).toBe("general");
    expect(c.context).toContain("Capabilities");
  });

  it("extracts glucose from natural text", () => {
    const c = buildContext("My glucose is 180, check my risk");
    expect(c.topic).toBe("risk-assessment");
    expect(c.context).toContain("180");
  });
});
