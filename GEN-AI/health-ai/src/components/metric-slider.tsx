"use client";

import { cn } from "@/lib/utils";

interface MetricSliderProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  helper?: string;
  thresholds?: { borderline: number; high: number };
}

function getStatus(value: number, thresholds?: { borderline: number; high: number }) {
  if (!thresholds) return "normal" as const;
  if (value > thresholds.high) return "high" as const;
  if (value > thresholds.borderline) return "borderline" as const;
  return "normal" as const;
}

const STATUS_STYLES = {
  normal: "text-green-600 bg-green-50 border-green-200",
  borderline: "text-amber-600 bg-amber-50 border-amber-200",
  high: "text-red-600 bg-red-50 border-red-200",
};

const TRACK_STYLES = {
  normal: "accent-green-500",
  borderline: "accent-amber-500",
  high: "accent-red-500",
};

export function MetricSlider({ label, value, onChange, min, max, step = 1, unit, helper, thresholds }: MetricSliderProps) {
  const status = getStatus(value, thresholds);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={value}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              if (!isNaN(v) && v >= min && v <= max) onChange(v);
            }}
            min={min}
            max={max}
            step={step}
            className="w-20 rounded-lg border border-gray-200 bg-white px-2 py-1 text-right text-sm font-medium text-gray-900 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
            aria-label={`${label} value`}
          />
          {unit && <span className="text-xs text-gray-400 w-12">{unit}</span>}
          {thresholds && (
            <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase", STATUS_STYLES[status])}>
              {status}
            </span>
          )}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className={cn("w-full h-2 rounded-full appearance-none cursor-pointer bg-gray-200", TRACK_STYLES[status])}
        aria-label={label}
      />
      <div className="flex justify-between text-[10px] text-gray-400">
        <span>{min}{unit ? ` ${unit}` : ""}</span>
        {helper && <span className="text-center italic">{helper}</span>}
        <span>{max}{unit ? ` ${unit}` : ""}</span>
      </div>
    </div>
  );
}
