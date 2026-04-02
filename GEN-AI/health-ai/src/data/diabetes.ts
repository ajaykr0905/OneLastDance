export interface DiabetesRecord {
  pregnancies: number;
  glucose: number;
  bloodPressure: number;
  skinThickness: number;
  insulin: number;
  bmi: number;
  diabetesPedigreeFunction: number;
  age: number;
  outcome: 0 | 1;
}

export const diabetesStats = {
  totalRecords: 768,
  positiveOutcome: 268,
  negativeOutcome: 500,
  prevalenceRate: 34.9,
  features: [
    { name: "Pregnancies", mean: 3.85, std: 3.37, min: 0, max: 17, description: "Number of times pregnant" },
    { name: "Glucose", mean: 120.89, std: 31.97, min: 0, max: 199, description: "Plasma glucose concentration (mg/dL) at 2 hours in an oral glucose tolerance test" },
    { name: "BloodPressure", mean: 69.11, std: 19.36, min: 0, max: 122, description: "Diastolic blood pressure (mm Hg)" },
    { name: "SkinThickness", mean: 20.54, std: 15.95, min: 0, max: 99, description: "Triceps skin fold thickness (mm)" },
    { name: "Insulin", mean: 79.80, std: 115.24, min: 0, max: 846, description: "2-Hour serum insulin (mu U/ml)" },
    { name: "BMI", mean: 31.99, std: 7.88, min: 0, max: 67.1, description: "Body mass index (weight in kg / height in m^2)" },
    { name: "DiabetesPedigreeFunction", mean: 0.47, std: 0.33, min: 0.078, max: 2.42, description: "Diabetes pedigree function (genetic influence score)" },
    { name: "Age", mean: 33.24, std: 11.76, min: 21, max: 81, description: "Age in years" },
  ],
  ageDistribution: [
    { range: "21-30", count: 350, diabetic: 82, rate: 23.4 },
    { range: "31-40", count: 210, diabetic: 85, rate: 40.5 },
    { range: "41-50", count: 115, diabetic: 58, rate: 50.4 },
    { range: "51-60", count: 65, diabetic: 30, rate: 46.2 },
    { range: "61+", count: 28, diabetic: 13, rate: 46.4 },
  ],
  riskFactors: [
    { factor: "High Glucose (>140 mg/dL)", description: "Glucose levels above 140 mg/dL strongly correlate with diabetes diagnosis", impact: "high" as const },
    { factor: "High BMI (>30)", description: "Obesity (BMI > 30) significantly increases diabetes risk", impact: "high" as const },
    { factor: "Age > 40", description: "Risk increases substantially after age 40", impact: "medium" as const },
    { factor: "Family History", description: "High diabetes pedigree function indicates genetic predisposition", impact: "high" as const },
    { factor: "High Insulin Levels", description: "Elevated fasting insulin may indicate insulin resistance", impact: "medium" as const },
    { factor: "High Blood Pressure", description: "Hypertension often co-occurs with metabolic syndrome", impact: "medium" as const },
  ],
  keyInsights: [
    "The dataset contains 768 female patients of Pima Indian heritage, aged 21+.",
    "34.9% of patients were diagnosed with diabetes (Outcome = 1).",
    "Glucose levels above 140 mg/dL show a 70%+ correlation with positive diabetes outcome.",
    "BMI above 30 combined with age above 40 creates a compounding risk factor.",
    "Zero values in Glucose, BloodPressure, SkinThickness, Insulin, and BMI likely represent missing data.",
    "The diabetes pedigree function above 0.5 indicates strong genetic predisposition.",
  ],
};

export function assessDiabetesRisk(input: {
  glucose?: number;
  bmi?: number;
  age?: number;
  bloodPressure?: number;
  familyHistory?: boolean;
}): { level: "low" | "moderate" | "high" | "very-high"; score: number; factors: string[] } {
  let score = 0;
  const factors: string[] = [];

  if (input.glucose !== undefined) {
    if (input.glucose > 140) { score += 30; factors.push("High glucose (>140 mg/dL)"); }
    else if (input.glucose > 120) { score += 15; factors.push("Elevated glucose (>120 mg/dL)"); }
  }
  if (input.bmi !== undefined) {
    if (input.bmi > 35) { score += 25; factors.push("Obese (BMI >35)"); }
    else if (input.bmi > 30) { score += 15; factors.push("Overweight (BMI >30)"); }
  }
  if (input.age !== undefined) {
    if (input.age > 50) { score += 15; factors.push("Age above 50"); }
    else if (input.age > 40) { score += 10; factors.push("Age above 40"); }
  }
  if (input.bloodPressure !== undefined && input.bloodPressure > 90) {
    score += 10; factors.push("High blood pressure (>90 mm Hg)");
  }
  if (input.familyHistory) { score += 20; factors.push("Family history of diabetes"); }

  const level = score >= 60 ? "very-high" : score >= 40 ? "high" : score >= 20 ? "moderate" : "low";
  return { level, score, factors };
}
