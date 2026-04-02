"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Brain, Activity, Pill, Database, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { diabetesStats } from "@/data/diabetes";
import { drugStats } from "@/data/drugs";

const stats = [
  { label: "Patient Records", value: diabetesStats.totalRecords + drugStats.totalRecords, icon: Database },
  { label: "Clinical Features", value: 14, icon: Activity },
  { label: "Drug Types", value: drugStats.drugs.length, icon: Pill },
];

const features = [
  { icon: Brain, title: "Diabetes Risk Assessment", description: "Input patient metrics (glucose, BMI, age, BP) and get an instant risk evaluation with contributing factors analysis.", color: "from-blue-500 to-cyan-500" },
  { icon: Pill, title: "Drug Recommendation", description: "Based on Na-to-K ratio, blood pressure, age, and cholesterol, get data-driven drug suggestions with confidence levels.", color: "from-violet-500 to-purple-500" },
  { icon: Activity, title: "Dataset Analytics", description: "Explore statistical insights from 768 diabetes records and 200 drug prescription cases with detailed breakdowns.", color: "from-emerald-500 to-teal-500" },
  { icon: Shield, title: "Risk Factor Analysis", description: "Understand which clinical indicators have the highest impact on diabetes outcomes and drug selection.", color: "from-orange-500 to-red-500" },
  { icon: Zap, title: "Powered by Gemini", description: "Google Gemini 2.0 Flash provides intelligent, context-aware responses grounded in real clinical data.", color: "from-pink-500 to-rose-500" },
  { icon: Database, title: "Open Data", description: "Built on the Pima Indians Diabetes Dataset and a drug classification dataset, both widely used in medical ML research.", color: "from-blue-500 to-indigo-500" },
];

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-violet-50 to-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(59,130,246,0.08),transparent_60%)]" />
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-32 relative z-10">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold text-blue-700 uppercase tracking-wider mb-6">
              <Brain className="h-3.5 w-3.5" /> GEN-AI Hackathon
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl leading-[1.1]">
              AI-Powered{" "}
              <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">Healthcare Analytics</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-xl">
              Analyze diabetes risk, explore drug recommendations, and query clinical datasets with an intelligent AI agent backed by real patient data.
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

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }} className="mt-16 grid max-w-lg grid-cols-3 gap-6">
            {stats.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }}
                className="rounded-xl border border-blue-100 bg-white/80 backdrop-blur-sm p-4 text-center shadow-sm">
                <s.icon className="h-5 w-5 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Capabilities</h2>
          <p className="mt-3 text-gray-600 max-w-xl mx-auto">Intelligent healthcare analytics powered by clinical data and Google Gemini.</p>
        </motion.div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="group rounded-2xl border border-border bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1">
              <div className={`inline-flex rounded-xl bg-gradient-to-br ${f.color} p-3 text-white shadow-sm mb-4`}>
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-gray-900">{f.title}</h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
