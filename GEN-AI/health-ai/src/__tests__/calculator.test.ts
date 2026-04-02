import { describe, it, expect } from "vitest";
import { assessDiabetesRiskFull, getBmiCategory, type FullAssessmentInput } from "@/data/diabetes";
import { suggestDrug } from "@/data/drugs";

const baseInput: FullAssessmentInput = {
  age: 30,
  glucose: 100,
  bloodPressure: 70,
  bmi: 24,
  familyHistory: false,
};

describe("assessDiabetesRiskFull", () => {
  it("returns low risk for healthy baseline values", () => {
    const r = assessDiabetesRiskFull(baseInput);
    expect(r.level).toBe("low");
    expect(r.score).toBeLessThan(20);
    expect(r.factors).toHaveLength(0);
    expect(r.comparisons.length).toBeGreaterThanOrEqual(4);
  });

  it("returns very-high risk for extreme values", () => {
    const r = assessDiabetesRiskFull({
      age: 65,
      glucose: 180,
      bloodPressure: 110,
      bmi: 42,
      insulin: 200,
      skinThickness: 50,
      pregnancies: 8,
      familyHistory: true,
    });
    expect(r.level).toBe("very-high");
    expect(r.score).toBeGreaterThanOrEqual(60);
    expect(r.factors.length).toBeGreaterThan(5);
  });

  it("scores glucose correctly at different thresholds", () => {
    const low = assessDiabetesRiskFull({ ...baseInput, glucose: 90 });
    const mid = assessDiabetesRiskFull({ ...baseInput, glucose: 130 });
    const high = assessDiabetesRiskFull({ ...baseInput, glucose: 160 });
    expect(low.score).toBeLessThan(mid.score);
    expect(mid.score).toBeLessThan(high.score);
  });

  it("adds family history factor", () => {
    const withoutFH = assessDiabetesRiskFull({ ...baseInput, familyHistory: false });
    const withFH = assessDiabetesRiskFull({ ...baseInput, familyHistory: true });
    expect(withFH.score).toBeGreaterThan(withoutFH.score);
    expect(withFH.factors.some((f) => f.name === "Family History")).toBe(true);
  });

  it("includes comparisons with dataset means", () => {
    const r = assessDiabetesRiskFull(baseInput);
    const glucoseComp = r.comparisons.find((c) => c.metric.includes("Glucose"));
    expect(glucoseComp).toBeDefined();
    expect(glucoseComp!.datasetMean).toBe(120.89);
  });

  it("caps score at 100", () => {
    const r = assessDiabetesRiskFull({
      age: 80,
      glucose: 250,
      bloodPressure: 130,
      bmi: 50,
      insulin: 500,
      skinThickness: 80,
      pregnancies: 15,
      familyHistory: true,
    });
    expect(r.score).toBeLessThanOrEqual(100);
  });

  it("provides appropriate recommendation per level", () => {
    const low = assessDiabetesRiskFull(baseInput);
    expect(low.recommendation).toContain("favorable");

    const high = assessDiabetesRiskFull({ ...baseInput, glucose: 170, bmi: 38, age: 55 });
    expect(high.recommendation.toLowerCase()).toContain("consult");
  });

  it("includes insulin comparison when provided", () => {
    const r = assessDiabetesRiskFull({ ...baseInput, insulin: 90 });
    expect(r.comparisons.some((c) => c.metric.includes("Insulin"))).toBe(true);
  });
});

describe("getBmiCategory", () => {
  it("classifies underweight", () => {
    expect(getBmiCategory(16).label).toBe("Underweight");
  });

  it("classifies normal weight", () => {
    expect(getBmiCategory(22).label).toBe("Normal");
  });

  it("classifies overweight", () => {
    expect(getBmiCategory(27).label).toBe("Overweight");
  });

  it("classifies obese categories", () => {
    expect(getBmiCategory(32).label).toBe("Obese I");
    expect(getBmiCategory(37).label).toBe("Obese II");
    expect(getBmiCategory(45).label).toBe("Obese III");
  });
});

describe("suggestDrug in calculator context", () => {
  it("recommends drugY for high Na-to-K", () => {
    const r = suggestDrug({ age: 40, naToK: 20, bp: "NORMAL", cholesterol: "NORMAL" });
    expect(r.drug).toBe("drugY");
    expect(r.confidence).toBe("High");
  });

  it("recommends drugC for young + high BP", () => {
    const r = suggestDrug({ age: 35, naToK: 10, bp: "HIGH", cholesterol: "NORMAL" });
    expect(r.drug).toBe("drugC");
  });

  it("differentiates drugA vs drugB by cholesterol", () => {
    const a = suggestDrug({ age: 60, naToK: 10, bp: "HIGH", cholesterol: "HIGH" });
    const b = suggestDrug({ age: 60, naToK: 10, bp: "HIGH", cholesterol: "NORMAL" });
    expect(a.drug).toBe("drugA");
    expect(b.drug).toBe("drugB");
  });
});
