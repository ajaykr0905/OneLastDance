"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Pill, Scale, ArrowRight, ArrowLeft, RotateCcw, Sparkles, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MetricSlider } from "@/components/metric-slider";
import { RiskGauge } from "@/components/risk-gauge";
import { ComparisonBar } from "@/components/comparison-bar";
import { assessDiabetesRiskFull, getBmiCategory, type RiskResult } from "@/data/diabetes";
import { suggestDrug } from "@/data/drugs";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "diabetes", label: "Diabetes Risk", icon: Activity },
  { id: "bmi", label: "BMI Calculator", icon: Scale },
  { id: "drug", label: "Drug Recommendation", icon: Pill },
] as const;

type Tab = (typeof TABS)[number]["id"];

function DiabetesCalculator() {
  const [step, setStep] = useState(0);
  const [age, setAge] = useState(35);
  const [sex, setSex] = useState<"M" | "F">("F");
  const [familyHistory, setFamilyHistory] = useState(false);
  const [pregnancies, setPregnancies] = useState(0);
  const [glucose, setGlucose] = useState(110);
  const [bp, setBp] = useState(72);
  const [insulin, setInsulin] = useState(80);
  const [heightFt, setHeightFt] = useState(5);
  const [heightIn, setHeightIn] = useState(4);
  const [weight, setWeight] = useState(70);
  const [skinThickness, setSkinThickness] = useState(20);
  const [showResult, setShowResult] = useState(false);

  const heightM = (heightFt * 12 + heightIn) * 0.0254;
  const bmi = weight / (heightM * heightM);

  const result: RiskResult = useMemo(
    () =>
      assessDiabetesRiskFull({
        age,
        glucose,
        bloodPressure: bp,
        bmi,
        insulin,
        skinThickness,
        pregnancies: sex === "F" ? pregnancies : undefined,
        familyHistory,
      }),
    [age, glucose, bp, bmi, insulin, skinThickness, pregnancies, sex, familyHistory],
  );

  const reset = () => { setStep(0); setShowResult(false); setAge(35); setSex("F"); setFamilyHistory(false); setPregnancies(0); setGlucose(110); setBp(72); setInsulin(80); setHeightFt(5); setHeightIn(4); setWeight(70); setSkinThickness(20); };

  const steps = [
    {
      title: "Personal Information",
      subtitle: "Basic demographics and family history",
      content: (
        <div className="space-y-6">
          <MetricSlider label="Age" value={age} onChange={setAge} min={18} max={90} unit="years" thresholds={{ borderline: 40, high: 50 }} />
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Biological Sex</label>
            <div className="flex gap-2">
              {(["F", "M"] as const).map((s) => (
                <button key={s} onClick={() => setSex(s)} className={cn("flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all cursor-pointer", sex === s ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50")}>
                  {s === "F" ? "Female" : "Male"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Family History of Diabetes</label>
            <div className="flex gap-2">
              {[true, false].map((v) => (
                <button key={String(v)} onClick={() => setFamilyHistory(v)} className={cn("flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all cursor-pointer", familyHistory === v ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50")}>
                  {v ? "Yes" : "No"}
                </button>
              ))}
            </div>
          </div>
          {sex === "F" && <MetricSlider label="Number of Pregnancies" value={pregnancies} onChange={setPregnancies} min={0} max={17} thresholds={{ borderline: 4, high: 6 }} />}
        </div>
      ),
    },
    {
      title: "Vital Signs",
      subtitle: "Clinical measurements and lab values",
      content: (
        <div className="space-y-6">
          <MetricSlider label="Glucose Level" value={glucose} onChange={setGlucose} min={50} max={250} unit="mg/dL" helper="Plasma glucose (2-hr oral test)" thresholds={{ borderline: 120, high: 140 }} />
          <MetricSlider label="Blood Pressure" value={bp} onChange={setBp} min={40} max={140} unit="mm Hg" helper="Diastolic reading" thresholds={{ borderline: 80, high: 90 }} />
          <MetricSlider label="Insulin Level" value={insulin} onChange={setInsulin} min={0} max={850} unit="mu U/ml" helper="2-hour serum insulin" thresholds={{ borderline: 100, high: 150 }} />
        </div>
      ),
    },
    {
      title: "Body Metrics",
      subtitle: "Physical measurements for BMI calculation",
      content: (
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Height</label>
            <div className="flex gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <input type="number" value={heightFt} onChange={(e) => setHeightFt(Math.max(3, Math.min(7, parseInt(e.target.value) || 0)))} min={3} max={7} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-center focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100" aria-label="Height feet" />
                  <span className="text-xs text-gray-400 shrink-0">ft</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <input type="number" value={heightIn} onChange={(e) => setHeightIn(Math.max(0, Math.min(11, parseInt(e.target.value) || 0)))} min={0} max={11} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-center focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100" aria-label="Height inches" />
                  <span className="text-xs text-gray-400 shrink-0">in</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Weight</label>
            <div className="flex items-center gap-2">
              <input type="number" value={weight} onChange={(e) => setWeight(Math.max(30, Math.min(200, parseFloat(e.target.value) || 0)))} min={30} max={200} step={0.5} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100" aria-label="Weight in kg" />
              <span className="text-xs text-gray-400 shrink-0">kg</span>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Calculated BMI</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-900">{bmi.toFixed(1)}</span>
                <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-bold", getBmiCategory(bmi).color)}>{getBmiCategory(bmi).label}</span>
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-400">Dataset average: 31.99</p>
          </div>
          <MetricSlider label="Skin Fold Thickness (optional)" value={skinThickness} onChange={setSkinThickness} min={0} max={99} unit="mm" helper="Triceps skin fold" thresholds={{ borderline: 30, high: 40 }} />
        </div>
      ),
    },
  ];

  if (showResult) {
    return (
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Assessment Results</h3>
          <Button variant="outline" size="sm" onClick={reset}><RotateCcw className="h-3.5 w-3.5" /> Start Over</Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="flex flex-col items-center py-8">
            <RiskGauge score={result.score} level={result.level} />
            <p className="mt-4 max-w-xs text-center text-sm text-gray-600">{result.recommendation}</p>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Contributing Factors</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {result.factors.length === 0 && <p className="text-sm text-gray-400">No significant risk factors identified.</p>}
                {result.factors.map((f) => (
                  <div key={f.name} className="flex items-center gap-3">
                    <div className="w-full">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">{f.name}</span>
                        <span className="text-xs font-semibold text-blue-600">+{f.points} pts</span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${(f.points / 25) * 100}%` }} transition={{ duration: 0.6 }} className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600" />
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5">{f.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle className="text-base">Your Values vs Dataset Average</CardTitle></CardHeader>
          <CardContent>
            <div className="grid gap-5 sm:grid-cols-2">
              {result.comparisons.map((c) => (
                <ComparisonBar key={c.metric} comp={c} />
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-xs text-amber-700"><strong>Disclaimer:</strong> This is an educational tool and does not constitute medical advice. Consult a healthcare professional for diagnosis.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        {steps.map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={cn("flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors", i === step ? "bg-blue-600 text-white" : i < step ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400")}>
              {i + 1}
            </div>
            {i < steps.length - 1 && <div className={cn("h-0.5 w-8 rounded-full", i < step ? "bg-blue-400" : "bg-gray-200")} />}
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-lg font-bold text-gray-900">{steps[step].title}</h3>
        <p className="text-sm text-gray-500">{steps[step].subtitle}</p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
          {steps[step].content}
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={() => setStep(step - 1)} disabled={step === 0}><ArrowLeft className="h-4 w-4" /> Back</Button>
        {step < steps.length - 1 ? (
          <Button onClick={() => setStep(step + 1)} className="bg-blue-600 hover:bg-blue-500">Next <ArrowRight className="h-4 w-4" /></Button>
        ) : (
          <Button onClick={() => setShowResult(true)} className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500">
            <Sparkles className="h-4 w-4" /> Calculate Risk
          </Button>
        )}
      </div>
    </div>
  );
}

function BmiCalculator() {
  const [heightFt, setHeightFt] = useState(5);
  const [heightIn, setHeightIn] = useState(6);
  const [weight, setWeight] = useState(70);

  const heightM = (heightFt * 12 + heightIn) * 0.0254;
  const bmi = heightM > 0 ? weight / (heightM * heightM) : 0;
  const cat = getBmiCategory(bmi);

  const categories = [
    { label: "Underweight", range: "< 18.5", min: 0, max: 18.5 },
    { label: "Normal", range: "18.5 - 24.9", min: 18.5, max: 25 },
    { label: "Overweight", range: "25 - 29.9", min: 25, max: 30 },
    { label: "Obese I", range: "30 - 34.9", min: 30, max: 35 },
    { label: "Obese II", range: "35 - 39.9", min: 35, max: 40 },
    { label: "Obese III", range: "40+", min: 40, max: 70 },
  ];
  const colors = ["bg-blue-400", "bg-green-400", "bg-amber-400", "bg-orange-400", "bg-red-400", "bg-red-600"];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">Height</label>
          <div className="flex gap-3">
            <div className="flex-1 flex items-center gap-2">
              <input type="number" value={heightFt} onChange={(e) => setHeightFt(Math.max(3, Math.min(7, parseInt(e.target.value) || 0)))} min={3} max={7} className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-center focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100" aria-label="Feet" /><span className="text-xs text-gray-400">ft</span>
            </div>
            <div className="flex-1 flex items-center gap-2">
              <input type="number" value={heightIn} onChange={(e) => setHeightIn(Math.max(0, Math.min(11, parseInt(e.target.value) || 0)))} min={0} max={11} className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-center focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100" aria-label="Inches" /><span className="text-xs text-gray-400">in</span>
            </div>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">Weight</label>
          <div className="flex items-center gap-2">
            <input type="number" value={weight} onChange={(e) => setWeight(Math.max(20, Math.min(250, parseFloat(e.target.value) || 0)))} step={0.5} className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100" aria-label="Weight" /><span className="text-xs text-gray-400">kg</span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-gradient-to-br from-gray-50 to-blue-50/30 p-8 text-center">
        <p className="text-sm text-gray-500 mb-2">Your BMI</p>
        <motion.p key={bmi.toFixed(1)} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-6xl font-bold text-gray-900">
          {bmi.toFixed(1)}
        </motion.p>
        <span className={cn("mt-3 inline-block rounded-full border px-4 py-1.5 text-sm font-bold", cat.color)}>{cat.label}</span>
        <p className="mt-3 text-xs text-gray-400">Dataset average BMI: <span className="font-semibold text-gray-600">31.99</span></p>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">BMI Scale</p>
        <div className="flex rounded-lg overflow-hidden h-4">
          {categories.map((c, i) => (
            <div key={c.label} className={cn("flex-1 relative", colors[i])} title={`${c.label}: ${c.range}`}>
              {bmi >= c.min && bmi < c.max && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 h-6 w-1.5 rounded-full bg-gray-900 shadow-md" style={{ left: `${((bmi - c.min) / (c.max - c.min)) * 100}%` }} />
              )}
            </div>
          ))}
        </div>
        <div className="flex mt-1">
          {categories.map((c) => (<span key={c.label} className="flex-1 text-[9px] text-gray-400 text-center">{c.label}</span>))}
        </div>
      </div>
    </div>
  );
}

function DrugCalculator() {
  const [age, setAge] = useState(45);
  const [naToK, setNaToK] = useState(14);
  const [bp, setBp] = useState<"LOW" | "NORMAL" | "HIGH">("NORMAL");
  const [chol, setChol] = useState<"NORMAL" | "HIGH">("NORMAL");

  const result = useMemo(() => suggestDrug({ age, naToK, bp, cholesterol: chol }), [age, naToK, bp, chol]);

  const drugColors: Record<string, string> = {
    drugY: "from-blue-500 to-cyan-500",
    drugX: "from-emerald-500 to-teal-500",
    drugA: "from-violet-500 to-purple-500",
    drugB: "from-orange-500 to-red-500",
    drugC: "from-pink-500 to-rose-500",
  };

  return (
    <div className="space-y-6">
      <MetricSlider label="Patient Age" value={age} onChange={setAge} min={18} max={90} unit="years" />
      <MetricSlider label="Na-to-K Ratio" value={naToK} onChange={setNaToK} min={5} max={40} step={0.1} helper="Sodium-to-potassium ratio" thresholds={{ borderline: 12, high: 15 }} />
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">Blood Pressure Level</label>
        <div className="flex gap-2">
          {(["LOW", "NORMAL", "HIGH"] as const).map((v) => (
            <button key={v} onClick={() => setBp(v)} className={cn("flex-1 rounded-lg border px-3 py-2.5 text-sm font-medium transition-all cursor-pointer", bp === v ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50")}>{v}</button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">Cholesterol Level</label>
        <div className="flex gap-2">
          {(["NORMAL", "HIGH"] as const).map((v) => (
            <button key={v} onClick={() => setChol(v)} className={cn("flex-1 rounded-lg border px-3 py-2.5 text-sm font-medium transition-all cursor-pointer", chol === v ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50")}>{v}</button>
          ))}
        </div>
      </div>

      <motion.div key={result.drug} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={cn("rounded-2xl bg-gradient-to-br p-6 text-white", drugColors[result.drug] ?? "from-gray-500 to-gray-600")}>
        <p className="text-xs font-semibold uppercase tracking-wider opacity-80">Recommended Drug</p>
        <p className="text-3xl font-bold mt-1">{result.drug}</p>
        <div className="mt-3 flex items-center gap-2">
          <span className="inline-flex rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold">{result.confidence} Confidence</span>
        </div>
        <div className="mt-4 rounded-xl bg-white/10 p-3">
          <p className="text-sm flex items-start gap-2"><ChevronRight className="h-4 w-4 shrink-0 mt-0.5" />{result.reasoning}</p>
        </div>
      </motion.div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-xs text-amber-700"><strong>Disclaimer:</strong> This is a data-driven suggestion based on 200 patient records and does not replace professional medical prescription.</p>
      </div>
    </div>
  );
}

export default function AssessPage() {
  const [tab, setTab] = useState<Tab>("diabetes");

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Health Assessment</h1>
        <p className="mt-2 text-gray-600">Interactive calculators powered by clinical datasets and AI analytics.</p>
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition-all whitespace-nowrap cursor-pointer",
              tab === t.id ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" : "bg-gray-100 text-gray-600 hover:bg-gray-200",
            )}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
          </button>
        ))}
      </div>

      <Card className="p-6 sm:p-8">
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }}>
            {tab === "diabetes" && <DiabetesCalculator />}
            {tab === "bmi" && <BmiCalculator />}
            {tab === "drug" && <DrugCalculator />}
          </motion.div>
        </AnimatePresence>
      </Card>
    </div>
  );
}
