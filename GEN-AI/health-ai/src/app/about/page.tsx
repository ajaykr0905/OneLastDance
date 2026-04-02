"use client";

import { motion } from "framer-motion";
import { Brain, Database, Cpu, Shield } from "lucide-react";

const stack = [
  { icon: Brain, name: "Google Gemini 2.0 Flash", desc: "State-of-the-art LLM for medical context understanding" },
  { icon: Cpu, name: "Next.js 15 + TypeScript", desc: "Full-stack React framework with API routes" },
  { icon: Database, name: "RAG Pipeline", desc: "Retrieval-Augmented Generation over clinical datasets" },
  { icon: Shield, name: "Tailwind CSS v4 + Framer Motion", desc: "Modern UI with accessible, responsive design" },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">About MedInsight AI</h1>
        <p className="mt-4 text-lg text-gray-600 leading-relaxed">
          MedInsight AI is a healthcare analytics agent built for the <strong>GEN-AI Hackathon</strong>. It uses Retrieval-Augmented Generation (RAG) to provide intelligent, data-grounded responses about diabetes risk assessment and drug recommendations.
        </p>
      </motion.div>

      <motion.section initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Datasets</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border p-5">
            <h3 className="font-semibold text-gray-900">Pima Indians Diabetes</h3>
            <p className="mt-1 text-sm text-gray-600">768 records from the National Institute of Diabetes and Digestive and Kidney Diseases. 8 clinical features predicting diabetes outcome.</p>
            <p className="mt-2 text-xs text-muted">Source: UCI Machine Learning Repository</p>
          </div>
          <div className="rounded-xl border border-border p-5">
            <h3 className="font-semibold text-gray-900">Drug Classification</h3>
            <p className="mt-1 text-sm text-gray-600">200 patient records with 5 drug types. Features include age, sex, blood pressure, cholesterol, and Na-to-K ratio.</p>
            <p className="mt-2 text-xs text-muted">Source: Drug classification dataset</p>
          </div>
        </div>
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Tech Stack</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {stack.map((s) => (
            <div key={s.name} className="flex items-start gap-3 rounded-xl border border-border p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><s.icon className="h-5 w-5" /></div>
              <div><p className="font-medium text-gray-900">{s.name}</p><p className="text-sm text-gray-500">{s.desc}</p></div>
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-12 rounded-xl border border-amber-200 bg-amber-50 p-6">
        <h2 className="text-lg font-bold text-amber-800 mb-2">Disclaimer</h2>
        <p className="text-sm text-amber-700 leading-relaxed">
          MedInsight AI is an educational tool built for a hackathon. It does <strong>not</strong> provide medical diagnoses, treatment plans, or clinical advice. Always consult qualified healthcare professionals for medical decisions. The datasets used are for research and learning purposes only.
        </p>
      </motion.section>
    </div>
  );
}
