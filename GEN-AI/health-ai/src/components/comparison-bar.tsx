"use client";

import { motion } from "framer-motion";
import type { MetricComparison } from "@/data/diabetes";

const STATUS_DOT = {
  normal: "bg-green-500",
  borderline: "bg-amber-500",
  high: "bg-red-500",
};

export function ComparisonBar({ comp }: { comp: MetricComparison }) {
  const maxVal = Math.max(comp.value, comp.datasetMean) * 1.3;
  const userPct = (comp.value / maxVal) * 100;
  const meanPct = (comp.datasetMean / maxVal) * 100;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-gray-700 flex items-center gap-2">
          <span className={`inline-block h-2 w-2 rounded-full ${STATUS_DOT[comp.status]}`} />
          {comp.metric}
        </span>
        <span className="text-xs text-gray-500">
          You: <span className="font-semibold text-gray-900">{comp.value}</span> / Avg: {comp.datasetMean}
        </span>
      </div>
      <div className="relative h-4 rounded-full bg-gray-100 overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full rounded-full bg-blue-500/80"
          initial={{ width: 0 }}
          animate={{ width: `${userPct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        <div
          className="absolute top-0 h-full w-0.5 bg-gray-900/60"
          style={{ left: `${meanPct}%` }}
          title={`Dataset average: ${comp.datasetMean}`}
        />
      </div>
      <div className="flex justify-between text-[10px] text-gray-400">
        <span>Your value</span>
        <span>▲ Dataset avg ({comp.datasetMean})</span>
      </div>
    </div>
  );
}
