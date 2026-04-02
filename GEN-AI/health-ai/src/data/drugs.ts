export interface DrugRecord {
  age: number;
  sex: "M" | "F";
  bp: "LOW" | "NORMAL" | "HIGH";
  cholesterol: "NORMAL" | "HIGH";
  naToK: number;
  drug: string;
}

export const drugStats = {
  totalRecords: 200,
  drugs: [
    { name: "drugY", count: 91, percentage: 45.5, description: "Most commonly prescribed; typically for patients with high Na/K ratios" },
    { name: "drugX", count: 54, percentage: 27.0, description: "Prescribed for younger patients with low-to-normal blood pressure" },
    { name: "drugA", count: 23, percentage: 11.5, description: "Used for older patients with high blood pressure and low Na/K" },
    { name: "drugB", count: 16, percentage: 8.0, description: "For older patients with high blood pressure and low Na/K" },
    { name: "drugC", count: 16, percentage: 8.0, description: "For middle-aged patients with normal-to-high blood pressure" },
  ],
  factors: [
    { factor: "Na-to-K Ratio", description: "Sodium to potassium ratio is the strongest predictor of drug choice. Ratio >15 strongly predicts drugY.", impact: "critical" as const },
    { factor: "Blood Pressure", description: "High BP patients are more likely to receive drugA or drugB over drugX.", impact: "high" as const },
    { factor: "Age", description: "Older patients (>50) tend to receive drugA/drugB; younger patients get drugX.", impact: "medium" as const },
    { factor: "Cholesterol", description: "High cholesterol slightly shifts prescriptions toward drugA over drugB.", impact: "low" as const },
  ],
  keyInsights: [
    "Drug Y is prescribed in 45.5% of cases, making it the most common medication.",
    "Na-to-K ratio above 15 is the single strongest predictor for drugY prescription.",
    "Age and blood pressure together determine the choice between drugA, drugB, and drugC.",
    "Sex has minimal impact on drug selection in this dataset.",
    "The decision tree for drug selection splits primarily on Na-to-K ratio, then BP, then age.",
    "DrugX is the go-to for younger patients with lower Na-to-K ratios.",
  ],
};

export function suggestDrug(input: {
  age: number;
  naToK: number;
  bp: "LOW" | "NORMAL" | "HIGH";
  cholesterol: "NORMAL" | "HIGH";
}): { drug: string; confidence: string; reasoning: string } {
  if (input.naToK > 15) {
    return { drug: "drugY", confidence: "High", reasoning: "Na-to-K ratio above 15 strongly indicates drugY." };
  }

  if (input.bp === "HIGH") {
    if (input.age >= 50) {
      if (input.cholesterol === "HIGH") {
        return { drug: "drugA", confidence: "Moderate", reasoning: "High BP + age 50+ + high cholesterol pattern matches drugA." };
      }
      return { drug: "drugB", confidence: "Moderate", reasoning: "High BP + age 50+ + normal cholesterol matches drugB." };
    }
    return { drug: "drugC", confidence: "Moderate", reasoning: "High BP + younger age pattern matches drugC." };
  }

  return { drug: "drugX", confidence: "Moderate", reasoning: "Low/normal BP + lower Na-to-K ratio matches drugX." };
}
