"use client";

import { motion } from "framer-motion";

interface RiskGaugeProps {
  score: number;
  level: "low" | "moderate" | "high" | "very-high";
}

const LEVEL_CONFIG = {
  "low": { label: "LOW RISK", color: "#22c55e", bg: "bg-green-50 text-green-700 border-green-200" },
  "moderate": { label: "MODERATE", color: "#f59e0b", bg: "bg-amber-50 text-amber-700 border-amber-200" },
  "high": { label: "HIGH RISK", color: "#f97316", bg: "bg-orange-50 text-orange-700 border-orange-200" },
  "very-high": { label: "VERY HIGH", color: "#ef4444", bg: "bg-red-50 text-red-700 border-red-200" },
};

export function RiskGauge({ score, level }: RiskGaugeProps) {
  const config = LEVEL_CONFIG[level];
  const radius = 80;
  const strokeWidth = 14;
  const circumference = Math.PI * radius;
  const progress = (score / 100) * circumference;
  const cx = 100;
  const cy = 100;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <svg width="200" height="120" viewBox="0 0 200 120" aria-hidden="true">
          <path
            d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          <motion.path
            d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
            fill="none"
            stroke={config.color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - progress }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
          <motion.span
            className="text-4xl font-bold text-gray-900"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {score}
          </motion.span>
          <span className="text-xs text-gray-400">/ 100</span>
        </div>
      </div>
      <span className={`inline-flex rounded-full border px-4 py-1.5 text-xs font-bold tracking-wider ${config.bg}`}>
        {config.label}
      </span>
    </div>
  );
}
