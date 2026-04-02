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

export interface RiskFactor {
  name: string;
  points: number;
  message: string;
}

export interface MetricComparison {
  metric: string;
  value: number;
  datasetMean: number;
  status: "normal" | "borderline" | "high";
}

export interface RiskResult {
  level: "low" | "moderate" | "high" | "very-high";
  score: number;
  factors: RiskFactor[];
  comparisons: MetricComparison[];
  recommendation: string;
}

export interface FullAssessmentInput {
  age: number;
  glucose: number;
  bloodPressure: number;
  bmi: number;
  insulin?: number;
  skinThickness?: number;
  pregnancies?: number;
  familyHistory: boolean;
}

function compareToMean(value: number, mean: number, highThreshold: number, borderlineThreshold: number): MetricComparison["status"] {
  if (value > highThreshold) return "high";
  if (value > borderlineThreshold) return "borderline";
  return "normal";
}

export function assessDiabetesRiskFull(input: FullAssessmentInput): RiskResult {
  const factors: RiskFactor[] = [];
  let score = 0;

  if (input.glucose > 140) {
    const pts = 25; score += pts;
    factors.push({ name: "Glucose", points: pts, message: `Very high glucose at ${input.glucose} mg/dL (threshold: 140)` });
  } else if (input.glucose > 120) {
    const pts = 12; score += pts;
    factors.push({ name: "Glucose", points: pts, message: `Elevated glucose at ${input.glucose} mg/dL (threshold: 120)` });
  } else if (input.glucose > 100) {
    const pts = 5; score += pts;
    factors.push({ name: "Glucose", points: pts, message: `Mildly elevated glucose at ${input.glucose} mg/dL` });
  }

  if (input.bmi > 40) {
    const pts = 20; score += pts;
    factors.push({ name: "BMI", points: pts, message: `Severe obesity with BMI ${input.bmi.toFixed(1)} (Class III)` });
  } else if (input.bmi > 35) {
    const pts = 16; score += pts;
    factors.push({ name: "BMI", points: pts, message: `Obese with BMI ${input.bmi.toFixed(1)} (Class II)` });
  } else if (input.bmi > 30) {
    const pts = 10; score += pts;
    factors.push({ name: "BMI", points: pts, message: `Overweight with BMI ${input.bmi.toFixed(1)} (Class I)` });
  }

  if (input.age > 60) {
    const pts = 15; score += pts;
    factors.push({ name: "Age", points: pts, message: `Age ${input.age} significantly increases risk` });
  } else if (input.age > 50) {
    const pts = 12; score += pts;
    factors.push({ name: "Age", points: pts, message: `Age ${input.age} is a notable risk factor` });
  } else if (input.age > 40) {
    const pts = 8; score += pts;
    factors.push({ name: "Age", points: pts, message: `Age ${input.age} carries moderate risk` });
  }

  if (input.bloodPressure > 100) {
    const pts = 10; score += pts;
    factors.push({ name: "Blood Pressure", points: pts, message: `High diastolic BP at ${input.bloodPressure} mm Hg (>100)` });
  } else if (input.bloodPressure > 90) {
    const pts = 5; score += pts;
    factors.push({ name: "Blood Pressure", points: pts, message: `Elevated diastolic BP at ${input.bloodPressure} mm Hg (>90)` });
  }

  if (input.familyHistory) {
    const pts = 15; score += pts;
    factors.push({ name: "Family History", points: pts, message: "Genetic predisposition to diabetes" });
  }

  if (input.insulin !== undefined && input.insulin > 150) {
    const pts = 8; score += pts;
    factors.push({ name: "Insulin", points: pts, message: `Elevated insulin at ${input.insulin} mu U/ml may indicate resistance` });
  } else if (input.insulin !== undefined && input.insulin > 100) {
    const pts = 4; score += pts;
    factors.push({ name: "Insulin", points: pts, message: `Mildly elevated insulin at ${input.insulin} mu U/ml` });
  }

  if (input.skinThickness !== undefined && input.skinThickness > 40) {
    const pts = 3; score += pts;
    factors.push({ name: "Skin Thickness", points: pts, message: `Elevated triceps skin fold at ${input.skinThickness} mm` });
  }

  if (input.pregnancies !== undefined && input.pregnancies >= 6) {
    const pts = 5; score += pts;
    factors.push({ name: "Pregnancies", points: pts, message: `${input.pregnancies} pregnancies increases gestational diabetes risk` });
  }

  score = Math.min(score, 100);

  const comparisons: MetricComparison[] = [
    { metric: "Glucose (mg/dL)", value: input.glucose, datasetMean: 120.89, status: compareToMean(input.glucose, 120.89, 140, 120) },
    { metric: "Blood Pressure (mm Hg)", value: input.bloodPressure, datasetMean: 69.11, status: compareToMean(input.bloodPressure, 69.11, 90, 80) },
    { metric: "BMI", value: input.bmi, datasetMean: 31.99, status: compareToMean(input.bmi, 31.99, 35, 30) },
    { metric: "Age", value: input.age, datasetMean: 33.24, status: compareToMean(input.age, 33.24, 50, 40) },
  ];

  if (input.insulin !== undefined) {
    comparisons.push({ metric: "Insulin (mu U/ml)", value: input.insulin, datasetMean: 79.80, status: compareToMean(input.insulin, 79.80, 150, 100) });
  }

  const level: RiskResult["level"] = score >= 60 ? "very-high" : score >= 40 ? "high" : score >= 20 ? "moderate" : "low";

  const recommendations: Record<RiskResult["level"], string> = {
    "low": "Your risk profile is favorable. Maintain a healthy diet, regular exercise, and schedule routine checkups.",
    "moderate": "Some risk factors detected. Consider lifestyle modifications — regular exercise, balanced diet, weight management. Schedule a fasting glucose test with your doctor.",
    "high": "Multiple risk factors present. Strongly recommend consulting a healthcare provider for comprehensive metabolic screening including HbA1c testing.",
    "very-high": "Significant risk factors detected. Urgent medical consultation recommended. Request a full metabolic panel including fasting glucose, HbA1c, and lipid profile.",
  };

  return { level, score, factors, comparisons, recommendation: recommendations[level] };
}

export function assessDiabetesRisk(input: {
  glucose?: number;
  bmi?: number;
  age?: number;
  bloodPressure?: number;
  familyHistory?: boolean;
}): { level: "low" | "moderate" | "high" | "very-high"; score: number; factors: string[] } {
  const result = assessDiabetesRiskFull({
    glucose: input.glucose ?? 100,
    bmi: input.bmi ?? 25,
    age: input.age ?? 30,
    bloodPressure: input.bloodPressure ?? 70,
    familyHistory: input.familyHistory ?? false,
  });
  return { level: result.level, score: result.score, factors: result.factors.map((f) => f.message) };
}

export function getBmiCategory(bmi: number): { label: string; color: string } {
  if (bmi < 18.5) return { label: "Underweight", color: "text-blue-600 bg-blue-50" };
  if (bmi < 25) return { label: "Normal", color: "text-green-600 bg-green-50" };
  if (bmi < 30) return { label: "Overweight", color: "text-amber-600 bg-amber-50" };
  if (bmi < 35) return { label: "Obese I", color: "text-orange-600 bg-orange-50" };
  if (bmi < 40) return { label: "Obese II", color: "text-red-500 bg-red-50" };
  return { label: "Obese III", color: "text-red-700 bg-red-50" };
}
