"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Brain, Activity, Pill, Database, Shield, Zap, ChevronRight, BarChart3, Users, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { diabetesStats } from "@/data/diabetes";
import { drugStats } from "@/data/drugs";

const stats = [
  { label: "Patient Records", value: "968", icon: Users, detail: "Across 2 datasets" },
  { label: "Clinical Features", value: "14", icon: Activity, detail: "8 diabetes + 6 drug" },
  { label: "Drug Types", value: "5", icon: Pill, detail: "drugA through drugY" },
  { label: "Prevalence Rate", value: "34.9%", icon: BarChart3, detail: "Diabetes positive" },
];

const features = [
  {
    icon: Brain,
    title: "Diabetes Risk Assessment",
    color: "from-blue-500 to-cyan-500",
    description: "Get a personalized diabetes risk score by entering clinical metrics. The engine evaluates multiple factors and returns a risk level with detailed explanations.",
    bullets: [
      "Inputs: Glucose (mg/dL), BMI, Age, Blood Pressure, Family History",
      "Outputs: Risk level (Low / Moderate / High / Very High) with score out of 100",
      "Each contributing factor is explained with its individual impact",
    ],
    example: "\"Assess risk: glucose 160, BMI 34, age 52\"",
  },
  {
    icon: Pill,
    title: "Drug Recommendation Engine",
    color: "from-violet-500 to-purple-500",
    description: "A decision-tree based system that suggests the most appropriate drug from 5 options based on patient vitals, mirroring real clinical decision patterns.",
    bullets: [
      "Primary factor: Na-to-K ratio (>15 strongly predicts drugY)",
      "Secondary: Blood pressure level + age determine drugA/B/C/X",
      "Returns drug name, confidence level, and reasoning chain",
    ],
    example: "\"Recommend drug for age 55, Na-to-K 18, high BP\"",
  },
  {
    icon: Activity,
    title: "Dataset Analytics & Insights",
    color: "from-emerald-500 to-teal-500",
    description: "Explore pre-computed statistics from 768 Pima Indians diabetes records and 200 drug prescription cases with interactive breakdowns on the dashboard.",
    bullets: [
      `Diabetes dataset: ${diabetesStats.features.length} features including Glucose, BMI, Insulin, Age`,
      `Drug dataset: ${drugStats.drugs.length} drugs — ${drugStats.drugs.map(d => `${d.name} (${d.percentage}%)`).join(", ")}`,
      "Age-stratified diabetes rates from 23.4% (21-30) to 50.4% (41-50)",
    ],
    example: "Visit the Dashboard for interactive charts",
  },
  {
    icon: Shield,
    title: "Risk Factor Analysis",
    color: "from-orange-500 to-red-500",
    description: "Understand which clinical indicators carry the most weight in predicting diabetes outcomes and influencing drug selection decisions.",
    bullets: [
      "High Glucose (>140 mg/dL): 70%+ correlation with positive diabetes outcome",
      "BMI >30 + Age >40: compounding risk multiplier in the dataset",
      "Na-to-K ratio is the single strongest predictor for drug type selection",
    ],
    example: "\"What factors predict diabetes the most?\"",
  },
  {
    icon: Zap,
    title: "Gemini 2.0 Flash AI Engine",
    color: "from-pink-500 to-rose-500",
    description: "Every query goes through a RAG pipeline: your question is analyzed, relevant data is retrieved from both datasets, then sent to Google Gemini for intelligent synthesis.",
    bullets: [
      "Natural language understanding — extract glucose, BMI, age from free text",
      "Context-aware responses grounded in actual patient data statistics",
      "Works in offline mode too — returns raw analytics without an API key",
    ],
    example: "\"My glucose is 180, check my risk\"",
  },
  {
    icon: Database,
    title: "Open Research Data",
    color: "from-blue-500 to-indigo-500",
    description: "Built on two well-established clinical datasets used extensively in medical machine learning research, ensuring reproducible and verifiable results.",
    bullets: [
      "Pima Indians Diabetes: 768 female patients, 21+ years, 8 clinical measurements (UCI ML Repository)",
      "Drug Classification: 200 patients, 5 drug types based on Na-to-K, BP, age, cholesterol",
      "Zero values in some fields represent missing data, accounted for in analysis",
    ],
    example: "\"Tell me about the diabetes dataset\"",
  },
];

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-violet-50 to-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(59,130,246,0.08),transparent_60%)]" />
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 relative z-10">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold text-blue-700 uppercase tracking-wider mb-6">
              <FlaskConical className="h-3.5 w-3.5" /> GEN-AI Hackathon
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl leading-[1.1]">
              AI-Powered{" "}
              <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">Healthcare Analytics</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-xl">
              Analyze diabetes risk, explore drug recommendations, and query clinical datasets with an intelligent AI agent backed by 968 real patient records.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20">
                  View Dashboard <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg">Learn More</Button>
              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }} className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl">
            {stats.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }}
                className="rounded-xl border border-blue-100 bg-white/80 backdrop-blur-sm p-4 text-center shadow-sm">
                <s.icon className="h-5 w-5 text-blue-500 mx-auto mb-2" aria-hidden="true" />
                <p className="text-2xl font-bold text-blue-600">{s.value}</p>
                <p className="text-xs font-medium text-gray-700">{s.label}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{s.detail}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">What MedInsight AI Can Do</h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Six core capabilities powered by clinical datasets, a RAG retrieval engine, and Google Gemini 2.0 Flash.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group rounded-2xl border border-border bg-white shadow-sm transition-all hover:shadow-lg hover:border-blue-200"
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`shrink-0 inline-flex rounded-xl bg-gradient-to-br ${f.color} p-3 text-white shadow-sm`}>
                    <f.icon className="h-6 w-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-gray-900">{f.title}</h3>
                    <p className="mt-1.5 text-sm text-gray-600 leading-relaxed">{f.description}</p>
                  </div>
                </div>

                <ul className="mt-4 space-y-2 ml-[60px]">
                  {f.bullets.map((b, bi) => (
                    <li key={bi} className="flex items-start gap-2 text-sm text-gray-700">
                      <ChevronRight className="h-4 w-4 shrink-0 text-blue-400 mt-0.5" aria-hidden="true" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 ml-[60px] rounded-lg bg-gray-50 border border-gray-100 px-3 py-2">
                  <p className="text-xs text-gray-500">
                    <span className="font-semibold text-gray-600">Try it: </span>
                    <span className="italic">{f.example}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-gray-600 mb-4">Ready to explore the data?</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-500">
                <BarChart3 className="h-4 w-4" /> Open Dashboard
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg">
                <Database className="h-4 w-4" /> About the Data
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
