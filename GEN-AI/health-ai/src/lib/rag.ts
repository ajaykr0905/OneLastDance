import { diabetesStats, assessDiabetesRisk } from "@/data/diabetes";
import { drugStats, suggestDrug } from "@/data/drugs";

export interface HealthContext {
  topic: "diabetes" | "drugs" | "general" | "risk-assessment" | "drug-recommendation";
  context: string;
}

function detectNumbers(query: string): Record<string, number> {
  const nums: Record<string, number> = {};
  const glucoseMatch = query.match(/glucose[\s:is]*(\d+)/i);
  if (glucoseMatch) nums.glucose = parseInt(glucoseMatch[1]);
  const bmiMatch = query.match(/bmi[:\s]*(\d+\.?\d*)/i);
  if (bmiMatch) nums.bmi = parseFloat(bmiMatch[1]);
  const ageMatch = query.match(/age[:\s]*(\d+)/i) || query.match(/(\d+)\s*years?\s*old/i);
  if (ageMatch) nums.age = parseInt(ageMatch[1]);
  const bpMatch = query.match(/(?:blood\s*pressure|bp)[:\s]*(\d+)/i);
  if (bpMatch) nums.bloodPressure = parseInt(bpMatch[1]);
  const nakMatch = query.match(/(?:na.?to.?k|sodium.?potassium|na.?k)[:\s]*(\d+\.?\d*)/i);
  if (nakMatch) nums.naToK = parseFloat(nakMatch[1]);
  return nums;
}

export function buildContext(query: string): HealthContext {
  const lower = query.toLowerCase();
  const numbers = detectNumbers(query);

  const hasRiskIntent = lower.includes("risk") || lower.includes("assess") || lower.includes("check") || lower.includes("predict") || lower.includes("my glucose") || lower.includes("my bmi");
  if (hasRiskIntent && Object.keys(numbers).length > 0) {
      const result = assessDiabetesRisk({
        glucose: numbers.glucose,
        bmi: numbers.bmi,
        age: numbers.age,
        bloodPressure: numbers.bloodPressure,
        familyHistory: lower.includes("family") || lower.includes("heredit") || lower.includes("genetic"),
      });
      return {
        topic: "risk-assessment",
        context: [
          "## Risk Assessment Result",
          `- **Risk Level:** ${result.level.toUpperCase()}`,
          `- **Score:** ${result.score}/100`,
          `- **Factors:** ${result.factors.length > 0 ? result.factors.join("; ") : "No significant risk factors identified"}`,
          "",
          "## Patient Input Values",
          ...Object.entries(numbers).map(([k, v]) => `- ${k}: ${v}`),
          "",
          "## Reference Ranges",
          ...diabetesStats.features.map((f) => `- ${f.name}: mean=${f.mean}, range=${f.min}-${f.max}`),
        ].join("\n"),
      };
  }

  if (lower.includes("drug") || lower.includes("prescri") || lower.includes("medic") || lower.includes("treatment")) {
    if (numbers.naToK !== undefined || numbers.age !== undefined) {
      const bp = lower.includes("high bp") || lower.includes("high blood") ? "HIGH" as const : lower.includes("low bp") || lower.includes("low blood") ? "LOW" as const : "NORMAL" as const;
      const chol = lower.includes("high chol") ? "HIGH" as const : "NORMAL" as const;
      const result = suggestDrug({
        age: numbers.age ?? 40,
        naToK: numbers.naToK ?? 14,
        bp,
        cholesterol: chol,
      });
      return {
        topic: "drug-recommendation",
        context: [
          "## Drug Recommendation",
          `- **Suggested Drug:** ${result.drug}`,
          `- **Confidence:** ${result.confidence}`,
          `- **Reasoning:** ${result.reasoning}`,
          "",
          "## Drug Database Summary",
          ...drugStats.drugs.map((d) => `- ${d.name} (${d.percentage}%): ${d.description}`),
          "",
          "## Key Decision Factors",
          ...drugStats.factors.map((f) => `- **${f.factor}** [${f.impact}]: ${f.description}`),
        ].join("\n"),
      };
    }

    return {
      topic: "drugs",
      context: [
        "## Drug Prescription Dataset (200 records)",
        ...drugStats.drugs.map((d) => `- **${d.name}** (${d.count} cases, ${d.percentage}%): ${d.description}`),
        "",
        "## Decision Factors",
        ...drugStats.factors.map((f) => `- **${f.factor}** [${f.impact}]: ${f.description}`),
        "",
        "## Key Insights",
        ...drugStats.keyInsights.map((i) => `- ${i}`),
      ].join("\n"),
    };
  }

  if (lower.includes("diabet") || lower.includes("glucose") || lower.includes("bmi") || lower.includes("insulin") || lower.includes("blood sugar")) {
    return {
      topic: "diabetes",
      context: [
        `## Pima Indians Diabetes Dataset (${diabetesStats.totalRecords} records)`,
        `- Positive outcomes: ${diabetesStats.positiveOutcome} (${diabetesStats.prevalenceRate}%)`,
        `- Negative outcomes: ${diabetesStats.negativeOutcome}`,
        "",
        "## Feature Statistics",
        ...diabetesStats.features.map((f) => `- **${f.name}**: ${f.description} (mean=${f.mean}, std=${f.std}, range=${f.min}-${f.max})`),
        "",
        "## Age Distribution & Risk",
        ...diabetesStats.ageDistribution.map((a) => `- ${a.range}: ${a.count} patients, ${a.diabetic} diabetic (${a.rate}%)`),
        "",
        "## Risk Factors",
        ...diabetesStats.riskFactors.map((r) => `- **${r.factor}** [${r.impact}]: ${r.description}`),
        "",
        "## Key Insights",
        ...diabetesStats.keyInsights.map((i) => `- ${i}`),
      ].join("\n"),
    };
  }

  return {
    topic: "general",
    context: [
      "## Available Healthcare Datasets",
      "",
      `### Diabetes Dataset (${diabetesStats.totalRecords} records)`,
      `768 Pima Indian female patients, 8 clinical features, ${diabetesStats.prevalenceRate}% diabetes prevalence.`,
      `Features: ${diabetesStats.features.map((f) => f.name).join(", ")}`,
      "",
      `### Drug Prescription Dataset (${drugStats.totalRecords} records)`,
      `200 patient records with 5 drugs: ${drugStats.drugs.map((d) => d.name).join(", ")}`,
      `Key factors: Na-to-K ratio, blood pressure, age, cholesterol`,
      "",
      "### Capabilities",
      "- Diabetes risk assessment (provide glucose, BMI, age, blood pressure)",
      "- Drug recommendation (provide age, Na-to-K ratio, blood pressure level)",
      "- Dataset statistics and insights",
      "- Risk factor analysis",
    ].join("\n"),
  };
}
